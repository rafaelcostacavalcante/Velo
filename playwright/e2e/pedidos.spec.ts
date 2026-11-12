import { test, expect } from '@playwright/test'

import { gerarCodigoPedido } from '../support/helpers'

import { OrderLockupPage, OrderStatus } from '../support/pages/OrderLockupPage'

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

  test('Deve consultar pedido APROVADO', async ({ page }) => {

    // Test data
    const order = {
      number: 'VLO-LAOTEO',
      status: 'APROVADO' as OrderStatus,
      model: 'Velô Sprint',
      color: 'Midnight Black',
      interior: 'cream',
      wheels: 'aero Wheels',
      customer: {
        name: 'Rafael Aprovado',
        email: 'aprovado@velo.dev'
      },
      payment: 'À Vista'
    }

    // Act
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await expect(orderLockupPage.orderCard(order.number)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
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
    `)

    await orderLockupPage.validateStatusBadge(order.number, order.status)
  })

  test('Deve consultar pedido REPROVADO', async ({ page }) => {

    // Test data
    const order = {
      number: 'VLO-USICXP',
      status: 'REPROVADO' as OrderStatus,
      model: 'Velô Sprint',
      color: 'Glacier Blue',
      interior: 'cream',
      wheels: 'sport Wheels',
      customer: {
        name: 'PEDRO SANCHES',
        email: 'PEDRO@GMAIL.COM'
      },
      payment: 'À Vista'
    }

    // Act
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await expect(orderLockupPage.orderCard(order.number)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
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
    `)

    await orderLockupPage.validateStatusBadge(order.number, order.status)
  })

  test('Deve consultar pedido EM ANALISE', async ({ page }) => {

    // Test data
    const order = {
      number: 'VLO-Z3TXHK',
      status: 'EM ANALISE' as OrderStatus,
      model: 'Velô Sprint',
      color: 'Glacier Blue',
      interior: 'cream',
      wheels: 'aero Wheels',
      customer: {
        name: 'ENEIAS EMANALISE',
        email: 'EM_ANALISE@GMAIL.COM'
      },
      payment: 'À Vista'
    }

    // Act
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await expect(orderLockupPage.orderCard(order.number)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
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
    `)

    await orderLockupPage.validateStatusBadge(order.number, order.status)
  })

  test('Deve mostrar mensagem de erro quando o pedido nao é encontrado', async ({ page }) => {

    const order = gerarCodigoPedido()
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order)

    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
    `)
  })
})