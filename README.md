# nspin-bun

[![NPM Version](https://img.shields.io/npm/v/nspin-bun?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/nspin-bun)
[![NPM Downloads](https://img.shields.io/npm/dt/nspin-bun?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/nspin-bun)
[![GitHub Repo Stars](https://img.shields.io/github/stars/ManuelGil/nspin-bun?style=for-the-badge&logo=github)](https://github.com/ManuelGil/nspin-bun)
[![GitHub License](https://img.shields.io/github/license/ManuelGil/nspin-bun?style=for-the-badge&logo=github)](https://github.com/ManuelGil/nspin-bun/blob/main/LICENSE)

## Overview

**nspin-bun** is a lightweight, efficient spinner package optimized exclusively for Bun. Inspired by [nspin](https://github.com/ManuelGil/nspin), this ESM-only library leverages modern Node.js APIs (such as `styleText` and `performance.now()`) along with Bun’s native capabilities to deliver a fast, minimal CLI spinner with zero external dependencies. Perfect for modern Bun environments, **nspin-bun** is engineered for high performance and an ultra-small footprint.

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
    - [Example 4: Fallback in Non-TTY Environments](#example-4-fallback-in-non-tty-environments)
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
  Designed exclusively for Bun with native ESM support, ensuring blazing-fast build and test speeds and a very small bundle size.

- **Inspired by nspin:**
  Refines the approach of the original nspin to deliver a modern, minimal spinner solution with a chainable API.

- **Zero External Dependencies:**
  Relies solely on Node.js built-in APIs (e.g., `styleText` from `node:util`, `performance.now()` from `perf_hooks`) for styling and timing, reducing bloat and potential security risks.

- **Clean, Modular API:**
  Built using SOLID principles, offering an intuitive, chainable API that makes managing multiple spinners simple and maintainable.

- **Adaptive Output:**
  Automatically adjusts its behavior for TTY and non-TTY environments, ensuring clear output in any terminal.

## Requirements

- **Node.js 22+** – Utilizes modern APIs like `styleText` and `performance.now()`.
- **Bun (>= 0.6.0)** – Fully leverages Bun's native build, test, and runtime capabilities.

## Features

- **Lightweight & Efficient:**
  Uses native Node.js features to deliver high performance with minimal overhead.

- **Native Styling:**
  Employs `styleText` from `node:util` for elegant spinner styling without manual ANSI escape codes.

- **Chainable API:**
  Methods like `start`, `updateText`, and `stop` return the spinner instance, allowing a fluent coding experience.

- **Multiple Spinner Support:**
  Easily manage several spinners concurrently.

- **Modular & Extensible:**
  Adheres to SOLID principles for clean, maintainable code.

- **Adaptive Output:**
  Automatically adapts to TTY and non-TTY environments for optimal display.

## Installation

Install **nspin-bun** via npm:

```bash
npm install nspin-bun
```

## Usage Examples

Below are several examples showcasing the functionality of **nspin-bun**.

### Example 1: Progressive Status Updates

This example demonstrates how to update the spinner's status continuously as a task progresses.

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

This example shows how to chain spinner methods to perform sequential actions.

```typescript
import { Spinner } from "nspin-bun";

const spinner = new Spinner({
  frames: ["◴", "◷", "◶", "◵"],
  interval: 100,
  format: ["cyan", "bold"]
});

spinner.start("Starting process...")
  .updateText("Loading data...")
  .stop("Process complete!");
```

### Example 3: Concurrent Spinners

This example illustrates running multiple spinners concurrently to simulate parallel tasks.

```typescript
import { Spinner } from "nspin-bun";

const spinner1 = new Spinner({
  frames: ["-", "\\", "|", "/"],
  interval: 90,
  format: "blue"
});
const spinner2 = new Spinner({
  frames: ["◐", "◓", "◑", "◒"],
  interval: 110,
  format: "magenta"
});

spinner1.start("Task 1: Downloading...");
spinner2.start("Task 2: Processing...");

setTimeout(() => {
  spinner1.stop("Download complete!");
}, 4000);

setTimeout(() => {
  spinner2.stop("Processing complete!");
}, 6000);
```

### Example 4: Fallback in Non-TTY Environments

This example shows how the spinner degrades gracefully in non-TTY environments.

```typescript
import { Spinner } from "nspin-bun";

// Simulate a non-TTY environment (for demonstration)
if (!process.stdout.isTTY) {
  console.log("Non-TTY mode active.");
}

const spinner = new Spinner({
  frames: ["⠋", "⠙", "⠹", "⠸"],
  interval: 100,
  format: "yellow"
});

spinner.start("Running in non-TTY mode...");
setTimeout(() => {
  spinner.stop("Finished in non-TTY mode.");
}, 3000);
```

## API Reference

### Spinner Class

- **`new Spinner(options: SpinnerOptions): Spinner`**
  Creates a new spinner instance.

  **Options:**
  - `frames`: Array of spinner frames (e.g., `["-", "\\", "|", "/"]`).
  - `interval` (optional): Time between frames in milliseconds (default: 80).
  - `format` (optional): Format options for styling the spinner (passed to `styleText`).

- **`start(text?: string): this`**
  Starts the spinner with an optional initial message.

- **`updateText(newText: string): this`**
  Updates the spinner's message in real time.

- **`stop(finalText?: string): this`**
  Stops the spinner and displays a final message.

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

- **Build:** `bun build src/index.ts --outdir=dist --minify --target=node`
- **Test:** `bun test`
- **Run:** `bun run dist/index.js`

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
