import { heiPersonelDefaulVal } from './HeiPersonel.type'
import { withFieldGroup } from '@/hooks/form-context'

const HeiPersonel = withFieldGroup({
  defaultValues: heiPersonelDefaulVal,
  props: {
    title: 'HEI Personel',
    type: '',
  },

  render({ group, type }) {
    return (
      <fieldset className="flex flex-col gap-2 mb-4">
        <div className="flex flex-row gap-3">
          <group.AppField name="firstName">
            {(field) => (
              <field.TextField
                label="First Name"
                htmlForVal={`${type}.firstName`}
                className="flex-3"
                required
              />
            )}
          </group.AppField>
          <group.AppField name="middleName">
            {(field) => (
              <field.TextField
                label="Middle Name"
                htmlForVal={`${type}.middleName`}
                className="flex-3"
              />
            )}
          </group.AppField>
          <group.AppField name="lastName">
            {(field) => (
              <field.TextField
                label="Last Name"
                htmlForVal={`${type}.lastName`}
                className="flex-3"
                required
              />
            )}
          </group.AppField>
          <group.AppField name="suffix">
            {(field) => (
              <field.TextField
                label="Suffix"
                htmlForVal={`${type}.suffix`}
                className="flex-1"
              />
            )}
          </group.AppField>
        </div>
        <div className="flex flex-row gap-3">
          <group.AppField name="email">
            {(field) => (
              <field.TextField
                label="Email"
                htmlForVal={`${type}.email`}
                className="shrink"
                required
              />
            )}
          </group.AppField>
          <group.AppField name="telNum">
            {(field) => (
              <field.TextField
                label="Mobile Number"
                htmlForVal={`${type}.telNum`}
                required
              />
            )}
          </group.AppField>
        </div>
      </fieldset>
    )
  },
})

export default HeiPersonel
