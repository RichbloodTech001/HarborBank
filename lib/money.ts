import { z } from "zod";

export const amountSchema = z.string().trim().regex(/^(?:0|[1-9]\d{0,11})(?:\.\d{1,2})?$/, "Enter an amount with up to two decimal places.").refine((value) => {
  const [whole, fraction = ""] = value.split(".");
  const cents = BigInt(whole) * 100n + BigInt((fraction + "00").slice(0, 2));
  return cents >= 10000n && cents <= 1000000000n;
}, "Amount must be between 100.00 and 10,000,000.00.");

export function normalizeAmount(value: string) {
  const [whole, fraction = ""] = value.split(".");
  return `${whole}.${(fraction + "00").slice(0, 2)}`;
}
export function formatAmount(value: string | number, currency = "USD") {
  const number = typeof value === "number" ? value : Number(value);
  return new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
}
