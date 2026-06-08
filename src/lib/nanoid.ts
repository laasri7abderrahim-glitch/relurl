import { customAlphabet } from "nanoid";

const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ123456789";

const nanoid7 = customAlphabet(alphabet, 7);
const nanoid32 = customAlphabet(alphabet, 32);

export function generateSlug(): string {
  return nanoid7();
}

export function generateApiKey(): string {
  return `rl_${nanoid32()}`;
}
