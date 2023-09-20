import { useForm } from "react-hook-form"
import { FormType, schema } from "./validator"
import { zodResolver } from "@hookform/resolvers/zod"

const radioOptions = [
  { label: "男", value: "male" },
  { label: "女", value: "female" },
  { label: "その他", value: "neither" },
]

const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    defaultValues: {
      name: "",
      gender: "",
      email: "",
    },
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormType) => console.log(data)

  return (
    <div className="w-screen h-screen">
      <div className="flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <p>名前</p>
          <input {...register("name")} />
          {errors.name?.message && <p className="text-red-500">{errors.name?.message}</p>}

          <p>性別</p>
          <div className="flex flex-row">
            {radioOptions.map((option) => {
              const { label, value } = option
              return (
                <label key={value}>
                  <input type="radio" value={value} {...register("gender")} />
                  {label}
                </label>
              )
            })}
          </div>
          {errors.gender?.message && <p className="text-red-500">{errors.gender?.message}</p>}

          <p>メールアドレス</p>
          <input {...register("email")} />
          {errors.email?.message && <p className="text-red-500">{errors.email?.message}</p>}

          <button type="submit">submit!</button>
        </form>
      </div>
    </div>
  )
}

export default App
