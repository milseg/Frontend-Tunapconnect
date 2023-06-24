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
