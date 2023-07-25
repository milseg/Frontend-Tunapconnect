import React, { forwardRef } from 'react'
import { Control, Controller } from 'react-hook-form'
import MaskedInput from 'react-text-mask'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

import { TextField, TextFieldProps } from '@mui/material'

const defaultMaskOptions = {
  prefix: '',
  suffix: '',
  thousandsSeparatorSymbol: '.',
  integerLimit: 7, // limit length of integer numbers
  allowNegative: false,
}

const numberMask = forwardRef(function textMaskCustom(props, ref) {
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

export function InputNumber({ name, control, ...rest }: InputMoneyMaskProps) {
  return (
    <Controller
      render={({ field }) => (
        <TextField
          // label="TELEFONE"
          variant="standard"
          size="small"
          sx={{ width: 75 }}
          {...rest}
          // style={{ marginTop: 11 }}
          fullWidth
          {...field}
          InputProps={{
            // @ts-ignore
            inputComponent: numberMask,
          }}
        />
      )}
      name={name}
      control={control}
    />
  )
}
