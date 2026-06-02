import { test, expect } from '@playwright/test'

test('Deve consultar pedido', async ({ page }) => {
  await page.goto('http://localhost:5173/')
  
  // Checkpoint: Verifica se a página de landing foi carregada  
  await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()

  await page.getByRole('link', { name: 'Consultar Pedido' }).click()

  // Checkpoint: Verifica se a página de consulta de pedido foi carregada  
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  
  await page.getByTestId('search-order-id').click()
  await page.getByTestId('search-order-id').fill('VLO-LAOTEO') 

  await page.getByTestId('search-order-button').click()
  await expect(page.getByTestId('order-result-id')).toBeVisible()
  await expect(page.getByTestId('order-result-id')).toContainText('VLO-LAOTEO')
  await expect(page.getByTestId('order-result-status')).toBeVisible()
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO')
})