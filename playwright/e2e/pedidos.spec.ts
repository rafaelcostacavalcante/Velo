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
  //await page.getByTestId('search-order-button').click()

  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-LAOTEO')  
  await page.getByRole('button', { name: 'Buscar Pedido' }).click()
  
  // Assert

  // Xpha
  //const orderCode = page.locator('//p[text()="Pedido"]/ .. //p[text()="VLO-6E2J20"]')
  //await expect(orderCode).toBeVisible({timeout: 10_000})

  const containerPedido = page.getByRole('paragraph')
  .filter({hasText: /^Pedido$/})
  .locator(' .. ') //Sobe para o elemento pai (a div que agrupa ambos)

  await expect(containerPedido).toContainText('VLO-LAOTEO', { timeout: 10_000 })  
  await expect(page.getByText('APROVADO')).toBeVisible()

  //await expect(page.getByText('VLO-LAOTEO')).toBeVisible({timeout: 10_000})  
  
  //await expect(page.getByText('Pedido', { exact: true })).toBeVisible();
  //await expect(page.getByText('APROVADO')).toBeVisible();

  //await expect(page.getByTestId('order-result-id')).toBeVisible()  
  //await expect(page.getByTestId('order-result-id')).toContainText('VLO-LAOTEO')
  
  //await expect(page.getByTestId('order-result-status')).toBeVisible()
  //await expect(page.getByTestId('order-result-status')).toContainText('APROVADO')
})