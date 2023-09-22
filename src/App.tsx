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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-screen h-screen justify-center items-center">
      <p>名前</p>
      <input {...register("name")} className="border border-gray-300 rounded" />
      {errors.name?.message && <p className="mt-2 text-red-500">{errors.name?.message}</p>}

      <p className="mt-4">性別</p>
      <div className="mt-2 flex flex-row">
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
      {errors.gender?.message && <p className="mt-2 text-red-500">{errors.gender?.message}</p>}

      <p className="mt-4">メールアドレス</p>
      <input {...register("email")} className="mt-2 border border-gray-300 rounded" />
      {errors.email?.message && <p className="mt-2 text-red-500">{errors.email?.message}</p>}

      <button type="submit" className="mt-4 border border-blue-500 rounded text-blue-500">
        submit!
      </button>
    </form>
  )
}

export default App
