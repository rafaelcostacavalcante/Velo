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

  test('Deve consultar pedido ARPVADO', async ({ page }) => {

    // Test data
    //  const order = 'VLO-LAOTEO'

    const order = {

      code: 'VLO-LAOTEO',
      status: 'APROVADO',
      model: 'Velô Sprint',
      color: 'Midnight Black',
      interior: 'cream',
      wheels: 'aero Wheels',
      customer: {        
        name: 'Pedido 2 dois',
        email: 'pedido@velo.dev'
      },
      payment:'À Vista'
    }

    // Act
    //await page.getByTestId('search-order-id').click()
    //await page.getByTestId('search-order-button').click()

    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.code)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    // Assert

    // Xpha
    //const orderCode = page.locator('//p[text()="Pedido"]/ .. //p[text()="VLO-6E2J20"]')
    //await expect(orderCode).toBeVisible({timeout: 10_000})

   /* const containerPedido = page.getByRole('paragraph')
      .filter({ hasText: /^Pedido$/ })
      .locator(' .. ') //Sobe para o elemento pai (a div que agrupa ambos)

    await expect(containerPedido).toContainText(order, { timeout: 10_000 })
    await expect(page.getByText('APROVADO')).toBeVisible() */ 

    await expect(page.getByTestId(`order-result-${order.code}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.code}
      - img
      - text: ${order.status}
    
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: ${order.model}
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: ${order.interior}
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: Pedido 2 dois
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);
  })

  test('Deve consultar pedido REPROVADO', async ({ page }) => {

    // Test data
    // const order = 'VLO-USICXP'

    const order = {

      code: 'VLO-USICXP',
      status: 'REPROVADO',
      model: 'Velô Sprint',
      color: 'Glacier Blue',
      interior: 'cream',
      wheels: 'sport Wheels',
      customer: {        
        name: 'PEDRO SANCHES',
        email: 'PEDRO@GMAIL.COM'
      },
      payment:'À Vista'
    }

    // Act
    //await page.getByTestId('search-order-id').click()
    //await page.getByTestId('search-order-button').click()

    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.code)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    // Assert

    // Xpha
    //const orderCode = page.locator('//p[text()="Pedido"]/ .. //p[text()="VLO-6E2J20"]')
    //await expect(orderCode).toBeVisible({timeout: 10_000})

   /*  const containerPedido = page.getByRole('paragraph')
      .filter({ hasText: /^Pedido$/ })
      .locator(' .. ') //Sobe para o elemento pai (a div que agrupa ambos)

    await expect(containerPedido).toContainText(order, { timeout: 10_000 })
    await expect(page.getByText('APROVADO')).toBeVisible() */

    await expect(page.getByTestId(`order-result-${order.code}`)).toMatchAriaSnapshot(`  

      - img
      - paragraph: Pedido
      - paragraph: ${order.code}
      - img
      - text: REPROVADO

      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: ${order.model}
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: ${order.interior}
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);
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
