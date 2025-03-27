# nspin-bun

[![NPM Version](https://img.shields.io/npm/v/nspin-bun?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/nspin-bun)
[![NPM Downloads](https://img.shields.io/npm/dt/nspin-bun?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/nspin-bun)
[![GitHub Repo Stars](https://img.shields.io/github/stars/ManuelGil/nspin-bun?style=for-the-badge&logo=github)](https://github.com/ManuelGil/nspin-bun)
[![GitHub License](https://img.shields.io/github/license/ManuelGil/nspin-bun?style=for-the-badge&logo=github)](https://github.com/ManuelGil/nspin-bun/blob/main/LICENSE)

## Overview

**nspin-bun** is a lightweight, dependency-free spinner package engineered exclusively for Bun environments. Inspired by **nspin**, it leverages modern Node.js APIs (like `styleText` and `performance.now()`) along with Bun's native capabilities to deliver an ultra-fast and minimal CLI spinner experience—all without external dependencies.

![nspin-bun](https://raw.githubusercontent.com/ManuelGil/nspin-bun/main/assets/nspin-bun.gif)

## Index

- [nspin-bun](#nspin-bun)
  - [Overview](#overview)
  - [Index](#index)
  - [Why Choose nspin-bun?](#why-choose-nspin-bun)
  - [Requirements](#requirements)
  - [Features](#features)
  - [Installation](#installation)
  - [Usage Examples](#usage-examples)
    - [Example 1: Progressive Status Updates](#example-1-progressive-status-updates)
    - [Example 2: Chained Spinner Actions](#example-2-chained-spinner-actions)
    - [Example 3: Concurrent Spinners](#example-3-concurrent-spinners)
    - [Example 4: Dynamic Update of Spinner Frames](#example-4-dynamic-update-of-spinner-frames)
    - [Example 5: Configuring Spinner Position](#example-5-configuring-spinner-position)
    - [Example 6: Degraded Output in Non-TTY Environments](#example-6-degraded-output-in-non-tty-environments)
  - [API Reference](#api-reference)
    - [Spinner Class](#spinner-class)
  - [Build \& Publication](#build--publication)
  - [Development](#development)
  - [Support](#support)
  - [Feedback](#feedback)
  - [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)
  - [Changelog](#changelog)
  - [License](#license)

## Why Choose nspin-bun?

- **Optimized for Bun:**
  Exclusively designed for Bun, ensuring blazing-fast build and test speeds with an ultra-small footprint.

- **Modern & Native:**
  Leverages modern Node.js APIs (such as `styleText` from `node:util` and `performance.now()`) to provide a reliable, dependency-free experience.

- **Zero Dependencies:**
  Avoids the bloat of external libraries, resulting in a lightweight package that minimizes security risks.

- **Clean & Modular API:**
  Built with SOLID principles, the chainable API simplifies spinner management and allows for multiple concurrent spinners.

- **Adaptive Output:**
  Automatically adjusts for both TTY and non-TTY environments, ensuring a clear display regardless of the terminal capabilities.

- **Dynamic Frame Updates:**
  Update the spinner animation frames on the fly using the `updateFrames(newFrames: string[])` method.

- **Configurable Positioning:**
  Choose whether the spinner appears to the left (default) or right of the message via the `position` option.

## Requirements

- **Node.js 22+** – Required to access modern APIs like `styleText` and `performance.now()`.
- **Bun (>= 0.6.0)** – Fully leverages Bun's native build, test, and runtime capabilities for an optimal experience.

## Features

- **Lightweight & Efficient:**
  Uses native features to deliver high performance with minimal overhead.

- **Native Styling:**
  Utilizes `styleText` for elegant spinner styling without manual ANSI codes.

- **Chainable API:**
  Methods like `start`, `updateText`, `updateFrames`, and `stop` return the spinner instance for fluent chaining.

- **Multiple Spinner Support:**
  Easily manage several spinners concurrently.

- **Modular & Extensible:**
  Designed following SOLID principles for clean, maintainable, and extendable code.

- **Dynamic Update of Frames:**
  Change the spinner animation on the fly with `updateFrames(newFrames: string[])`.

- **Position Configuration:**
  Configure the spinner's placement relative to the message using the `position` option (`'left'` or `'right'`).

## Installation

Since **nspin-bun** is built exclusively for Bun, install it using Bun's package manager:

```bash
bun add nspin-bun
```

> Note: Although published on npm, **nspin-bun** is optimized for Bun environments.

## Usage Examples

Below are several examples demonstrating the versatility of **nspin-bun**.

### Example 1: Progressive Status Updates

Update the spinner's status continuously as a task progresses.

```typescript
import { Spinner } from "nspin-bun";

const spinner = new Spinner({
  frames: ["⠋", "⠙", "⠹", "⠸"],
  interval: 80,
  format: "green"
});

spinner.start("Initializing...");

let progress = 0;
const interval = setInterval(() => {
  progress += 20;
  spinner.updateText(`Progress: ${progress}%`);
  if (progress >= 100) {
    clearInterval(interval);
    spinner.stop("Task complete!");
  }
}, 1000);
```

### Example 2: Chained Spinner Actions

Chain methods to perform sequential spinner actions.

```typescript
import { Spinner } from "nspin-bun";

const spinner = new Spinner({
  frames: ["◴", "◷", "◶", "◵"],
  interval: 100,
  format: ["cyan", "bold"]
}).start("Starting process...")
  .updateText("Loading data...")
  .stop("Process complete!");
```

### Example 3: Concurrent Spinners

Run multiple spinners concurrently to simulate parallel tasks.

```typescript
import { Spinner } from "nspin-bun";

// Moon phases spinner frames
const moonPhases = ["◐", "◓", "◑", "◒"];

const spinner1 = new Spinner({
  frames: moonPhases,
  interval: 100,
  format: "blue"
}).start("Task 1: Downloading...");

// Parentheses rotation spinner frames
const parenthesesRotation = ["(-)", "(\\)", "(|)", "(/)"];

const spinner2 = new Spinner({
  frames: parenthesesRotation,
  interval: 120,
  format: "magenta"
}).start("Task 2: Processing...");

setTimeout(() => {
  spinner1.stop("Task 1 complete!");
}, 4000);

setTimeout(() => {
  spinner2.stop("Task 2 complete!");
}, 5000);
```

### Example 4: Dynamic Update of Spinner Frames

Change the spinner animation frames during runtime.

```typescript
import { Spinner } from "nspin-bun";

// Bouncing ball spinner frames
const bouncingBall = [
  "(o    )",
  "( o   )",
  "(  o  )",
  "(   o )",
  "(    o)",
  "(   o )",
  "(  o  )",
  "( o   )"
];

// Rotating dot spinner frames
const rotatingDot = [".", "o", "O", "o"];

const spinner = new Spinner({
  frames: bouncingBall,
  interval: 100
}).start("Task in progress...");

setTimeout(() => {
  spinner.updateFrames(rotatingDot);
  spinner.updateText("Now using a different spinner...");
}, 5000);

setTimeout(() => spinner.stop("Done!"), 10000);
```

### Example 5: Configuring Spinner Position

Configure the spinner's alignment relative to the text.

```typescript
import { Spinner } from "nspin-bun";

// Progress bar spinner frames
const progressBar = [
  "[    ]",
  "[=   ]",
  "[==  ]",
  "[=== ]",
  "[====]",
  "[ ===]",
  "[  ==]",
  "[   =]"
];

// Spinner with left alignment (default)
const spinnerLeft = new Spinner({
  frames: progressBar,
  interval: 100,
  position: 'left'
}).start("Left aligned spinner");

// Spinner with right alignment
const spinnerRight = new Spinner({
  frames: progressBar,
  interval: 100,
  position: 'right'
}).start("Right aligned spinner");

setTimeout(() => {
  spinnerLeft.stop("Left spinner done");
  spinnerRight.stop("Right spinner done");
}, 8000);
```

### Example 6: Degraded Output in Non-TTY Environments

Demonstrate graceful degradation when running in non-TTY environments.

```typescript
import { Spinner } from "nspin-bun";

// Crosshair spinner frames
const crosshair = ["[+]", "[x]", "[-]", "[x]"];

// Simulate non-TTY mode for demonstration (in practice, determined by process.stdout.isTTY)
if (!process.stdout.isTTY) {
  console.log("Non-TTY mode active.");
}

const spinner = new Spinner({
  frames: crosshair,
  interval: 100,
  format: "yellow"
}).start("Running in non-TTY mode...");

setTimeout(() => {
  spinner.stop("Finished in non-TTY mode.");
}, 3000);
```

## API Reference

### Spinner Class

- **`new Spinner(options: SpinnerOptions): Spinner`**
  Creates a new spinner instance.

  **Options:**
  - `frames`: An array of spinner frames (e.g., `["-", "\\", "|", "/"]`).
  - `interval` (optional): Time between frames in milliseconds (default is 80).
  - `format` (optional): Styling options applied via `styleText`.
  - `position` (optional): Spinner placement relative to the text. Accepts `'left'` (default) or `'right'`.

- **`start(text?: string): this`**
  Starts the spinner with an optional initial message.

- **`updateText(newText: string): this`**
  Updates the spinner's message in real time.

- **`updateFrames(newFrames: string[]): this`**
  Dynamically updates the spinner frames and resets the frame counter.

- **`stop(finalText?: string): this`**
  Stops the spinner and displays the final message.

For detailed type definitions, please refer to [SpinnerOptions](./docs/SPINNER_OPTIONS.md) and [FormatOptions](./docs/FORMAT_OPTIONS.md).

## Build & Publication

**nspin-bun** is built using Bun's native commands for an ultra-optimized ESM bundle.

- **Build Command:**

  ```bash
  bun build src/index.ts --outdir=dist --minify --target=node
  ```

- **Compression:**
  Compress the bundle with Brotli:

  ```bash
  brotli -f -o dist/index.js.br dist/index.js
  ```

- **Prepublish:**
  The `prepublishOnly` script ensures a production build is generated and compressed before publishing:

  ```bash
  npm run prepublishOnly
  ```

## Development

For development, use Bun's fast build and test commands:

- **Build:**
  `bun build src/index.ts --outdir=dist --minify --target=node`

- **Test:**
  `bun test`

- **Run:**
  `bun run dist/index.js`

## Support

If you encounter any issues or have suggestions for improvements, please [open an issue](https://github.com/ManuelGil/nspin-bun/issues) on GitHub.

## Feedback

If you enjoy using **nspin-bun**, please consider leaving a review on [GitHub](https://github.com/ManuelGil/nspin-bun) or sharing your feedback.

## Contributing

Contributions are welcome! Please review our [Contributing Guidelines](./docs/CONTRIBUTING.md) and [Development Guide](./docs/DEVELOPMENT_GUIDE.md) for setup instructions and coding standards.

## Code of Conduct

We strive to create a welcoming, inclusive, and respectful community. Please see our [Code of Conduct](./docs/CODE_OF_CONDUCT.md) before contributing.

## Changelog

For a complete list of changes, see the [CHANGELOG.md](./CHANGELOG.md).

## License

This package is licensed under the [MIT License](https://opensource.org/licenses/MIT).
