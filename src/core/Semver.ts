interface Version {
  major: number;
  minor: number;
  patch: number;
}

function parse(version: string): Version {
  const [major, minor, patch] = version
    .replace(/^v/, "")
    .split(".")
    .map(Number);
  return { major: major ?? 0, minor: minor ?? 0, patch: patch ?? 0 };
}

function compare(a: Version, b: Version): number {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

// supports "*", "^1.2.3", "~1.2.3", ">=1.2.3" and exact "1.2.3" ranges - enough for manifest version checks without a dependency
export function satisfies(version: string, range: string): boolean {
  range = range.trim();
  if (range === "*" || range === "") return true;

  const v = parse(version);

  if (range.startsWith("^")) {
    const r = parse(range.slice(1));
    if (v.major !== r.major) return false;
    if (v.major === 0) return v.minor === r.minor && v.patch >= r.patch;
    return v.minor > r.minor || (v.minor === r.minor && v.patch >= r.patch);
  }

  if (range.startsWith("~")) {
    const r = parse(range.slice(1));
    return v.major === r.major && v.minor === r.minor && v.patch >= r.patch;
  }

  if (range.startsWith(">=")) {
    return compare(v, parse(range.slice(2))) >= 0;
  }

  return compare(v, parse(range)) === 0;
}
