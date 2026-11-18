import { Page, expect } from '@playwright/test'

export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM ANALISE'

export type OrderDetailsExpected = {
  number: string
  status: OrderStatus
  color: string
  wheels: string
  customer: { name: string; email: string }
  payment: string
}

export function createOrderLockupActions(page: Page) {

  const orderInput = page.getByRole('textbox', { name: 'Número do Pedido' })
  const searchButton = page.getByRole('button', { name: 'Buscar Pedido' })

  // Card com o resultado da consulta
  function orderCard(code: string) {
    return page.getByTestId(`order-result-${code}`)
  }

  // Badge de status dentro do card do pedido
  function statusBadge(code: string, status: OrderStatus) {
    return orderCard(code).getByRole('status')
  }

  async function ValidarPageLoaded() {
    await expect(
      page.getByRole('heading', { name: 'Consultar Pedido' })
    ).toBeVisible()
  }

  return {

    elements: {
      orderInput,
      searchButton,
    },

    orderCard,
    statusBadge,
    ValidarPageLoaded,
    
    // Antes: LandingPage.goto() + Navbar.orderLockUpLink() + ValidarPageLoaded()
    async open() {
      await page.goto('/')
      const title = page.getByTestId('hero-section').getByRole('heading')
      await expect(title).toContainText('Velô Sprint')

      await page.getByRole('link', { name: 'Consultar Pedido' }).click()
      await ValidarPageLoaded()
    },

    async searchOrder(code: string) {
      await orderInput.fill(code)
      await searchButton.click()
    },

    // Valida texto, cores e ícone do badge de acordo com o status
    async validateStatusBadge(code: string, status: OrderStatus) {
      // Classes derivadas: bg-{cor}-100, text-{cor}-700 e lucide-{icone}
      const statusStyles: Record<OrderStatus, { color: string; icon: string }> = {
        APROVADO: { color: 'green', icon: 'circle-check-big' },
        REPROVADO: { color: 'red', icon: 'circle-x' },
        'EM ANALISE': { color: 'amber', icon: 'circle-x' },
      }
      const { color, icon } = statusStyles[status]
      const badge = statusBadge(code, status)

      await expect(badge).toBeVisible()
      await expect(badge).toHaveText(status)
      await expect(badge).toHaveClass(new RegExp(`bg-${color}-100`))
      await expect(badge).toHaveClass(new RegExp(`text-${color}-700`))
      await expect(badge.locator('svg')).toHaveClass(new RegExp(`lucide-${icon}`))
    },

    async validateOrderDetails(order: OrderDetailsExpected) {
      const snapshot = `
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
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
      `
      await expect(orderCard(order.number)).toMatchAriaSnapshot(snapshot)
    },

    async validateOrderNotFound() {
      await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `)
    },
  }
}