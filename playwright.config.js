import { defineConfig, devices } from '@playwright/test';

// Pruebas de la tienda en celular (iPhone y Android) y en computador.
// Playwright levanta solo el servidor de Vite antes de correrlas.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:5173',
    // Con movimiento reducido la intro animada no aparece y las pruebas van directo a la página.
    reducedMotion: 'reduce',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'iPhone', use: { ...devices['iPhone 15'] } },
    { name: 'Android', use: { ...devices['Pixel 7'] } },
    { name: 'Computador', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
