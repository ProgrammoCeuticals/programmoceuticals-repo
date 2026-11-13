const fs = require("fs");
const path = require("path");

const sourcePath = path.resolve(__dirname, "../samplingguide.json");
const destinationPath = path.resolve(__dirname, "../public/samplingguide.json");

if (!fs.existsSync(sourcePath)) {
  console.error("Sampling guide source file not found:", sourcePath);
  process.exit(1);
}

fs.copyFileSync(sourcePath, destinationPath);
console.log("Sampling guide synced:", destinationPath);
