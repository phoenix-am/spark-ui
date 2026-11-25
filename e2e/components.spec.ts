import { test, expect, type Page } from '@playwright/test';

/** The page's first example ("Basic usage"), so the playground's copy doesn't get in the way. */
const usage = (page: Page) => page.locator('section[aria-labelledby="usage"]');
const open = async (page: Page, name: string) => {
  await page.goto(`/components/${name}`);
  await expect(usage(page)).toBeVisible();
};
/** Focus from the keyboard's point of view, the same in every engine (WebKit's Tab skips buttons). */
const keyboardFocus = async (page: Page, target: ReturnType<Page['locator']>) => {
  await page.keyboard.press('Shift');
  await target.focus();
};

test('Switch flips on click and with Space', async ({ page }) => {
  await open(page, 'switch');
  const sw = usage(page).getByRole('switch', { name: 'Email notifications' });
  await expect(sw).toBeChecked();
  await sw.click({ force: true });
  await expect(sw).not.toBeChecked();
  await keyboardFocus(page, sw);
  await page.keyboard.press('Space');
  await expect(sw).toBeChecked();
});

test('Checkbox toggles on its label', async ({ page }) => {
  await open(page, 'checkbox');
  const box = usage(page).getByRole('checkbox', { name: 'Remember this device' });
  await expect(box).toBeChecked();
  await usage(page).getByText('Remember this device').click();
  await expect(box).not.toBeChecked();
});

test('Tabs move with the arrow keys', async ({ page }) => {
  await open(page, 'tabs');
  const ex = usage(page);
  await keyboardFocus(page, ex.getByRole('tab', { name: 'Overview' }));
  await page.keyboard.press('ArrowRight');
  await expect(ex.getByRole('tab', { name: 'Deployments' })).toHaveAttribute('aria-selected', 'true');
  await expect(ex.getByRole('tabpanel')).toHaveText('Last deploy: 14 minutes ago.');
});

test('Slider steps with the arrow keys', async ({ page }) => {
  await open(page, 'slider');
  const thumb = usage(page).getByRole('slider').first();
  const before = Number(await thumb.inputValue());
  await keyboardFocus(page, thumb);
  await page.keyboard.press('ArrowRight');
  await expect(thumb).toHaveValue(String(before + 1));
});

test('Dropdown picks an option and closes with Escape', async ({ page }) => {
  await open(page, 'dropdown');
  const ex = usage(page);
  const trigger = ex.getByRole('button', { name: /Country/ });
  await trigger.click();
  await page.getByRole('option', { name: 'Germany' }).click();
  await expect(trigger).toContainText('Germany');
  await trigger.click();
  await expect(page.getByRole('listbox')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('listbox')).toBeHidden();
});

test('Combobox filters as you type and picks with Enter', async ({ page }) => {
  await open(page, 'combobox');
  const input = usage(page).getByRole('combobox', { name: 'City' });
  await input.click();
  await input.pressSequentially('a');
  // Matching ignores case: Ahmedabad, Amreli, Chennai, Hyderabad, Kolkata, Mumbai, Surat…
  await expect(page.getByRole('option', { name: 'Amreli' })).toBeVisible();
  await input.pressSequentially('mr');
  await expect(page.getByRole('option')).toHaveCount(1);
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('Amreli');
});

test('Menu opens, and Escape returns focus to its button', async ({ page }) => {
  await open(page, 'menu');
  const trigger = usage(page).getByRole('button', { name: 'Actions' });
  await trigger.click();
  await expect(page.getByRole('menuitem', { name: 'Rename' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('menu')).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Modal traps focus, closes with Escape and gives focus back', async ({ page }) => {
  await open(page, 'modal');
  const trigger = usage(page).getByRole('button', { name: 'Delete project' });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Delete this project?' });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('DatePicker takes a typed date and opens its calendar', async ({ page }) => {
  await open(page, 'date-picker');
  const ex = usage(page);
  const month = ex.getByRole('spinbutton', { name: /month/i });
  await month.click();
  await page.keyboard.type('03152026');
  await expect(ex.getByRole('spinbutton', { name: /year/i })).toHaveAttribute('aria-valuenow', '2026');
  await expect(month).toHaveAttribute('aria-valuenow', '3');
  await ex.getByRole('button', { name: /calendar/i }).click();
  await expect(page.getByRole('grid')).toBeVisible();
  await expect(page.getByRole('gridcell', { selected: true })).toContainText('15');
});

test('DataTable sorts and searches, as a grid or as cards', async ({ page }) => {
  await open(page, 'data-table');
  const ex = usage(page);
  const names = () => ex.locator('.sp-data-table__body [data-label="Service"]').allTextContents();
  const stacked = (await ex.locator('.sp-data-table').getAttribute('data-stacked')) === 'true';
  if (stacked) {
    // Cards hide the headers, so a picker does the sorting.
    await ex.getByRole('button', { name: /Sort by/ }).click();
    await page.getByRole('option', { name: 'Service, descending' }).click();
  } else {
    const header = ex.getByRole('columnheader', { name: /Service/ });
    await header.click();
    await header.click();
  }
  await expect.poll(names).toEqual(['search', 'reports', 'payments', 'notifications', 'api-gateway']);
  await ex.getByRole('searchbox').fill('pay');
  await expect.poll(names).toEqual(['payments']);
});

test('Toast appears when triggered', async ({ page }) => {
  await open(page, 'toast');
  await usage(page).getByRole('button', { name: 'Success' }).click();
  await expect(page.getByText('Saved', { exact: true })).toBeVisible();
});

test('Docs search finds a component and opens it', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('ControlOrMeta+k');
  const input = page.getByRole('combobox', { name: /Search/ });
  await expect(input).toBeFocused();
  await input.pressSequentially('switch');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/components\/switch/);
});

test('Header tooltip opens below and stays in the window', async ({ page }) => {
  await page.goto('/components/button');
  const btn = page.getByRole('button', { name: /Switch to (light|dark) mode/ });
  await keyboardFocus(page, btn);
  const bubble = page.locator('.sp-tooltip__bubble');
  await expect(bubble).toBeVisible();
  await expect(bubble).toHaveAttribute('data-placement', 'bottom');
  const box = (await bubble.boundingBox())!;
  const vw = page.viewportSize()!.width;
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(vw);
});

test('@mobile phone layout: search opens and the playground fits', async ({ page }) => {
  await page.goto('/components/button');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await page.getByRole('button', { name: 'Search the docs' }).click();
  await expect(page.getByRole('combobox', { name: /Search/ })).toBeVisible();
});
