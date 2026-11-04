import { expect, test } from "@playwright/test";

test("target role shows the three entries", async ({ page }) => {
  await page.goto("/role");
  await expect(page.getByRole("heading", { name: "Target role" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Resume and job description" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Job description only" })).toBeVisible();
  await expect(page.getByRole("button", { name: "A role you write" })).toBeVisible();
});