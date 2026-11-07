import { test, expect } from '@playwright/test';

test('el inicio muestra el logo y el botón Catálogo lleva a la colección', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('img', { name: /ESSENCS/ }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /Escríbenos por WhatsApp/ })).toBeVisible();
  // El botón late sin parar y Playwright espera a que esté quieto: se fuerza el clic.
  await page.getByRole('link', { name: 'Catálogo', exact: true }).click({ force: true });
  await expect(page).toHaveURL(/#coleccion/);
  await expect(page.getByRole('heading', { name: /Colección/i })).toBeVisible();
});

test('la colección carga los perfumes y filtra por Mujer', async ({ page }) => {
  await page.goto('/#coleccion');
  const tarjetas = page.locator('article');
  await expect(tarjetas.first()).toBeVisible();
  const total = await tarjetas.count();
  expect(total).toBeGreaterThan(0);

  await page.getByRole('button', { name: 'Mujer', exact: true }).click();
  await expect.poll(() => tarjetas.count()).toBeLessThan(total);
  expect(await tarjetas.count()).toBeGreaterThan(0);

  await page.getByRole('button', { name: 'Todos', exact: true }).click();
  await expect(tarjetas).toHaveCount(total);
});

test('Atrás y la flecha de la ficha vuelven a los perfumes, donde estaba', async ({ page, hasTouch }) => {
  await page.goto('/');
  // La intro del logo tapa la página unos segundos: se espera a que termine.
  await page.locator('.intro').waitFor({ state: 'detached', timeout: 15_000 });
  await page.goto('/#coleccion');
  const tarjeta = page.locator('article').nth(9);
  await expect(tarjeta).toBeVisible();
  // Salto directo (sin el scroll suave de la página) para medir una posición estable.
  await tarjeta.evaluate((el) => {
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'instant' });
  });
  // Las fotos terminan de cargar y acomodan la página unos píxeles: se mide ya quieta.
  await page.waitForTimeout(1500);
  const scroll = await page.evaluate(() => window.scrollY);
  expect(scroll).toBeGreaterThan(0);

  // Toque o clic donde está la foto, como una persona: el click() de Playwright mueve la página
  // para centrar el botón (y el "Ver detalles" se anima), lo que cambiaría la posición a medir.
  const abrir = async () => {
    const caja = await tarjeta.getByRole('button', { name: /Ver detalles de/ }).boundingBox();
    const x = caja.x + caja.width / 2;
    const y = caja.y + Math.min(caja.height / 2, 120);
    if (hasTouch) await page.touchscreen.tap(x, y);
    else await page.mouse.click(x, y);
  };

  // Botón Atrás del navegador o del celular.
  await abrir();
  const ficha = page.getByRole('dialog');
  await expect(ficha).toBeVisible();
  await page.goBack();
  await expect(ficha).toBeHidden();
  await expect(page).toHaveURL(/#coleccion/);
  expect(await page.evaluate(() => window.scrollY)).toBe(scroll);

  // Flecha de la esquina: tampoco deja pasos de más en el historial.
  await abrir();
  await expect(ficha).toBeVisible();
  await ficha.getByRole('button', { name: 'Volver a los perfumes' }).click();
  await expect(ficha).toBeHidden();
  expect(await page.evaluate(() => window.scrollY)).toBe(scroll);
  await page.goBack();
  await expect(page).not.toHaveURL(/#coleccion/);
});

test('añadir a la bolsa y ver el botón de pedir por WhatsApp', async ({ page }) => {
  await page.goto('/#coleccion');
  await page.locator('article').first().getByRole('button', { name: 'Añadir' }).click();
  await page.getByRole('button', { name: /Bolsa de compras, 1/ }).click();
  await expect(page.getByText(/Tu bolsa/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Pedir por WhatsApp/i })).toBeVisible();
});

test('captura de la colección', async ({ page }, testInfo) => {
  await page.goto('/#coleccion');
  await expect(page.locator('article').first()).toBeVisible();
  await page.screenshot({ path: `test-results/capturas/${testInfo.project.name}-coleccion.png`, fullPage: false });
});
