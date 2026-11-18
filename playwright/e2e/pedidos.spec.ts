import { test, expect } from '@playwright/test'

import { gerarCodigoPedido } from '../support/helpers'

import { OrderLockupPage, OrderDetailsExpected } from '../support/pages/OrderLockupPage'
import { LandingPage } from '../support/pages/LandingPage'
import { Navbar } from '../support/Components/Navbar'

// AAA - Arrange, Act, Assert
// Arrange - Preparar o cenário
// Act - Executar a ação
// Assert - Verificar o resultado

test.describe('Consultar Pedido', () => {

  test.beforeEach(async ({ page }) => {
    // Arrange
    await new LandingPage(page).goto()

    // Arrange - Navega via componente
    await new Navbar(page).orderLockUpLink()
    
    // Assert - Confirma que estamos en la pagina
    await new OrderLockupPage(page).ValidarPageLoaded()
    
  })

  test('Deve consultar pedido APROVADO', async ({ page }) => {

    // Test data
    const order: OrderDetailsExpected = {
      number: 'VLO-LAOTEO',
      status: 'APROVADO',       
      color: 'Midnight Black',      
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
    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.number, order.status)
  })

  test('Deve consultar pedido REPROVADO', async ({ page }) => {

    // Test data
    const order: OrderDetailsExpected = {
      number: 'VLO-USICXP',
      status: 'REPROVADO',      
      color: 'Glacier Blue',      
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
    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.number, order.status)
  })

  test('Deve consultar pedido EM ANALISE', async ({ page }) => {

    // Test data
    const order: OrderDetailsExpected = {
      number: 'VLO-Z3TXHK',
      status: 'EM ANALISE',      
      color: 'Glacier Blue',      
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
    await orderLockupPage.validateOrderDetails(order)
    await orderLockupPage.validateStatusBadge(order.number, order.status)
  })

  test('Deve mostrar mensagem de erro quando o pedido nao é encontrado', async ({ page }) => {

    const order = gerarCodigoPedido()

    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order)

    await orderLockupPage.validateOrderNotFound()
  })

  test('Deve mostrar mensagem de erro quando o numero do pedido nao cumpre os criterios de formato', async ({ page }) => {
    
    const orderCode = 'ABC-123-INVALIDO'

    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(orderCode)
    await orderLockupPage.validateOrderNotFound()
  })

})

