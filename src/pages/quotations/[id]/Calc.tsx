import { formatMoneyPtBR } from '@/ultis/formatMoneyPtBR'
import React from 'react'
import {
  Control,
  FieldValues,
  // UseFormSetValue,
  useWatch,
} from 'react-hook-form'

function removeMask(item: string) {
  return Number(item.replace(/\./g, '').replace(/,/g, '.'))
}

function totalCalWithDiscount(
  results: any,
  index: number,
  price: string | number,
) {
  const discountFormatted = removeMask(results[index].discount)
  const priceFormatted = Number(price)

  const totalValue =
    (Number(priceFormatted) - discountFormatted) *
    Number(results[index].quantity)

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

  console.log(results)
  console.log(output)

  return <p>{formatMoneyPtBR(output)}</p>
}
