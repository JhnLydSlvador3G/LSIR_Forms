import { useFormContext } from '@/hooks/form-context'

export default function FormErrorOnChange() {
    const form = useFormContext()

    return (
        <form.Subscribe
            selector={(state) => ({
                isValid: state.isValid,
                errors: state.errorMap.onChange,
            })}
        >
            {(state) => {
                const messages =
                    Object.values(state.errors ?? {})
                        .flat()
                        .map((err: any) => err?.message)
                        .filter(Boolean) ?? []

                if (messages.length === 0) return null

                return (
                    <div className="text-red-500 text-sm mt-2">
                        <em>{messages[0]}</em>
                    </div>
                )
            }}
        </form.Subscribe>
    )
}