import { test, expect } from "@playwright/test";

test("admin login, product management, content editor, and logout", async ({ page, baseURL }) => {
  test.skip(!process.env.E2E_USERNAME || !process.env.E2E_PASSWORD, "Set E2E_USERNAME and E2E_PASSWORD for a configured local admin account.");
  const name = `Browser check ${Date.now()}`;
  let productId: string | undefined;
  await page.goto("/admin");
  await page.getByLabel("Username", { exact: true }).fill(process.env.E2E_USERNAME!);
  await page.getByLabel("Password", { exact: true }).fill(process.env.E2E_PASSWORD!);
  await page.getByRole("button", { name: "Sign in", exact: false }).click();
  await expect(page).toHaveURL(/\/admin$/);
  const cookie = (await page.context().cookies()).find(c => c.name === "rikkyloops_admin");
  expect(cookie?.httpOnly).toBe(true);
  expect(cookie?.sameSite).toBe("Strict");
  try {
    await page.getByRole("button", { name: "Add product", exact: false }).click();
    await page.getByLabel("Product name", { exact: true }).fill(name);
    await page.getByLabel("Price (NGN)", { exact: true }).fill("123.45");
    const created = page.waitForResponse(r => r.url().endsWith("/api/admin/products") && r.request().method() === "POST");
    await page.getByRole("button", { name: "Save product", exact: false }).click();
    const response = await created;
    expect(response.status()).toBe(201);
    productId = (await response.json()).id;
    await page.getByRole("row").filter({ hasText: name }).getByRole("button", { name: "Edit", exact: true }).click();
    await page.getByLabel("Product name", { exact: true }).fill(`${name} updated`);
    await page.getByRole("button", { name: "Save product", exact: false }).click();
    await page.getByRole("row").filter({ hasText: `${name} updated` }).getByRole("button", { name: "Delete", exact: true }).click();
    await page.getByRole("button", { name: "Delete product", exact: true }).click();
    await expect(page.getByText("Product deleted.", { exact: true })).toBeVisible();
    productId = undefined;
    await page.getByRole("button", { name: "Website content", exact: true }).click();
    await expect(page.getByLabel("Announcement bar", { exact: true })).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  } finally {
    if (productId) await page.request.delete(`/api/admin/products/${productId}`, { headers: { Origin: new URL(baseURL!).origin } });
  }
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  expect((await page.request.get("/api/admin/products")).status()).toBe(401);
});
