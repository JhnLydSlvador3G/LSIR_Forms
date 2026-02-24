import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { TextField } from '@/components/ui/form/TextField'
import { PasswordField } from '@/components/ui/form/PasswordField'
import SubscribeButton from '@/components/ui/form/SubscribeButton'
import FormErrorMessage from '@/components/ui/form/FormErrorMessage'
import { SelectField } from '@/components/ui/form/SelectField'

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm, withForm, withFieldGroup } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    PasswordField,
    SelectField,
  },
  formComponents: {
    SubscribeButton,
    FormErrorMessage,
  },
})
