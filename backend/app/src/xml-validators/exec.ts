import { exec } from "child_process";

export default async function validate(
  command: string
): Promise<{ valid: boolean; messages: string[] }> {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      // console.log("ERROR: ", error, !!error);
      // console.log("STDOUT: ", stdout, !!stdout);
      // console.log("STDERR: ", stderr, !!stderr);
      resolve({
        valid: !error && !stdout && !stderr,
        messages: [stdout],
      });
    });
  });
}
