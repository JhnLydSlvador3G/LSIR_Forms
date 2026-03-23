import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { TextField } from '@/components/ui/form/TextField'
import { PasswordField } from '@/components/ui/form/PasswordField'
import SubscribeButton from '@/components/ui/form/SubscribeButton'
import FormErrorMessage from '@/components/ui/form/FormErrorMessage'
import { SelectField } from '@/components/ui/form/SelectField'
import { NumberField } from '@/components/ui/form/NumberField'
import { DateField } from '@/components/ui/form/DateField'
import { TextAreaField } from '@/components/ui/form/TextAreaField'
import { LabeledNumberField } from '@/components/ui/form/LabeledNumberField'
import { CheckboxGroupField } from '@/components/ui/form/CheckboxGroupField'
import { RadioGroupField } from '@/components/ui/form/RadioGroupField'
import { ComboboxField } from '@/components/ui/form/ComboboxField'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    PasswordField,
    SelectField,
    ComboboxField,
    RadioGroupField,
    CheckboxGroupField,
    NumberField,
    DateField,
    TextAreaField,
    LabeledNumberField,
  },
  formComponents: {
    SubscribeButton,
    FormErrorMessage,
  },
})
