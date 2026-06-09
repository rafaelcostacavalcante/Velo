import { test, expect } from '@playwright/test'

// AAA - Arrange, Act, Assert
// Arrange - Preparar o cenário
// Act - Executar a ação
// Assert - Verificar o resultado

test('Deve consultar pedido', async ({ page }) => {
  // Arrange
  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  
  // Act
  //await page.getByTestId('search-order-id').click()
  
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-LAOTEO')
  await page.getByTestId('search-order-button').click()
  
  // Assert
  await expect(page.getByTestId('order-result-id')).toBeVisible({timeout: 10000})
  await expect(page.getByTestId('order-result-id')).toContainText('VLO-LAOTEO')

  await expect(page.getByTestId('order-result-status')).toBeVisible()
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO')
})