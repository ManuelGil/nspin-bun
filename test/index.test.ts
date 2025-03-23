import { test, expect } from 'bun:test';
import { Spinner } from '../src/index';

// Helper to simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test('Spinner - TTY Environment: method chaining and instance management', () => {
  // Simulate a TTY environment
  const originalIsTTY = process.stdout.isTTY;
  process.stdout.isTTY = true;

  // Spy on cursor functions if available and return a boolean as expected.
  let moveCursorCalled = false;
  let cursorToCalled = false;
  const originalMoveCursor = process.stdout.moveCursor;
  const originalCursorTo = process.stdout.cursorTo;

  if (typeof process.stdout.moveCursor === 'function') {
    process.stdout.moveCursor = (
      // biome-ignore lint/correctness/noUnusedVariables: the parameters are used in the test
      dx: number,
      // biome-ignore lint/correctness/noUnusedVariables: the parameters are used in the test
      dy: number,
      callback?: () => void,
    ): boolean => {
      moveCursorCalled = true;
      if (callback) callback();
      return true;
    };
  }
  if (typeof process.stdout.cursorTo === 'function') {
    process.stdout.cursorTo = (
      // biome-ignore lint/correctness/noUnusedVariables: the parameters are used in the test
      x: number,
      y?: number | (() => void),
      callback?: () => void,
    ): boolean => {
      if (typeof y === 'function') {
        callback = y;
        y = undefined;
      }
      cursorToCalled = true;
      if (callback) callback();
      return true;
    };
  }

  // Spy on process.stdout.write to capture output.
  let output = '';
  const originalWrite = process.stdout.write;
  process.stdout.write = (chunk: string | Buffer): boolean => {
    output += chunk.toString();
    return true;
  };

  // Create and use the spinner.
  const spinner = new Spinner({
    frames: ['-', '\\', '|', '/'],
    interval: 10,
    format: 'cyan',
  });

  spinner.start('TTY Test').updateText('Updated').stop('Final TTY');

  expect(output).toContain('Final TTY');
  expect(moveCursorCalled).toBe(true);
  expect(cursorToCalled).toBe(true);

  // Restore original functions.
  process.stdout.write = originalWrite;
  if (typeof originalMoveCursor === 'function') {
    process.stdout.moveCursor = originalMoveCursor;
  }
  if (typeof originalCursorTo === 'function') {
    process.stdout.cursorTo = originalCursorTo;
  }
  process.stdout.isTTY = originalIsTTY;
});

test('Spinner - Non-TTY Environment: final message output', async () => {
  // Simulate a non-TTY environment
  const originalIsTTY = process.stdout.isTTY;
  process.stdout.isTTY = false;

  let output = '';
  const originalWrite = process.stdout.write;
  process.stdout.write = (chunk: string | Buffer): boolean => {
    output += chunk.toString();
    return true;
  };

  const spinner = new Spinner({
    frames: ['-', '\\', '|', '/'],
    interval: 10,
    format: 'green',
  });

  spinner.start('Non-TTY Test');

  // Wait for at least one render cycle
  await delay(50);

  spinner.stop('Final Non-TTY');

  expect(output).toContain('Final Non-TTY');

  // Restore original functions.
  process.stdout.write = originalWrite;
  process.stdout.isTTY = originalIsTTY;
});
