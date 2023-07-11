export function formatMoneyPtBR(value: number | string) {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(value)
  } else if (typeof value === 'string') {
    const valueFormmatted = value.replace(/\./g, '').replace(/,/g, '.')
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(Number(valueFormmatted))
  }
}
