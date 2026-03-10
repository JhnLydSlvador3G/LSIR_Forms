import * as Label from '@radix-ui/react-label'

type LabelFormProps = {
  label?: string
  htmlForVal?: string
  required?: boolean
}

const LabelForm = ({ label, htmlForVal, required = false }: LabelFormProps) => (
  <Label.Root
    htmlFor={htmlForVal}
    className="text-[15px] font-medium leading-8.75 text-black whitespace-nowrap"
  >
    {label}
    {required && <span className="text-red-500 ml-1">*</span>}
  </Label.Root>
)

export default LabelForm
