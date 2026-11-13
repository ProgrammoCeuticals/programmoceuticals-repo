import { unlink } from "node:fs/promises";
export async function cleanupFiles(paths) {
    await Promise.all(paths.map(async (path) => {
        try {
            await unlink(path);
        }
        catch {
            // Temporary upload cleanup should not mask the processing result.
        }
    }));
}
