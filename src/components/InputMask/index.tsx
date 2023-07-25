import React, { forwardRef } from 'react'
import MaskedInput, { conformToMask } from 'react-text-mask'

const maskCNPJ = [
  /\d/,
  /\d/,
  '.',
  /\d/,
  /\d/,
  /\d/,
  '.',
  /\d/,
  /\d/,
  /\d/,
  '/',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
]

export const conformedCNPJNumber = (cnpjNumber: string) =>
  conformToMask(cnpjNumber, maskCNPJ, { guide: false }).conformedValue

export const TextMaskPHONE = forwardRef(function textMaskCustom(props, ref) {
  const { ...other } = props
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        return ref ? ref.inputElement : null
      }}
      // ref={(ref) => {
      //   inputRef(ref ? ref.inputElement : null)
      // }}
      mask={[
        '(',
        /[1-9]/,
        /\d/,
        ')',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      placeholderChar={'\u2000'}
      guide
      keepCharPositions
    />
  )
})
export const TextMaskCPF = forwardRef(function textMaskCustom(props, ref) {
  const { ...other } = props
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        return ref ? ref.inputElement : null
      }}
      // ref={(ref) => {
      //   inputRef(ref ? ref.inputElement : null)
      // }}
      mask={[
        /\d/,
        /\d/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
      ]}
      placeholderChar={'\u2000'}
      guide
      keepCharPositions
    />
  )
})
export const TextMaskCNPJ = forwardRef(function textMaskCustom(props, ref) {
  const { ...other } = props
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        return ref ? ref.inputElement : null
      }}
      // ref={(ref) => {
      //   inputRef(ref ? ref.inputElement : null)
      // }}
      mask={[
        /\d/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '.',
        /\d/,
        /\d/,
        /\d/,
        '/',
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
      ]}
      placeholderChar={'\u2000'}
      guide
      keepCharPositions
    />
  )
})
