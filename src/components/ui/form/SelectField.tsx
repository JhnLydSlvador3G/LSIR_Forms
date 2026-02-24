import { Select } from 'radix-ui'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import React from 'react'
import FieldInfo from './FieldInfo'
import LabelForm from './LabelForm'
import { useFieldContext } from '@/hooks/form-context'
import { cn } from '@/lib/utils'

type SelectFieldProps = {
  label: string
  options: Array<{ value: string; label: string }>
  htmlForVal: string
  disabled?: boolean
  required?: boolean
}

export function SelectField({
  label,
  options,
  htmlForVal,
  disabled = false,
  required = false,
}: SelectFieldProps) {
  const field = useFieldContext<string>()
  return (
    <label className="flex flex-col gap-0">
      <LabelForm label={label} htmlForVal={htmlForVal} required={required} />
      <Select.Root
        value={field.state.value}
        onValueChange={field.handleChange}
        disabled={disabled}
      >
        <Select.Trigger
          aria-label="label"
          className={cn(
            'select-trigger',
            disabled && 'no-hover bg-gray-200 text-gray-400',
          )}
        >
          <Select.Value placeholder="Select Value" />
          <Select.Icon className="text-leb">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="select-content">
            <Select.ScrollUpButton className="select-scroll-button">
              <ChevronUpIcon />
            </Select.ScrollUpButton>

            <Select.Viewport className="select-viewport">
              <Select.Group>
                {options.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="select-label"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </Select.Group>
            </Select.Viewport>

            <Select.ScrollDownButton>
              <ChevronDownIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      <FieldInfo field={field} />
    </label>
  )
}

type SelectItemProps = React.ComponentPropsWithRef<typeof Select.Item>
// forwardRef will be deprecated in future React versions so maintance is required.
const SelectItem = React.forwardRef<
  React.ComponentRef<typeof Select.Item>,
  SelectItemProps
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item
      className={cn('select-item', className)}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="select-item-indicator">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  )
})
