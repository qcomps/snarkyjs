import { Binable, bytesToBits } from '../provable/binable.js';
import { base58 } from '../provable/base58.js';
import {
  hashWithPrefix,
  packToFieldsLegacy,
  prefixes,
} from '../provable/poseidon-bigint.js';
import { versionBytes } from '../js_crypto/constants.js';

export { Memo };

function fromString(memo: string) {
  if (memo.length > 32) throw Error('Memo.fromString: string too long');
  return (
    `\x01${String.fromCharCode(memo.length)}${memo}` +
    '\x00'.repeat(32 - memo.length)
  );
}

function hash(memo: string) {
  let bytes = Memo.toBytes(memo);
  let bits = bytesToBits(bytes);
  let fields = packToFieldsLegacy(bits);
  return hashWithPrefix(prefixes.zkappMemo, fields);
}

const Binable: Binable<string> = {
  sizeInBytes() {
    return 34;
  },
  toBytes(memo) {
    return [...memo].map((_, i) => memo.charCodeAt(i));
  },
  fromBytes(bytes) {
    return String.fromCharCode(...bytes);
  },
};

const Memo = {
  fromString,
  hash,
  ...Binable,
  ...base58(Binable, versionBytes.userCommandMemo),
};
