// The meeting already happened by email. This program just says so,
// in one sentence, and hands it to the make.fun program/v1 harness.
//
// The sentence is a fixed string: the same bytes go to stdout and to
// entry.txt on each run. Nothing here reads the clock, the network, or
// any random source, so repeated runs cannot drift apart. The output
// goes only to MAKEFUN_OUTPUT_DIR (the grading sandbox sets it to
// /output) or to /output as a fallback; the repository folder is never
// written, because the grading sandbox mounts it read-only.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const targetDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

const clauses = [
  "The decision was made and emailed to everyone before this meeting started",
  "so this hour is just us pretending we made it together.",
];

function assembleSentence(fragments: string[]): string {
  return fragments.join(", ");
}

const sentence = assembleSentence(clauses);

// The scorer's gate is 1-200 UTF-8 characters and not blank: check it
// here, before writing anything, so a bad entry aborts the run instead
// of being handed in.
function assertGate(sentence: string): void {
  const charCount = [...sentence].length;
  if (charCount < 1 || charCount > 200 || sentence.trim().length === 0) {
    throw new Error(`entry fails the 1-200 character gate (${charCount} chars)`);
  }
}

assertGate(sentence);

mkdirSync(targetDir, { recursive: true });
writeFileSync(resolve(targetDir, "entry.txt"), sentence, "utf8");
process.stdout.write(sentence + "\n");
