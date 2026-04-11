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
    // Step 1: Simplify the image via Gemini
    const simplifiedPath = tmpPath.replace(/\.[^.]+$/, "_simplified.png");
    console.log(`\n[Interpret] Running simplify on: ${file.name}`);

    const simplifyResult = await exec(
      "python",
      ["-m", "cli.image_simplify", tmpPath, "-o", simplifiedPath],
      { cwd: PROJECT_ROOT, timeout: 60000 }
    );
    if (simplifyResult.stdout) console.log(simplifyResult.stdout);
    if (simplifyResult.stderr) console.error(simplifyResult.stderr);

    // Step 2: Convert simplified image to matrix
    console.log(`[Interpret] Running image_to_matrix on simplified image`);

    const matrixResult = await exec(
      "python",
      ["-m", "cli.image_to_matrix", simplifiedPath],
      { cwd: PROJECT_ROOT, timeout: 30000 }
    );
    if (matrixResult.stdout) {
      console.log(`[Interpret] Matrix output:\n${matrixResult.stdout}`);
    }
    if (matrixResult.stderr) console.error(matrixResult.stderr);

    return Response.json({
      message: "Interpret pipeline complete — check terminal",
      matrix: matrixResult.stdout.trim(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Interpret] Error:", message);
    return Response.json({ error: message }, { status: 500 });
  } finally {
    await unlink(tmpPath).catch(() => {});
  }
}
