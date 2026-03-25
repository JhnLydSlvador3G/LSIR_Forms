import { Select } from 'radix-ui'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'
import React from 'react'
import FieldInfo from './FieldInfo'
import LabelForm from './LabelForm'
import { useFieldContext } from '@/hooks/useFormContext'
import { cn } from '@/lib/utils'

type SelectFieldProps = {
  label?: string
  options: Array<{ value: string; label: string }>
  htmlForVal?: string
  disabled?: boolean
  required?: boolean
  placeHolder?: string
}

export function SelectField({
  label,
  options,
  htmlForVal,
  disabled = false,
  required = false,
  placeHolder = "Select Value",
}: SelectFieldProps) {
  const field = useFieldContext<string>()
  const hasError = field.state.meta.isTouched && !field.state.meta.isValid
  const value = field.state.value || undefined
  return (
    <label className="flex min-w-0 flex-col gap-0">
      <LabelForm label={label} htmlForVal={htmlForVal} required={required} />
      <Select.Root
        key={value ?? '__empty__'}
        value={value}
        onValueChange={(val) => {
          field.handleChange(val)
          field.handleBlur()
        }}
        onOpenChange={(open) => {
          if (!open) field.handleBlur()
        }}
        disabled={disabled}
      >
        <Select.Trigger
          aria-label={label}
          className={cn(
            'select-trigger',
            'grow',
            disabled && 'no-hover bg-gray-200 text-gray-400',
            hasError
              ? 'border-red-500 ring-2 ring-red-200 focus:ring-red-400'
              : 'border-gray-200 focus:ring-2 focus:ring-leb/40 focus:border-leb',
          )}
        >
          <Select.Value placeholder={placeHolder} />
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
