import { formatMoneyPtBR } from '@/ultis/formatMoneyPtBR'
import React from 'react'
import {
  Control,
  FieldValues,
  // UseFormSetValue,
  useWatch,
} from 'react-hook-form'

function removeMask(item: string) {
  console.log(item)
  return Number(item.replace(/\./g, '').replace(/,/g, '.'))
}

function totalCalWithDiscount(
  results: any,
  index: number,
  price: string | number,
) {
  const discountFormatted = removeMask(results[index].discount)
  console.log(discountFormatted)
  const priceFormatted = Number(price)
  const quantityFormatted = results[index].quantity
    .replace(/\./g, '')
    .replace(/,/g, '.')

  const totalValue =
    (Number(priceFormatted) - Number(discountFormatted)) *
    Number(quantityFormatted)

  return totalValue
}

interface CalcPerUnitProps {
  control: Control<FieldValues, any>
  // setValue: UseFormSetValue<FieldValues>
  index: number
  price: string | number
  name: string
}

export const CalcPerUnit = ({
  control,
  index,
  price,
  name = '',
}: CalcPerUnitProps) => {
  const results = useWatch({ control, name })
  const output = totalCalWithDiscount(results, index, price)

  // console.log(results)
  // console.log(output)

  return <p>{formatMoneyPtBR(output < 0 ? 0 : output)}</p>
}
