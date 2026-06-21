import { VOLUME_RE } from "./constants.mjs";

export function normalizeLine(line) {
  return line
    .replace(/\u3000/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/[．]/g, ".")
    .trim();
}

export function isNoise(line) {
  return !line || /^\d+$/.test(line) || /^《.+》试题库$/.test(line) || VOLUME_RE.test(line);
}

export function compactText(parts) {
  return parts
    .map((part) => normalizeLine(part))
    .filter(Boolean)
    .join(" ")
    .replace(/\s+([，。；：！？、）])/g, "$1")
    .replace(/([（])\s+/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function slugify(text) {
  return text
    .replace(/\s+/g, "-")
    .replace(/[^\p{Script=Han}A-Za-z0-9-]/gu, "")
    .slice(0, 48);
}

export function countBy(items, key) {
  return items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] || 0) + 1;
    return acc;
  }, {});
}

