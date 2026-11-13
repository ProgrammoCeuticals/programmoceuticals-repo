#!/usr/bin/env node
/**
 * RIMS API launcher.
 *
 * Starts the compiled NestJS app and filters the ioredis ECONNREFUSED
 * noise from stderr when Redis is not running. Everything else passes through.
 *
 * Usage:
 *   node start.js           (production/dev after `tsc`)
 */
const { spawn } = require("child_process");
const path = require("path");

const api = spawn(
  process.execPath, // same node binary
  [path.join(__dirname, "dist", "main.js")],
  { cwd: __dirname, stdio: ["inherit", "inherit", "pipe"] },
);

// Lines that belong to an ioredis ECONNREFUSED error block
const REDIS_NOISE = [
  "ECONNREFUSED",
  "errno: -61",
  "code: 'ECONNREFUSED'",
  "syscall: 'connect'",
  "address: '127.0.0.1'",
  "port: 6379",
  "TCPConnectWrap",
  "afterConnect [as oncomplete]",
  "Error: connect",
  "at TCPConnectWrap",
];

let pendingLine = "";

api.stderr.on("data", (chunk) => {
  const text = pendingLine + chunk.toString();
  const lines = text.split("\n");
  // Keep the last incomplete line for the next chunk
  pendingLine = lines.pop() ?? "";

  for (const line of lines) {
    const isNoise = REDIS_NOISE.some((pattern) => line.includes(pattern));
    // Also skip lone "}" and "  }" lines that are part of the error object
    const isLoneBrace = /^\s*\{?\s*\}?\s*$/.test(line) && line.trim() !== "";
    if (!isNoise && !isLoneBrace) {
      process.stderr.write(line + "\n");
    }
  }
});

api.stderr.on("end", () => {
  if (pendingLine.trim()) process.stderr.write(pendingLine);
});

api.on("exit", (code) => {
  process.exit(code ?? 0);
});
