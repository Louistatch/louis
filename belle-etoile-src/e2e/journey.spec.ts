import { expect, test, type Page } from '@playwright/test';

const shots = process.env.SHOTS ? 'e2e/screens/' : null;
const snap = async (page: Page, name: string) => {
  if (shots) {
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${shots}${name}.png` });
  }
};

async function enter(page: Page) {
  // pas de réseau YouTube pendant les tests : l'iframe reste vide
  await page.route(/youtube/, (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<html></html>' }));
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByRole('heading', { name: /Belle Étoile/ })).toBeVisible();
  await snap(page, '00-intro');
  await page.getByTestId('skip-intro').click();
  await page.getByTestId('enter').click();
}

/** Parcourt les 8 étapes en touchant chaque élément à révéler (sans clavier). */
async function walk(page: Page) {
  for (let cp = 1; cp <= 7; cp++) {
    const card = page.getByTestId(`cp-${cp}`);
    await expect(card).toBeVisible();
    for (;;) {
      const btn = card.locator('button.reveal-item:not([disabled])').first();
      if (!(await btn.count())) break;
      await btn.tap();
    }
    await snap(page, `0${cp}-scene`);
    await page.getByTestId('continue').tap();
  }
  await expect(page.getByTestId('cp-8')).toBeVisible();
  await page.getByTestId('show-all').tap();
  await snap(page, '08-letter');
  await page.getByTestId('continue').tap();
  await expect(page.getByTestId('choices')).toBeVisible();
  await snap(page, '09-choices');
}

test('la 3D WebGL démarre réellement', async ({ page }) => {
  await enter(page);
  await expect.poll(() => page.evaluate(() => (window as unknown as { __webglReady?: boolean }).__webglReady)).toBe(true);
  await expect(page.locator('canvas')).toHaveCount(1);
});

test('un tap sur la bulle 3D allume la première étoile', async ({ page }) => {
  await enter(page);
  await expect.poll(() => page.evaluate(() => (window as unknown as { __webglReady?: boolean }).__webglReady)).toBe(true);
  await page.waitForTimeout(2500); // la caméra rejoint la scène
  const box = (await page.locator('canvas').boundingBox())!;
  // la bulle est dans la moitié haute ; on balaie quelques points
  for (const fy of [0.3, 0.25, 0.35, 0.2, 0.4]) {
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height * fy);
    if (await page.getByText('Comme toi').count()) break;
  }
  await expect(page.getByText('Comme toi')).toBeVisible();
});

for (const answer of ['yes', 'talk', 'no'] as const) {
  test(`parcours complet → réponse « ${answer} »`, async ({ page }) => {
    await enter(page);
    await walk(page);
    await page.getByTestId(`answer-${answer}`).tap();
    await expect(page.getByTestId(`outcome-${answer}`)).toBeVisible();
    if (answer === 'yes') {
      await expect(page.getByText('Merci pour ton oui ❤️')).toBeVisible();
      await page.getByTestId('show-postscript').tap();
      await expect(page.getByTestId('postscript')).toContainText('Mme TATCHIDA');
    }
    if (answer === 'talk') await expect(page.getByText('On a le temps, rien ne presse.')).toBeVisible();
    if (answer === 'no') await expect(page.getByText('Je respecte ton choix.')).toBeVisible();
    await snap(page, `10-outcome-${answer}`);
    // la réponse n'est jamais écrite dans le stockage local
    const stored = await page.evaluate(() => JSON.stringify(localStorage));
    expect(stored).not.toContain(answer === 'yes' ? '"answer"' : answer);
    await page.getByTestId('outcome-action').tap();
    if (answer === 'no') await expect(page.getByText('C’est la fin')).toBeVisible();
    else await expect(page.getByTestId('map')).toBeVisible();
  });
}

test('la chanson YouTube démarre au toucher « C’est parti » et peut être arrêtée', async ({ page }) => {
  await enter(page);
  const frame = page.locator('[data-testid="song-dock"] iframe');
  await expect(frame).toHaveAttribute('src', /youtube-nocookie\.com\/embed\/PSZTZwoIJEc\?autoplay=1&loop=1/);
  await expect(frame).toHaveAttribute('allow', /autoplay/);
  await page.getByTestId('sound').tap();
  await expect(page.getByTestId('sound')).toContainText('Chanson');
  await expect(page.getByTestId('song-dock')).toHaveCount(0);
  await page.getByTestId('sound').tap(); // relance
  await expect(page.getByTestId('song-dock')).toHaveCount(1);
});

test('carte : retour sur une étape visitée, étapes futures verrouillées', async ({ page }) => {
  await enter(page);
  await page.getByTestId('continue').tap();
  await page.getByTestId('continue').tap();
  await page.getByTestId('open-map').tap();
  await expect(page.getByTestId('map')).toBeVisible();
  await snap(page, '11-map');
  await expect(page.getByTestId('node-5')).toBeDisabled();
  await page.getByTestId('node-1').tap();
  await expect(page.getByTestId('cp-1')).toBeVisible();
});

test('progression reprise après rechargement, sans la réponse', async ({ page }) => {
  await enter(page);
  await page.getByTestId('continue').tap();
  await page.reload();
  await expect(page.getByTestId('enter')).toContainText('Reprendre');
});

test('version sans WebGL : même parcours, mêmes choix', async ({ page }) => {
  await page.route(/youtube/, (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<html></html>' }));
  await page.goto('/?nowebgl');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId('skip-intro').tap();
  await page.getByTestId('enter').tap();
  await expect(page.locator('canvas')).toHaveCount(0);
  await walk(page);
  await page.getByTestId('answer-talk').tap();
  await expect(page.getByTestId('outcome-talk')).toBeVisible();
  await snap(page, '12-fallback');
});

test('swipe gauche = étape suivante', async ({ page }) => {
  await enter(page);
  await page.waitForTimeout(500);
  const box = (await page.locator('.stage').boundingBox())!;
  const y = box.y + box.height * 0.3;
  await page.evaluate(([x0, x1, yy]) => {
    const el = document.querySelector('.stage')!;
    const ev = (type: string, x: number) => el.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: yy, pointerType: 'touch', bubbles: true }));
    ev('pointerdown', x0);
    ev('pointerup', x1);
  }, [box.x + box.width * 0.8, box.x + box.width * 0.2, y]);
  await expect(page.getByTestId('cp-2')).toBeVisible();
});
