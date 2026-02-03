import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { keccak256 } from 'js-sha3';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function isValidBTC(address: string) {
  if (typeof address !== 'string') return false;

  // Base58: Legacy (1) or P2SH (3)
  const base58Regex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;

  // Bech32: bc1
  const bech32Regex = /^(bc1)[a-z0-9]{25,39}$/;

  return base58Regex.test(address) || bech32Regex.test(address);
}


export function isValidETH(address: string) {
  if (typeof address !== 'string') return false;
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return false;

  // Remove '0x' and lowercase
  const addr = address.slice(2);
  const addrLower = addr.toLowerCase();

  // Compute keccak256 hash
  const hash = keccak256(addrLower);

  // Verify checksum
  for (let i = 0; i < 40; i++) {
    const char = addr[i];
    const hashChar = parseInt(hash[i], 16);
    if ((hashChar > 7 && char.toUpperCase() !== char) ||
      (hashChar <= 7 && char.toLowerCase() !== char)) {
      return false;
    }
  }

  return true;
}


export function isValidSOL(address: string) {
  if (typeof address !== 'string') return false;

  // Solana addresses are base58 encoded and 32-44 characters long
  const solRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

  return solRegex.test(address);
}

// Example usage
console.log(isValidETH('0x52908400098527886E0F7030069857D2E4169EE7')); // true
console.log(isValidETH('0x8617E340B3D01FA5F11F306F4090FD50E238070D')); // true
console.log(isValidETH('0xde709f2102306220921060314715629080e2fb77')); // true


export function formatPhoneNumber(phone: string) {
  // Remove all non-digit characters except leading +
  const digits = phone.replace(/[^\d+]/g, '');

  // Match groups: country code, area code (3 digits), first 3 digits, last 4 digits
  const match = digits.match(/^\+(\d{1})(\d{3})(\d{3})(\d{4})$/);

  if (!match) return phone; // fallback if it doesn't match expected pattern

  const [, country, area, first3, last4] = match;

  return `+${country} (${area}) ${first3}-${last4}`;
}