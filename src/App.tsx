import { useForm, useWatch } from "react-hook-form"
import { FormType, PaymentMethodType, currentYear, schema } from "./validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { ErrorMessage } from "@hookform/error-message"

const paymentMethods = ["card", "convini", "bank"] as const

const covniniOptions = [
  { value: "familyMart", label: "ファミリーマート" },
  { value: "sevenEleven", label: "セブンイレブン" },
  { value: "lawson", label: "ローソン" },
]

const monthOptions = [...Array(12)].map((_, index) => ({
  value: `0${index + 1}`.slice(-2),
  label: `0${index + 1}`.slice(-2),
}))

const yearOptions = [...Array(10)].map((_, index) => ({
  value: String(currentYear + index),
  label: String(currentYear + index),
}))

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
        cvc: "",
      },
      convini: {
        conviniName: undefined,
      },
    },
    mode: "onBlur",
    resolver: zodResolver(schema),
    shouldFocusError: false,
  })

  const onSubmit = (data: FormType) => console.log(data)
  const selectedPaymentMethod = useWatch({ control, name: "selectedPaymentMethod" })
  const isActive = (paymentMethod: PaymentMethodType) => paymentMethod === selectedPaymentMethod

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-screen h-screen justify-center items-center">
      <p className="text-xl font-semibold">支払い方法</p>
      <div className="mt-2 flex flex-col gap-y-4 w-80">
        {paymentMethods.map((method) => {
          switch (method) {
            case "card":
              return (
                <label className="flex w-full rounded-lg border py-4 px-4 border-gray-200 gap-y-4">
                  <input type="radio" value="card" {...register("selectedPaymentMethod")} />
                  <div className="ml-4 flex-grow">
                    <p className="text-sm font-semibold text-black">カード</p>
                    {isActive(method) && (
                      <>
                        <div className="pb-3 mt-3 border-t border-gray" />
                        <div className="flex flex-col gap-y-3">
                          <div className="flex flex-col gap-y-2">
                            <p className="text-sm">カード番号</p>
                            <input {...register("card.number")} className="border border-gray-300 rounded" />
                            <ErrorMessage
                              errors={errors}
                              name="card.number"
                              render={({ message }) => <p className="text-red-500 text-xs">{message}</p>}
                            />
                          </div>
                          <div className="flex flex-col gap-y-2">
                            <p className="text-sm">氏名</p>
                            <input {...register("card.name")} className="border border-gray-300 rounded" />
                            <ErrorMessage
                              errors={errors}
                              name="card.name"
                              render={({ message }) => <p className="text-red-500 text-xs">{message}</p>}
                            />
                          </div>
                          <div className="flex flex-col gap-y-2">
                            <p className="text-sm">有効期限</p>
                            <div className="flex gap-x-2">
                              <select
                                {...register("card.expiryYear")}
                                defaultValue="年"
                                autoComplete="cc-exp-year"
                                className="w-1/2 border rounded border-gray-300"
                              >
                                <option key="default" value="">
                                  年
                                </option>
                                {yearOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                              <select
                                {...register("card.expiryMonth")}
                                defaultValue="month"
                                autoComplete="cc-exp-month"
                                className="w-1/2 border rounded border-gray-300"
                              >
                                <option key="default" value="">
                                  月
                                </option>
                                {monthOptions.map((option) => (
                                  <option key={option.value} value={option.value}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            {(errors.card?.expiryYear || errors.card?.expiryMonth) && (
                              <p className="text-red-500 text-xs">{errors.card?.expiryYear?.message}</p>
                            )}
                          </div>
                          <div className="flex flex-col gap-y-2">
                            <p className="text-sm">セキュリティコード</p>
                            <input {...register("card.cvc")} className="border border-gray-300 rounded" />
                            <ErrorMessage
                              errors={errors}
                              name="card.cvc"
                              render={({ message }) => <p className="text-red-500 text-xs">{message}</p>}
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </label>
              )
            case "convini":
              return (
                <label className="flex border-gray-200 w-full rounded-lg border py-4 px-4">
                  <input type="radio" value="convini" {...register("selectedPaymentMethod")} />
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-black">コンビニ決済</p>
                    {isActive(method) && (
                      <div className="flex mt-4 items-center">
                        <select {...register("convini.conviniName")} className="border border-gray-300 rounded">
                          <option key="default" value="">
                            選択してください
                          </option>
                          {covniniOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    {isActive(method) && errors?.convini?.conviniName?.message && (
                      <p className="mt-2 text-red-500 text-sm">{errors?.convini?.conviniName?.message}</p>
                    )}
                  </div>
                </label>
              )
            case "bank":
              return (
                <label className="flex flex-col border-gray-200 w-full rounded-lg border py-4 px-4">
                  <div className="flex">
                    <input type="radio" value="bank" {...register("selectedPaymentMethod")} />
                    <div className="flex items-center gap-x-3">
                      <div className="text-left">
                        <p className="ml-4 text-sm font-semibold text-black">銀行振込</p>
                      </div>
                    </div>
                  </div>
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
