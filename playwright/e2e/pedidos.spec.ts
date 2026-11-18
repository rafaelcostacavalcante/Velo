import { test } from '../support/fixtures'

import { gerarCodigoPedido } from '../support/helpers'

import { OrderDetailsExpected } from '../support/actions/orderLockupActions'

// AAA - Arrange, Act, Assert
// Arrange - Preparar o cenário
// Act - Executar a ação
// Assert - Verificar o resultado

test.describe('Consultar Pedido', () => {

  test.beforeEach(async ({ app }) => {
    await app.orderLockup.open()        
  })

  test('Deve consultar pedido APROVADO', async ({ app }) => {

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
    await app.orderLockup.searchOrder(order.number)

    // Assert
    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.number, order.status)
  })

  test('Deve consultar pedido REPROVADO', async ({ app }) => {

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
    await app.orderLockup.searchOrder(order.number)

    // Assert
    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.number, order.status)
  })

  test('Deve consultar pedido EM ANALISE', async ({ app }) => {

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
    await app.orderLockup.searchOrder(order.number)

    // Assert
    await app.orderLockup.validateOrderDetails(order)
    await app.orderLockup.validateStatusBadge(order.number, order.status)
  })

  test('Deve mostrar mensagem de erro quando o pedido nao é encontrado', async ({ app }) => {

    // Act
    const order = gerarCodigoPedido()
    // Assert
    await app.orderLockup.searchOrder(order)
    await app.orderLockup.validateOrderNotFound()
  })

  test('Deve mostrar mensagem de erro quando o numero do pedido nao cumpre os criterios de formato', async ({ app }) => {

    const orderCode = 'ABC-123-INVALIDO'

    await app.orderLockup.searchOrder(orderCode)
    await app.orderLockup.validateOrderNotFound()
  })

})
