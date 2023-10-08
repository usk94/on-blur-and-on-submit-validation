import { z } from "zod"

export type PaymentMethodType = "card" | "bank" | "convini"

type ConviniName = "familyMart" | "sevenEleven" | "lawson"

export const currentYear = new Date().getFullYear()

const isValidCreditCardNumber = (cardNumber: string) => {
  const number = cardNumber.replace(/\s+/g, "")
  if (!/^\d+$/.test(number)) {
    return false
  }

  let total = 0
  let isEven = false

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i], 10)
    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    total += digit
    isEven = !isEven
  }
  return total % 10 === 0
}

const isValidExpiryMonth = (expiryMonth: string) => {
  const numberValue = parseInt(expiryMonth, 10)
  return numberValue >= 1 && numberValue <= 12
}

const isValidExpiryYear = (expiryYear: string) => {
  const numberValue = parseInt(expiryYear, 10)
  return numberValue >= currentYear && numberValue <= currentYear + 10
}

const isValidCvc = (cvc: string) => {
  return /^\d{3,4}$/.test(cvc)
}

const skipCardSchema = z.object({
  number: z.string().optional(),
  name: z.string().optional(),
  expiryMonth: z.string().optional(),
  expiryYear: z.string().optional(),
  cvc: z.string().optional(),
})

const skipConviniSchema = z.object({
  conviniName: z.custom<ConviniName>().optional(),
})

export const schema = z.discriminatedUnion("selectedPaymentMethod", [
  z.object({
    selectedPaymentMethod: z.literal("card"),
    card: z.object({
      number: z.string().refine(isValidCreditCardNumber, { message: "カード番号が正しくありません" }),
      name: z.string().min(1, { message: "名前を入力してください" }),
      expiryMonth: z.string().refine(isValidExpiryMonth, { message: "選択してください" }),
      expiryYear: z.string().refine(isValidExpiryYear, { message: "選択してください" }),
      cvc: z.string().refine(isValidCvc, { message: "正しいCVCを入力してください" }),
    }),
    convini: skipConviniSchema,
  }),
  z.object({
    selectedPaymentMethod: z.literal("convini"),
    convini: z.object({
      conviniName: z.custom<ConviniName>(),
    }),
    card: skipCardSchema,
  }),
  z.object({
    selectedPaymentMethod: z.literal("bank"),
    card: skipCardSchema,
    convini: skipConviniSchema,
  }),
])
export type FormType = z.infer<typeof schema>
