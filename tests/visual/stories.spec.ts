import { test, expect } from '@playwright/test';
import fs from 'node:fs';

type Entry = { id: string; type: string; title: string; name: string; tags?: string[] };

const index = JSON.parse(fs.readFileSync('storybook-static/index.json', 'utf8')) as { entries: Record<string, Entry> };
const stories = Object.values(index.entries).filter((e) => e.type === 'story' && !e.tags?.includes('skip-visual'));

// One fixed moment, so calendars, "today" presets and relative dates never drift.
const NOW = new Date('2026-06-15T10:30:00+05:30');

for (const story of stories) {
  test(`${story.title} › ${story.name}`, async ({ page }) => {
    // Stories tagged `slow-visual` mount heavy demos (e.g. 10,000 table rows); give them triple time on busy CI runners.
    if (story.tags?.includes('slow-visual')) test.slow();
    await page.clock.setFixedTime(NOW);
    await page.goto(`/iframe.html?id=${story.id}&viewMode=story&globals=mode:dark;energy:off`);
    await page.waitForSelector('#storybook-root > *, #storybook-root:empty', { state: 'attached' });
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);

    const root = page.locator('#storybook-root');
    const box = await root.boundingBox();
    // Overlays render in a portal, so the root can be empty: then capture the viewport.
    const target = box && box.height > 4 ? root : page;
    await expect(target).toHaveScreenshot(`${story.id}.png`);
  });
}
