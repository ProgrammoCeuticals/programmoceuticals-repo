import { unlink } from "node:fs/promises";

export async function cleanupFiles(paths: string[]): Promise<void> {
  await Promise.all(
    paths.map(async (path) => {
      try {
        await unlink(path);
      } catch {
        // Temporary upload cleanup should not mask the processing result.
      }
    })
  );
}
