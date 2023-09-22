import { z } from "zod"

type PaymentMethod = "card" | "bank" | "paypal" | "cache"

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

const isValidCVC = (cvc: string) => {
  const pattern = /^\d{3,4}$/
  return pattern.test(cvc)
}

export const schema = z.object({
  name: z.string().min(1, { message: "名前を入力してください" }),
  gender: z.string().min(1, { message: "選択してください" }),
  email: z.string().email({ message: "不正なメールアドレスです" }),
  paymentMethod: z.custom<PaymentMethod>(),
})

export type FormType = z.infer<typeof schema>
