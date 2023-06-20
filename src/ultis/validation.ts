// export function validateCPF(strCPF: string) {
//   let soma
//   let resto
//   soma = 0
//   if (strCPF === '00000000000') return false

//   for (let i = 1; i <= 9; i++) {
//     resto = (soma * 10) % 11

//     if (resto === 10 || resto === 11) resto = 0
//     if (resto !== parseInt(strCPF.substring(9, 10))) return false

//     soma = 0
//     for (i = 1; i <= 10; i++)
//       soma = soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i)
//     resto = (soma * 10) % 11
//     soma = soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i)
//   }

//   if (resto === 10 || resto === 11) resto = 0
//   if (resto !== parseInt(strCPF.substring(10, 11))) return false
//   return true
// }

const calcFirstChecker = (firstNineDigits: string): number => {
  let sum = 0

  for (let i = 0; i < 9; ++i) {
    sum += Number(firstNineDigits.charAt(i)) * (10 - i)
  }

  const lastSumChecker = sum % 11
  return lastSumChecker < 2 ? 0 : 11 - lastSumChecker
}

const calcSecondChecker = (cpfWithChecker1: string): number => {
  let sum = 0

  for (let i = 0; i < 10; ++i) {
    sum += Number(cpfWithChecker1.charAt(i)) * (11 - i)
  }

  const lastSumChecker2 = sum % 11
  return lastSumChecker2 < 2 ? 0 : 11 - lastSumChecker2
}

const hasCPFLength = (cpf: string): void | boolean => {
  if (cpf.length > 11 || cpf.length < 11) {
    return false
  }

  return true
}

const allDigitsAreEqual = (digits: string): boolean => {
  for (let i = 0; i < 10; i++) {
    if (digits === Array.from({ length: digits.length + 1 }).join(String(i))) {
      return true
    }
  }

  return false
}

export const validateCPF = (value: string): boolean => {
  if (typeof value !== 'string') {
    return false
  }

  const cleanCPF = String(value).replace(/[\s.-]/g, '')
  const firstNineDigits = cleanCPF.slice(0, 9)
  const checker = cleanCPF.slice(9, 11)

  if (!hasCPFLength(cleanCPF) || allDigitsAreEqual(cleanCPF)) {
    return false
  }

  const checker1 = calcFirstChecker(firstNineDigits)
  const checker2 = calcSecondChecker(`${firstNineDigits}${checker1}`)

  return checker === `${checker1}${checker2}`
}
