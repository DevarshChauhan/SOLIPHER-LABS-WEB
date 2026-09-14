import { randomInt } from "crypto";

// No 0/O/1/I/L: these codes get read off a printed certificate and typed
// back in by hand, and those are the characters people get wrong.
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const GROUP = 4;
const GROUPS = 2;

/**
 * A certificate serial like "SL-7K3M-9QXA". 8 characters from a 31-symbol
 * alphabet is ~40 bits, so codes can't realistically be guessed by someone
 * probing the public verification page for a valid one.
 */
export function generateInternCode(): string {
  const parts: string[] = [];
  for (let g = 0; g < GROUPS; g++) {
    let part = "";
    for (let i = 0; i < GROUP; i++) part += ALPHABET[randomInt(ALPHABET.length)];
    parts.push(part);
  }
  return `SL-${parts.join("-")}`;
}

/**
 * Lookup key for a code as typed: case, spaces and dashes are all things
 * people get wrong when copying a serial, and none of them carry meaning.
 */
export function normalizeCode(input: string): string {
  return input.toUpperCase().replace(/[^A-Z0-9]/g, "");
}
