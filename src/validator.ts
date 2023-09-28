import { z } from "zod"

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

const cardSchema = z.object({
  number: z.string().refine(isValidCreditCardNumber, { message: "カード番号が正しくありません" }),
  name: z.string().min(1, { message: "名前を入力してください" }),
  expiryMonth: z.string(),
  expiryYear: z.string(),
  cvc: z.string().refine(isValidCvc, { message: "正しいCVCを入力してください" }),
})

const paypalSchema = z.object({
  email: z.string().email({ message: "メールアドレスが正しくありません" }),
})

const conviniSchema = z.object({
  conviniName: z.custom<ConviniName>(),
})

export const schema = z.union([
  z.object({
    paymentMethod: z.literal("card"),
    card: cardSchema,
    paypal: paypalSchema.optional(),
    convini: conviniSchema.optional(),
  }),
  z.object({
    paymentMethod: z.literal("paypal"),
    paypal: paypalSchema,
    card: cardSchema.optional(),
    convini: conviniSchema.optional(),
  }),
  z.object({
    paymentMethod: z.literal("convini"),
    convini: conviniSchema,
    card: cardSchema.optional(),
    paypal: paypalSchema.optional(),
  }),
])
export type FormType = z.infer<typeof schema>
