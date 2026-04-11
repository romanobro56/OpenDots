import { NextRequest } from "next/server";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { execFile } from "child_process";
import { promisify } from "util";

const exec = promisify(execFile);
const PROJECT_ROOT = join(process.cwd(), "..");

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  const tmpDir = join(PROJECT_ROOT, "tmp");
  await mkdir(tmpDir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  const tmpPath = join(tmpDir, `upload_${Date.now()}_${file.name}`);
  await writeFile(tmpPath, bytes);

  try {
    console.log(`\n[Direct Upload] Running image_to_matrix on: ${file.name}`);

    const result = await exec(
      "python",
      ["-m", "cli.image_to_matrix", tmpPath],
      { cwd: PROJECT_ROOT, timeout: 30000 }
    );

    if (result.stdout) {
      console.log(`[Direct Upload] Matrix output:\n${result.stdout}`);
    }
    if (result.stderr) console.error(result.stderr);

    return Response.json({
      message: "Direct upload complete — check terminal",
      matrix: result.stdout.trim(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Direct Upload] Error:", message);
    return Response.json({ error: message }, { status: 500 });
  } finally {
    await unlink(tmpPath).catch(() => {});
  }
}
