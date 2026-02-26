import { useFormContext } from '@/hooks/form-context'

export default function FormErrorMessage() {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
      {(errors) => {
        return (
          <div className="text-red-500">
            {errors && errors.length > 0 ? <em>{errors}</em> : ''}
          </div>
        )
      }}
    </form.Subscribe>
  )
}
