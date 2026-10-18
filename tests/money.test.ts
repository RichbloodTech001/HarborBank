import test from "node:test";
import assert from "node:assert/strict";
import { amountSchema, normalizeAmount } from "../lib/money";

test("accepts the minimum supported request amount", () => {
  assert.equal(amountSchema.safeParse("100").success, true);
  assert.equal(normalizeAmount("100"), "100.00");
});

test("accepts amounts with at most two fractional digits", () => {
  assert.equal(amountSchema.safeParse("100.5").success, true);
  assert.equal(normalizeAmount("100.5"), "100.50");
  assert.equal(amountSchema.safeParse("10000000.00").success, true);
});

test("rejects amounts below minimum and above maximum", () => {
  assert.equal(amountSchema.safeParse("99.99").success, false);
  assert.equal(amountSchema.safeParse("10000000.01").success, false);
});

test("rejects malformed or over-precise amounts", () => {
  for (const amount of ["", "-100", "1e3", "100.001", "1,000.00", "NaN", "00100.00"]) {
    assert.equal(amountSchema.safeParse(amount).success, false, "should reject " + amount);
  }
});
