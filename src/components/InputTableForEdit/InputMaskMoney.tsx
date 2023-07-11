import React, { forwardRef } from 'react'
import { Control, Controller } from 'react-hook-form'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { TextField, TextFieldProps } from '@mui/material'

const defaultMaskOptions = {
  prefix: '',
  suffix: '',
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: '.',
  allowDecimal: true,
  decimalSymbol: ',',
  decimalLimit: 2, // how many digits allowed after the decimal
  integerLimit: 7, // limit length of integer numbers
  // requireDecimal: true,
  allowNegative: false,
  allowLeadingZeroes: false,
}

const MoneyMask = forwardRef(function textMaskCustom(props, ref) {
  const { ...other } = props
  const currencyMask = createNumberMask({
    ...defaultMaskOptions,
    // ...maskOptions,
  })
  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        return ref ? ref.inputElement : null
      }}
      mask={currencyMask}
    />
  )
})

type InputMoneyMaskProps = {
  name: string
  control: Control<any, any> | undefined
} & TextFieldProps

export function InputMoneyMask({ name, control }: InputMoneyMaskProps) {
  return (
    <Controller
      render={({ field }) => (
        <TextField
          variant="standard"
          size="small"
          sx={{ width: 105 }}
          // style={{ marginTop: 11 }}
          fullWidth
          {...field}
          InputProps={{
            // @ts-ignore
            inputComponent: MoneyMask,
          }}
        />
      )}
      name={name}
      control={control}
    />
  )
}
