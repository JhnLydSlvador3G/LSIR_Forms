import { useEffect } from 'react'
import { useLayoutEffect } from 'react';
import { useAppForm } from "@/hooks/form-context";
import { FormWrapper } from "../FormWrapper";
import {
    FacultyDefaultValues,
    FacultyProfileSchema,
    FacultyProfileDraftSchema,
} from './FacultyProfile.type'
import SaveButton from "@/components/ui/form/SaveButton";
import ResetButton from "@/components/ui/form/ResetButton";
import SubscribeButton from "@/components/ui/form/SubscribeButton";
import FacultyProfileTableForm from "./FacultyProfileTable"
import { loadFormFromLocal } from "@/lib/formLocalStorage";
import FormErrorOnChange from '@/components/ui/form/FormErrorOnChange';

const defaultValues = {
    faculty: FacultyDefaultValues,
};

export default function FacultyProfile() {
    const form = useAppForm({
        defaultValues,
        validators: {
            onChange: FacultyProfileSchema,
        },
        onSubmit: async ({ value }) => {
            console.log(value);
        },
    });

    useEffect(() => {
        const prev = loadFormFromLocal({
            key: 'facultyprofile',
            fallback: defaultValues,
            schema: FacultyProfileSchema,
        });
        form.reset(prev ?? defaultValues);
    }, [form]);

    return (
        <FormWrapper title={"Faculty Profile"} noPadding={false}>
            <form
                className="w-full flex flex-col"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <FacultyProfileTableForm form={form} />
                <form.AppForm>
                    <div className="text-center">
                        <FormErrorOnChange />
                    </div>
                    <div className="flex justify-between mt-5 m-5">
                        <div className="flex flex-row gap-4">
                            <ResetButton defaultVal={defaultValues} />
                            <SaveButton
                                storageKey={"facultyprofile"}
                                getValue={() => form.state.values}
                                schema={FacultyProfileDraftSchema}
                            />
                        </div>
                        <SubscribeButton label="Submit" />
                    </div>
                </form.AppForm>
            </form>
        </FormWrapper>
    );
}