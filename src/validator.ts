import { z } from "zod"

export const schema = z.object({
  name: z.string().min(1, { message: "名前を入力してください" }),
  gender: z.string().min(1, { message: "選択してください" }),
  email: z.string().email({ message: "不正なメールアドレスです" }),
})

export type FormType = z.infer<typeof schema>
