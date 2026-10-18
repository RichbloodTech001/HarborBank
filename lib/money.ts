import { z } from "zod";

const AMOUNT_FORMAT = /^(?:0|[1-9]\d{0,11})(?:\.\d{1,2})?$/;

export const amountSchema = z.string().trim()
  .regex(AMOUNT_FORMAT, "Enter an amount with up to two decimal places.")
  .refine((value) => {
    // Zod can run refinements after a regex issue. Never parse malformed
    // numeric text into BigInt until its canonical decimal form is checked.
    if (!AMOUNT_FORMAT.test(value)) return false;
    const [whole, fraction = ""] = value.split(".");
    const cents = BigInt(whole) * 100n + BigInt((fraction + "00").slice(0, 2));
    return cents >= 10000n && cents <= 1000000000n;
  }, "Amount must be between 100.00 and 10,000,000.00.");

export function normalizeAmount(value: string) {
  if (!AMOUNT_FORMAT.test(value)) throw new Error("Invalid decimal amount.");
  const [whole, fraction = ""] = value.split(".");
  return `${whole}.${(fraction + "00").slice(0, 2)}`;
}

export function formatAmount(value: string | number, currency = "USD") {
  const number = typeof value === "number" ? value : Number(value);
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
}
