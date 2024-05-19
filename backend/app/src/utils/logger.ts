import path from "path";

export default function log(message: string, filePath: string) {
  const parts = filePath.split(path.sep);
  const logPath = path.join(parts[parts.length - 2], parts.pop()!);
  console.info(`\x1b[1;34m[${logPath}] \x1b[33m${message}\x1b[0m`);
}
