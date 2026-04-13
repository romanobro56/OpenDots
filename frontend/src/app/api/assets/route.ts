import { readdir } from "fs/promises";
import { join } from "path";

const PROJECT_ROOT = join(process.cwd(), "..");

interface AssetGroup {
  label: string;
  collection: string;
  files: string[];
}

function categorize(files: string[]): Record<string, AssetGroup> {
  const groups: Record<string, AssetGroup> = {
    uppercase: { label: "Uppercase Letters", collection: "letters", files: [] },
    lowercase: { label: "Lowercase Letters", collection: "letters", files: [] },
    numbers: { label: "Numbers", collection: "letters", files: [] },
    symbols: { label: "Symbols", collection: "letters", files: [] },
    braille: { label: "Braille", collection: "letters", files: [] },
  };

  for (const f of files) {
    const name = f.replace(/\.png$/, "");
    if (name.startsWith("braille_")) {
      groups.braille.files.push(f);
    } else if (/^\d$/.test(name)) {
      groups.numbers.files.push(f);
    } else if (name.endsWith("_upper")) {
      groups.uppercase.files.push(f);
    } else if (/^[a-z]$/.test(name)) {
      groups.lowercase.files.push(f);
    } else {
      groups.symbols.files.push(f);
    }
  }

  for (const g of Object.values(groups)) {
    g.files.sort();
  }

  // Remove empty groups
  const result: Record<string, AssetGroup> = {};
  for (const [key, g] of Object.entries(groups)) {
    if (g.files.length > 0) result[key] = g;
  }
  return result;
}

export async function GET() {
  const lettersDir = join(PROJECT_ROOT, "output", "letters");
  const samplesDir = join(PROJECT_ROOT, "tmp");

  const result: Record<string, AssetGroup> = {};

  try {
    const letterFiles = (await readdir(lettersDir)).filter((f) =>
      f.endsWith(".png")
    );
    Object.assign(result, categorize(letterFiles));
  } catch {
    // output/letters may not exist
  }

  try {
    const sampleFiles = (await readdir(samplesDir)).filter((f) =>
      /\.(png|jpg|jpeg)$/i.test(f)
    );
    result.samples = {
      label: "Samples",
      collection: "samples",
      files: sampleFiles.sort(),
    };
  } catch {
    // assets/samples may not exist
  }

  return Response.json(result);
}
