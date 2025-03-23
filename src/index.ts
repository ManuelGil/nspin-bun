import { styleText } from 'node:util';
import { performance } from 'perf_hooks';

import { clearLine } from './helpers/console';
import type { FormatOptions } from './types/format-options';
import type { SpinnerOptions } from './types/spinner-options';

/**
 * Spinner: The spinner class.
 * This class is used to display a spinner animation in the console.
 *
 * @public
 * @example
 * const spinner = new Spinner();
 * spinner.start('Loading...');
 * spinner.stop('Done!');
 *
 * @returns {Spinner} - The spinner instance
 */
export class Spinner {
  // --------------------------------------------------
  // Properties
  // --------------------------------------------------

  // Private properties

  /**
   * frames: The frames for the spinner animation.
   * The frames are displayed in sequence to create the spinner animation.
   *
   * @type {string[]}
   * @private
   * @example
   * console.log(spinner.frames);
   *
   * @returns {string} - The frames for the spinner animation
   */
  private frames: string[];

  /**
   * interval: The interval for the spinner animation.
   * The interval is the time between each frame of the spinner animation.
   *
   * @type {number}
   * @private
   * @example
   * console.log(spinner.interval);
   *
   * @returns {number} - The interval for the spinner animation
   */
  private interval: number;

  /**
   * format: The format for the spinner animation.
   * The format is used to change the style of the text in the console.
   *
   * @type {FormatOptions}
   * @private
   * @example
   * console.log(spinner.format);
   *
   * @returns {FormatOptions} - The format for the spinner animation
   */
  private format: FormatOptions;

  /**
   * timer: The timer for the spinner animation.
   * The timer is used to control the spinner animation.
   *
   * @type {ReturnType<typeof setInterval> | null}
   * @private
   * @example
   * console.log(spinner.timer);
   *
   * @returns {ReturnType<typeof setInterval> | null} - The timer for the spinner animation
   */
  private timer: ReturnType<typeof setInterval> | null = null;

  /**
   * currentFrame: The current frame for the spinner animation.
   * The current frame is used to display the spinner animation.
   *
   * @type {number}
   * @private
   * @example
   * console.log(spinner.currentFrame);
   *
   * @returns {number} - The current frame for the spinner animation
   */
  private currentFrame: number = 0;

  /**
   * text: The text for the spinner animation.
   * The text is displayed alongside the spinner animation.
   *
   * @type {string}
   * @private
   * @example
   * console.log(spinner.text);
   *
   * @returns {string} - The text for the spinner animation
   */
  private text: string = '';

  /**
   * startTime: The start time for the spinner animation.
   * The start time is used to calculate the elapsed time of the spinner animation.
   *
   * @type {number}
   * @private
   * @example
   * console.log(spinner.startTime);
   *
   * @returns {number} - The start time for the spinner animation
   */
  private startTime: number = 0;

  /**
   * spinnerInstances: The spinner instances.
   * The spinner instances are used to manage multiple spinner animations concurrently.
   *
   * @type {Spinner[]}
   * @private
   * @example
   * console.log(Spinner.spinnerInstances);
   *
   * @returns {Spinner[]} - The spinner instances
   */
  private static spinnerInstances: Spinner[] = [];

  // --------------------------------------------------
  // Constructor
  // --------------------------------------------------

  /**
   * Creates an instance of Spinner.
   * The constructor is used to initialize the spinner animation.
   *
   * @constructor
   * @public
   * @example
   * const spinner = new Spinner();
   * spinner.start('Loading...');
   * spinner.stop('Done!');
   *
   * @param options The options to customize the spinner animation.
   *
   * @returns {Spinner} - The spinner instance
   */
  constructor(options?: {
    frames: string[];
    interval?: number;
    format?: string | string[];
  }) {
    const {
      frames = ['-', '\\', '|', '/'],
      interval = 80,
      format,
    }: SpinnerOptions = (options as SpinnerOptions) ?? {};

    this.frames = frames;
    this.interval = interval;
    this.format = format;
  }

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods

