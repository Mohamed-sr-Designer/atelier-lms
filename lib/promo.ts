"use client";

// ---- Personal promo code ------------------------------------------------------
// Every browser gets its own code (minted once, kept in localStorage). The
// popup reveals it behind a scratch foil; checkout redeems it for an extra
// discount on paid orders.

const KEY = "mt-promo-code";
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I lookalikes

export const PROMO_RATE = 0.05; // extra 5% off at checkout

export function getPersonalCode(): string {
  if (typeof window === "undefined") return "MT-····";
  try {
    let code = localStorage.getItem(KEY);
    if (!code) {
      const rand = Array.from(
        { length: 4 },
        () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
      ).join("");
      code = `MT-${rand}`;
      localStorage.setItem(KEY, code);
    }
    return code;
  } catch {
    return "MT-2026";
  }
}

export function isValidCode(input: string): boolean {
  return input.trim().toUpperCase() === getPersonalCode().toUpperCase();
}

export function promoDiscount(total: number): number {
  return Math.round(total * PROMO_RATE);
}
