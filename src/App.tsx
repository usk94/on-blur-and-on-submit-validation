import { useForm, useWatch } from "react-hook-form"
import { FormType, PaymentMethodType, schema } from "./validator"
import { zodResolver } from "@hookform/resolvers/zod"

const paymentMethods = ["card", "paypal", "convini"] as const

const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormType>({
    defaultValues: {
      selectedPaymentMethod: "card",
      card: {
        number: "",
        name: "",
        expiryYear: "",
        expiryMonth: "",
      },
      paypal: {
        email: "",
      },
      convini: {
        conviniName: null,
      },
    },
    mode: "onBlur",
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormType) => console.log(data)
  const selectedPaymentMethod = useWatch({ control, name: "selectedPaymentMethod" })
  const isActive = (paymentMethod: PaymentMethodType) => paymentMethod === selectedPaymentMethod

  console.log("here", selectedPaymentMethod)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-screen h-screen justify-center items-center">
      <p className="text-xl font-semibold">支払い方法</p>
      <div className="mt-2 flex flex-col gap-y-4 w-80">
        {paymentMethods.map((method) => {
          switch (method) {
            case "card":
              return (
                <label className="flex flex-col w-full rounded-lg border py-4 px-4 border-gray-200">
                  <div className="flex">
                    <input type="radio" value="card" {...register("selectedPaymentMethod")} />
                    <div className="flex items-center gap-x-3">
                      <div className="text-left">
                        <p className="ml-2 text-sm font-semibold text-black">カード</p>
                      </div>
                    </div>
                  </div>
                  {isActive(method) && (
                    <div className="flex flex-col">
                      <div className="flex mt-4 items-center">
                        <p className="text-sm">カード番号</p>
                        <input {...register("card.number")} className="border border-gray-300 rounded ml-2" />
                      </div>
                      <div className="flex mt-4 items-center">
                        <p className="text-sm">氏名</p>
                        <input {...register("card.name")} className="border border-gray-300 rounded ml-2" />
                      </div>
                      <div className="flex mt-4 items-center">
                        <p className="text-sm">有効期限</p>
                        <input {...register("card.number")} className="border border-gray-300 rounded ml-2" />
                      </div>
                      <div className="flex mt-4 items-center">
                        <p className="text-sm">セキュリティコード</p>
                        <input {...register("card.cvc")} className="border border-gray-300 rounded ml-2" />
                      </div>
                    </div>
                  )}
                </label>
              )
            case "paypal":
              return (
                <label className="flex flex-col border-gray-200 w-full rounded-lg border py-4 px-4">
                  <div className="flex">
                    <input type="radio" value="paypal" {...register("selectedPaymentMethod")} />
                    <div className="flex items-center gap-x-3">
                      <div className="text-left">
                        <p className="ml-2 text-sm font-semibold text-black">paypal</p>
                      </div>
                    </div>
                  </div>
                  {isActive(method) && (
                    <div className="flex mt-4 items-center">
                      <p className="text-sm">メールアドレス</p>
                      <input {...register("paypal.email")} className="border border-gray-300 rounded ml-2" />
                    </div>
                  )}
                  {isActive(method) && errors?.paypal?.email?.message && (
                    <p className="mt-2 text-red-500 text-sm">{errors?.paypal?.email?.message}</p>
                  )}
                </label>
              )
          }
        })}
      </div>

      <button type="submit" className="mt-4 border border-blue-500 rounded text-blue-500">
        submit!
      </button>
    </form>
  )
}

export default App
