import { expect, test } from "@playwright/test";

test("learning path shows the saved role", async ({ page, request }) => {
  const roleResponse = await request.post("/api/v1/target-roles", {
    data: { source: "jd-only", jobDescription: "Playwright walk job description" },
  });
  expect(roleResponse.ok()).toBeTruthy();
  const role = await roleResponse.json();

  const gapResponse = await request.post(`/api/v1/target-roles/${role.id}/gaps`, {
    data: { kind: "gap", name: "Playwright gap", detail: "Saved by the walk.", position: 1 },
  });
  expect(gapResponse.ok()).toBeTruthy();

  const planResponse = await request.post("/api/v1/plans", {
    data: { roleTitle: "Playwright Walk Role", company: "Test Lab", lengthWeeks: 4, currentWeek: 1 },
  });
  expect(planResponse.ok()).toBeTruthy();
  const plan = await planResponse.json();

  const approved = await request.post(`/api/v1/plans/${plan.id}/approve`);
  expect(approved.ok()).toBeTruthy();
  const week = await request.post(`/api/v1/plans/${plan.id}/weeks`, {
    data: { label: "W1", title: "Browser walk", detail: "Open the four screens.", position: 1 },
  });
  expect(week.ok()).toBeTruthy();
  const activated = await request.post(`/api/v1/plans/${plan.id}/activate`);
  expect(activated.ok()).toBeTruthy();

  await page.goto("/role");
  await expect(page.getByRole("heading", { name: "Target role" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Resume and job description" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Job description only" })).toBeVisible();
  await expect(page.getByRole("button", { name: "A role you write" })).toBeVisible();

  await page.goto("/gaps");
  await expect(page.getByRole("heading", { name: "Skill gaps" })).toBeVisible();
  await expect(page.getByText("Playwright gap", { exact: true })).toBeVisible();

  await page.goto(`/roadmap/review?plan=${plan.id}`);
  await expect(page.getByRole("heading", { name: "Review plan" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Browser walk" })).toBeVisible();

  await page.goto("/roadmap");
  await expect(page.getByText("Playwright Walk Role, week 1 of 4.")).toBeVisible();
});
