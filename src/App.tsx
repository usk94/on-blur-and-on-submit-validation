import { FormProvider, useForm, useWatch } from "react-hook-form"
import { FormType, PaymentMethodType, schema } from "./validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card } from "./Card"
import { Convini } from "./Convini"
import { Bank } from "./Bank"

const paymentMethods = ["card", "convini", "bank"] as const

const App = () => {
  const formMethods = useForm<FormType>({
    defaultValues: {
      selectedPaymentMethod: undefined,
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
  const selectedPaymentMethod = useWatch({ control: formMethods.control, name: "selectedPaymentMethod" })
  const isActive = (paymentMethod: PaymentMethodType) => paymentMethod === selectedPaymentMethod

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className="flex flex-col w-screen h-screen justify-center items-center"
      >
        <p className="text-xl font-semibold">支払い方法</p>
        <div className="mt-2 flex flex-col gap-y-4 w-80">
          {paymentMethods.map((method) => {
            switch (method) {
              case "card":
                return <Card isActive={isActive(method)} />
              case "convini":
                return <Convini isActive={isActive(method)} />
              case "bank":
                return <Bank />
            }
          })}
        </div>

        <button type="submit" className="mt-4 border border-blue-500 rounded text-blue-500">
          submit!
        </button>
      </form>
    </FormProvider>
  )
}

export default App
