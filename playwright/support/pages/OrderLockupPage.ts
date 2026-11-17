import { Page, Locator, expect } from '@playwright/test'

type OrderStatus = 'APROVADO' | 'REPROVADO' | 'EM ANALISE'

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
}