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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-screen h-screen justify-center items-center">
      <p className="text-xl font-semibold">支払い方法</p>

      <p>名前</p>
      <input {...register("paypal.email")} className="border border-gray-300 rounded" />
      {errors?.paypal?.email?.message && <p className="mt-2 text-red-500">{errors?.paypal?.email?.message}</p>}

      <p className="mt-4">性別</p>
      <div className="mt-2 flex flex-row">
        {paymentMethods.map((method) => {
          switch (method) {
            case "card":
              return isActive(method) ? (
                <button type="button" className="w-full rounded-lg border  py-4 px-4 border-gray-200">
                  <label>
                    <input type="radio" value="card" {...register("selectedPaymentMethod")} />
                    <div className="flex items-center gap-x-3">
                      <div className="text-left">
                        <p className="text-sm font-semibold text-black">カード</p>
                      </div>
                      {/* フォーム */}
                    </div>
                  </label>
                </button>
              ) : (
                <button type="button" className="w-full rounded-lg border  py-4 px-4 border-gray-200">
                  <label key={method}>
                    <input type="radio" value={method} {...register("selectedPaymentMethod")} />
                    <div className="flex items-center gap-x-3">
                      <div className="text-left">
                        <p className="text-sm font-semibold text-black">カード</p>
                      </div>
                    </div>
                  </label>
                </button>
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
