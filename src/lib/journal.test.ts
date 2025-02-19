import { describe, expect, test } from "@jest/globals";
import { format } from "./journal";
import fs from "fs";

function readFixture(name: string) {
  return fs.readFileSync(`fixture/${name}`).toString();
}

describe("journal", () => {
  test("format", () => {
    expect(format(readFixture("unformatted.ledger"))).toBe(readFixture("formatted.ledger"));
  });
});
