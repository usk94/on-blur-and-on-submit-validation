import { z } from "zod"

export type PaymentMethodType = "card" | "paypal" | "convini"

type ConviniName = "familyMart" | "sevenEleven" | "lawson"

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

const isValidCvc = (cvc: string) => {
  return /^\d{3,4}$/.test(cvc)
}

export const schema = z.discriminatedUnion("selectedPaymentMethod", [
  z.object({
    selectedPaymentMethod: z.literal("card"),
    card: z.object({
      number: z.string().refine(isValidCreditCardNumber, { message: "カード番号が正しくありません" }),
      name: z.string().min(1, { message: "名前を入力してください" }),
      expiryMonth: z.string(),
      expiryYear: z.string(),
      cvc: z.string().refine(isValidCvc, { message: "正しいCVCを入力してください" }),
    }),
    paypal: z.object({
      email: z.string().nullable(),
    }),
    convini: z.object({
      conviniName: z.custom<ConviniName>().nullable(),
    }),
  }),
  z.object({
    selectedPaymentMethod: z.literal("paypal"),
    paypal: z.object({
      email: z.string().email({ message: "メールアドレスが正しくありません" }),
    }),
    card: z.object({
      number: z.string().nullable(),
      name: z.string().nullable(),
      expiryMonth: z.string().nullable(),
      expiryYear: z.string().nullable(),
      cvc: z.string().nullable(),
    }),
    convini: z.object({
      conviniName: z.custom<ConviniName>().nullable(),
    }),
  }),
  z.object({
    selectedPaymentMethod: z.literal("convini"),
    convini: z.object({
      conviniName: z.custom<ConviniName>(),
    }),
    card: z.object({
      number: z.string().nullable(),
      name: z.string().nullable(),
      expiryMonth: z.string().nullable(),
      expiryYear: z.string().nullable(),
      cvc: z.string().nullable(),
    }),
    paypal: z.object({
      email: z.string().nullable(),
    }),
  }),
])
export type FormType = z.infer<typeof schema>
