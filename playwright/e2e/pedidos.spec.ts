import { test, expect } from '@playwright/test'

import { gerarCodigoPedido } from '../support/helpers'


// AAA - Arrange, Act, Assert
// Arrange - Preparar o cenário
// Act - Executar a ação
// Assert - Verificar o resultado


test.describe('Consultar Pedido', () => {

  test.beforeEach(async ({ page }) => {
    // Arrange
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })).toBeVisible()

    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  })

  test('Deve consultar pedido', async ({ page }) => {

    // Test data
    const order = 'VLO-LAOTEO'

    // Act
    //await page.getByTestId('search-order-id').click()
    //await page.getByTestId('search-order-button').click()

    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    // Assert

    // Xpha
    //const orderCode = page.locator('//p[text()="Pedido"]/ .. //p[text()="VLO-6E2J20"]')
    //await expect(orderCode).toBeVisible({timeout: 10_000})

    const containerPedido = page.getByRole('paragraph')
      .filter({ hasText: /^Pedido$/ })
      .locator(' .. ') //Sobe para o elemento pai (a div que agrupa ambos)

    await expect(containerPedido).toContainText(order, { timeout: 10_000 })
    await expect(page.getByText('APROVADO')).toBeVisible()

  })

  test('Deve mostrar mensagem de erro quando o pedido nao é encontrado', async ({ page }) => {

    const order = gerarCodigoPedido()

    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `);

  })
})
