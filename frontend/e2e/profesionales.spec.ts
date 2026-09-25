import { test, expect } from '@playwright/test';

const GESTOR_CI = '8812345';
const GESTOR_PASS = '123456';

test.describe('Módulo Profesionales — Flujo E2E', () => {

  test.beforeEach(async ({ page }) => {
    // Login Kerberos como GESTOR_REGISTRO_PROFESIONAL
    await page.goto('/auth/kerberos');
    await page.fill('#ci', GESTOR_CI);
    await page.fill('#password', GESTOR_PASS);
    await page.click('button[type="submit"]');

    // Esperar redirección al dashboard
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 });
  });

  test('1. Sidebar muestra solo Profesionales', async ({ page }) => {
    // Debe ver "Profesionales"
    await expect(page.getByText('Profesionales', { exact: false }).first()).toBeVisible();

    // NO debe ver "Cumplimiento SIPPCI" ni "Capacitaciones" ni "Pagos"
    await expect(page.getByText('Cumplimiento SIPPCI')).not.toBeVisible();
    await expect(page.getByText('Pagos')).not.toBeVisible();
  });

  test('2. Lista de solicitudes Natural carga', async ({ page }) => {
    await page.click('text=Solicitudes Natural');
    await page.waitForURL(/\/admin\/profesionales\/solicitudes\/natural/);

    // Debe haber al menos 1 fila
    await expect(page.locator('table tbody tr').first()).toBeVisible();

    // Buscar SOL-NAT-2026-001
    await expect(page.getByText('SOL-NAT-2026-001')).toBeVisible();
  });

  test('3. Expediente Digital muestra datos', async ({ page }) => {
    await page.goto('/admin/profesionales/solicitudes/natural/SOL-NAT-2026-002');

    // Verificar que carga el expediente
    await expect(page.getByRole('heading', { name: /SOL-NAT-2026-002/ })).toBeVisible();
    await expect(page.getByText('Juan')).toBeVisible();

    // Botones deben estar visibles
    await expect(page.getByRole('button', { name: /Aprobar/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Observar/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Rechazar/i })).toBeVisible();
  });

  test('4. Modal Observar abre y valida', async ({ page }) => {
    await page.goto('/admin/profesionales/solicitudes/natural/SOL-NAT-2026-002');

    // Click en Observar
    await page.click('button:has-text("Observar")');
    await page.waitForTimeout(500);

    // Modal debe aparecer
    await expect(page.getByText('Observar Solicitud')).toBeVisible();

    // Textarea debe existir
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();

    // Botón Confirmar debe estar deshabilitado inicialmente
    const btnObservar = page.locator('button:has-text("Observar")').last();
    await expect(btnObservar).toBeDisabled();

    // Escribir 10+ caracteres
    await textarea.fill('Falta el título profesional notariado');

    // Botón ahora debe estar habilitado
    await expect(btnObservar).toBeEnabled();

    // Cancelar con Escape (overlay interceptaba click normal)
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    await expect(page.getByRole('heading', { name: 'Observar Solicitud' })).not.toBeVisible();
  });

  test('5. Lista de certificados emitidos carga', async ({ page }) => {
    await page.goto('/admin/profesionales/certificados');

    // Debe cargar sin errores
    await expect(page.getByRole('heading', { name: 'Certificados Emitidos' })).toBeVisible();

    // Debe haber al menos 1 fila (CERT-2026-0001)
    await expect(page.locator('table tbody tr').first()).toBeVisible();
  });

  test('6. Página pública de validación funciona', async ({ page, context }) => {
    // Cerrar sesión: ir directo a la página pública
    await context.clearCookies();
    await page.goto('/validar-certificado/CERT-2026-0001');

    // Debe mostrar "Certificado Válido" (verde)
    await expect(page.getByText(/Certificado Válido/i)).toBeVisible({ timeout: 10000 });

    // Debe mostrar datos del titular
    await expect(page.getByText('CERT-2026-0001')).toBeVisible();
  });

  test('7. Validación de certificado inválido', async ({ page }) => {
    await page.goto('/validar-certificado/INVALIDO-123');
    await expect(page.getByText(/Certificado No Válido/i)).toBeVisible({ timeout: 10000 });
  });

});
