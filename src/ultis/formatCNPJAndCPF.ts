export function formatCNPJAndCPF(document: string) {
  const documentFormatted = document.replace(/[^\d]/g, '')
  if (documentFormatted.length < 11) return ''
  if (documentFormatted.length > 11) {
    return documentFormatted.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5',
    )
  } else {
    return documentFormatted.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4',
    )
  }
}
export function formatCNPJAndCPFNumber(
  value: number | string,
  type: boolean | null,
): string {
  if (type === true) {
    const stringDefault = '00000000000'
    const qtdDigitsCPF = 11 - `${value}`.length

    const inicialCpfString = stringDefault.slice(0, qtdDigitsCPF)
    return `${inicialCpfString}${value}`.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4',
    )
  }
  if (type === null) {
    return `${value}`
  }
  if (type === false) {
    const stringDefault = '00000000000000'
    const qtdDigitsCNPJ = 14 - `${value}`.length

    const inicialCNPJString = stringDefault.slice(0, qtdDigitsCNPJ)

    return `${inicialCNPJString}${value}`.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5',
    )
  }
  return ''
}
