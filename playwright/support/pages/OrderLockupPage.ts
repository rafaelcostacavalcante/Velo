import { Page, Locator, expect } from '@playwright/test'

export type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM ANALISE'

export type OrderDetailsExpected = {
  number: string  
  status: OrderStatus
  color: string
  wheels: string
  customer: {name: string; email: string}
  payment: string
}

export class OrderLockupPage {
  constructor(private page: Page) {}

  async searchOrder(code: string) {
    await this.page.getByRole('textbox', { name: 'Número do Pedido' }).fill(code)
    await this.page.getByRole('button', { name: 'Buscar Pedido' }).click()
  }  

  // Card com o resultado da consulta
  orderCard(code: string): Locator {
    return this.page.getByTestId(`order-result-${code}`)
  }
  
  // Badge de status dentro do card do pedido
  statusBadge(code: string, status: OrderStatus): Locator {
    return this.orderCard(code).getByRole('status')
  }

  // Valida texto, cores e ícone do badge de acordo com o status
  async validateStatusBadge(code: string, status: OrderStatus) {
    // Classes derivadas: bg-{cor}-100, text-{cor}-700 e lucide-{icone}
    const statusStyles: Record<OrderStatus, { color: string; icon: string }> = {
      APROVADO: { color: 'green', icon: 'circle-check-big' },
      REPROVADO: { color: 'red', icon: 'circle-x' },
      'EM ANALISE': { color: 'amber', icon: 'circle-x' },
    }
    const { color, icon } = statusStyles[status]
    const badge = this.statusBadge(code, status)

    await expect(badge).toBeVisible()
    await expect(badge).toHaveText(status)
    await expect(badge).toHaveClass(new RegExp(`bg-${color}-100`))
    await expect(badge).toHaveClass(new RegExp(`text-${color}-700`))
    await expect(badge.locator('svg')).toHaveClass(new RegExp(`lucide-${icon}`))
  }

  async validateOrderDetails(order:OrderDetailsExpected){
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
    await expect(this.page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(snapshot)

  }

  async validateOrderNotFound() {    
    // Assert
    await expect(this.page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `)
  }

  async ValidarPageLoaded() {
    await expect(
      this.page.getByRole('heading', { name: 'Consultar Pedido' })).toBeVisible()    
  }

}