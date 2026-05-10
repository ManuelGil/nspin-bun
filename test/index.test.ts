import { expect, test } from "bun:test";
import { Spinner } from "../src/index";

// Helper to simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test("Spinner - TTY Environment: method chaining and instance management", () => {
  const stdout = process.stdout;

  // Preserve originals
  const originalIsTTY = stdout.isTTY;
  const originalMoveCursor = stdout.moveCursor;
  const originalCursorTo = stdout.cursorTo;
  const originalWrite = stdout.write;

  // Simulate TTY safely for CI environments
  Object.defineProperty(stdout, "isTTY", {
    value: true,
    configurable: true,
  });

  let moveCursorCalled = false;
  let cursorToCalled = false;
  let output = "";

  // Mock moveCursor
  Object.defineProperty(stdout, "moveCursor", {
    configurable: true,
    writable: true,
    value: (_dx: number, _dy: number, callback?: () => void): boolean => {
      moveCursorCalled = true;

      if (callback) {
        callback();
      }

      return true;
    },
  });

  // Mock cursorTo
  Object.defineProperty(stdout, "cursorTo", {
    configurable: true,
    writable: true,
    value: (_x: number, y?: number | (() => void), callback?: () => void): boolean => {
      if (typeof y === "function") {
        callback = y;
      }

      cursorToCalled = true;

      if (callback) {
        callback();
      }

      return true;
    },
  });

  // Mock write
  stdout.write = ((chunk: string | Buffer): boolean => {
    output += chunk.toString();

    return true;
  }) as typeof stdout.write;

  const spinner = new Spinner({
    frames: ["-", "\\", "|", "/"],
    interval: 10,
    format: "cyan",
  });

  spinner.start("TTY Test").updateText("Updated").stop("Final TTY");

  expect(output).toContain("Final TTY");
  expect(moveCursorCalled).toBe(true);
  expect(cursorToCalled).toBe(true);

  // Restore originals
  stdout.write = originalWrite;

  Object.defineProperty(stdout, "isTTY", {
    value: originalIsTTY,
    configurable: true,
  });

  Object.defineProperty(stdout, "moveCursor", {
    value: originalMoveCursor,
    configurable: true,
    writable: true,
  });

  Object.defineProperty(stdout, "cursorTo", {
    value: originalCursorTo,
    configurable: true,
    writable: true,
  });
});

test("Spinner - Non-TTY Environment: final message output", async () => {
  const stdout = process.stdout;

  // Preserve originals
  const originalIsTTY = stdout.isTTY;
  const originalWrite = stdout.write;

  // Simulate non-TTY safely
  Object.defineProperty(stdout, "isTTY", {
    value: false,
    configurable: true,
  });

  let output = "";

  stdout.write = ((chunk: string | Buffer): boolean => {
    output += chunk.toString();

    return true;
  }) as typeof stdout.write;

  const spinner = new Spinner({
    frames: ["-", "\\", "|", "/"],
    interval: 10,
    format: "green",
  });

  spinner.start("Non-TTY Test");

  // Wait for at least one render cycle
  await delay(50);

  spinner.stop("Final Non-TTY");

  expect(output).toContain("Final Non-TTY");

  // Restore originals
  stdout.write = originalWrite;

  Object.defineProperty(stdout, "isTTY", {
    value: originalIsTTY,
    configurable: true,
  });
});
