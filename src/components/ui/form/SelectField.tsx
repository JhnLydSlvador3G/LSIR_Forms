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
  htmlForVal: string
  className?: string
  disabled?: boolean
  required?: boolean
  placeholder?: string
}

export function SelectField({
  label,
  options,
  htmlForVal,
  className,
  disabled = false,
  required = false,
  placeholder = 'Select Value',
}: SelectFieldProps) {
  const field = useFieldContext<string>()
  const hasError = field.state.meta.isTouched && !field.state.meta.isValid
  const value = field.state.value ?? ''
  const selectedLabel = options.find((option) => option.value === value)?.label

  return (
    <div className={cn('flex min-w-0 grow flex-col gap-0', className)}>
      <LabelForm label={label} htmlForVal={htmlForVal} required={required} />
      <Select.Root
        value={value || undefined}
        onValueChange={(nextValue) => {
          field.handleChange(nextValue)
          field.handleBlur()
        }}
        disabled={disabled}
      >
        <Select.Trigger
          id={htmlForVal}
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
          <span className={cn(!selectedLabel && 'text-gray-400')}>
            {selectedLabel ?? placeholder}
          </span>
          <Select.Icon className="text-leb">
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="select-content" position="popper" sideOffset={4}>
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
    </div>
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