  /**
   * Starts the spinner animation with an initial message.
   * The spinner animation is displayed in the console.
   *
   * @public
   * @example
   * spinner.start('Loading...');
   *
   * @param text Message to display alongside the spinner.
   *
   * @returns The Spinner instance for chaining.
   */
  public start(text: string = ''): this {
    this.text = text;
    this.startTime = performance.now();

    // Register this instance for concurrent management.
    Spinner.spinnerInstances.push(this);

    // Print a new line to assign its position in the console.
    process.stdout.write('\n');

    this.timer = setInterval(() => this.render(), this.interval);

    process.on('exit', this.cleanup);

    return this;
  }

  /**
   * Updates the text displayed next to the spinner.
   * The new message is displayed alongside the spinner animation.
   *
   * @public
   * @example
   * spinner.updateText('Loading...');
   *
   * @param newText The new message to display.
   *
   * @returns The Spinner instance for chaining.
   */
  public updateText(newText: string): this {
    this.text = newText;

    return this;
  }

  /**
   * Stops the spinner animation and displays the final message.
   * The final message is displayed in the console.
   *
   * @public
   * @example
   * spinner.stop('Done!');
   *
   * @param finalText Final message to display.
   *
   * @returns The Spinner instance for chaining.
   */
  public stop(finalText: string = ''): this {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    // Check if the environment is TTY
    if (process.stdout.isTTY) {
      this.render(finalText);
      // Clear the current line after rendering in TTY
      clearLine();
    } else {
      // In non-TTY, simply print the final message with a new line.
      process.stdout.write(finalText + '\n');
    }

    // Remove this instance from the active spinners array.
    Spinner.spinnerInstances = Spinner.spinnerInstances.filter(
      (s) => s !== this,
    );

    process.off('exit', this.cleanup);

    return this;
  }

  // Private methods

  /**
   * Renders the spinner line at its designated position.
   * The spinner line is displayed in the console.
   *
   * @private
   * @example
   * spinner.render();
   *
   * @param finalText If provided, displays this text instead of the animated spinner.
   *
   * @returns void - Nothing
   */
  private render(finalText?: string): void {
    // In non-TTY environments, degrade gracefully.
    if (!process.stdout.isTTY) {
      if (finalText !== undefined) {
        process.stdout.write(finalText + '\n');
      } else {
        const frame = this.frames[this.currentFrame];

        this.currentFrame = (this.currentFrame + 1) % this.frames.length;

        const elapsed = Math.floor(performance.now() - this.startTime);

        process.stdout.write(`${frame} ${this.text} (${elapsed}ms)\n`);
      }
      return;
    }

    const index = Spinner.spinnerInstances.indexOf(this);

    if (index === -1) return;

    // Move the cursor to the corresponding spinner line if the function exists.
    if (typeof process.stdout.moveCursor === 'function') {
      process.stdout.moveCursor(0, -(Spinner.spinnerInstances.length - index));
    }

    if (typeof process.stdout.cursorTo === 'function') {
      process.stdout.cursorTo(0);
    }

    clearLine();

    let output: string;

    if (finalText !== undefined) {
      output = finalText;
    } else {
      let frame = this.frames[this.currentFrame];

      this.currentFrame = (this.currentFrame + 1) % this.frames.length;

      if (this.format) {
        frame = styleText(this.format, frame);
      }

      const elapsed = Math.floor(performance.now() - this.startTime);

      output = `${frame} ${this.text} (${elapsed}ms)`;
    }

    process.stdout.write(output);

    // Return the cursor to the bottom if the function exists.
    if (typeof process.stdout.moveCursor === 'function') {
      process.stdout.moveCursor(0, Spinner.spinnerInstances.length - index);
    }
  }

  /**
   * Cleanup function to clear the spinner on process exit.
   * The cleanup function is used to remove the spinner animation from the console.
   *
   * @private
   * @example
   * spinner.cleanup();
   *
   * @returns void - Nothing
   */
  private cleanup = (): void => {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }

    clearLine();
  };
}
