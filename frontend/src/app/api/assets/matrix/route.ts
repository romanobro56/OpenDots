import { NextRequest } from "next/server";
import { join } from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { access } from "fs/promises";

const exec = promisify(execFile);
const PROJECT_ROOT = join(process.cwd(), "..");

const COLLECTION_DIRS: Record<string, string> = {
  letters: join(PROJECT_ROOT, "output", "letters"),
  samples: join(PROJECT_ROOT, "tmp"),
};

function parseMatrix(stdout: string): number[][] {
  return stdout
    .trim()
    .split("\n")
    .map((line) => line.trim().split(/\s+/).map(Number));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { file, collection } = body as {
    file: string;
    collection: string;
  };

  if (!file || !collection) {
    return Response.json(
      { error: "file and collection are required" },
      { status: 400 }
    );
  }

  const dir = COLLECTION_DIRS[collection];
  if (!dir) {
    return Response.json(
      { error: `unknown collection: ${collection}` },
      { status: 400 }
    );
  }

  // Prevent path traversal
  if (file.includes("..") || file.includes("/")) {
    return Response.json({ error: "invalid filename" }, { status: 400 });
  }

  const filePath = join(dir, file);

  try {
    await access(filePath);
  } catch {
    return Response.json(
      { error: `file not found: ${file}` },
      { status: 404 }
    );
  }

  try {
    // --invert: letter images are black-on-white, but the 3D visualization
    // expects 1 = pin raised (the letter shape), so we invert.
    const args = ["-m", "cli.image_to_matrix", filePath, "--invert", "--orientation", "portrait"];
    const result = await exec("python", args, {
      cwd: PROJECT_ROOT,
      timeout: 15000,
    });

    const matrix = parseMatrix(result.stdout);
    return Response.json({ file, collection, matrix });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Assets Matrix] Error:", message);
    return Response.json({ error: message }, { status: 500 });
  }
}
