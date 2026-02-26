import { useEffect } from 'react'
import { useAppForm } from "@/hooks/form-context";
import { FormWrapper } from "../FormWrapper";
import {
    StudentDefaultValues,
    StudentProfileSchema,
    StudentProfileDraftSchema,
} from "./StudentProfile.types";

import SaveButton from "@/components/ui/form/SaveButton";
import ResetButton from "@/components/ui/form/ResetButton";
import SubscribeButton from "@/components/ui/form/SubscribeButton";

import StudentProfileTableForm from "./StudentTable";
import FormErrorOnChange from "@/components/ui/form/FormErrorOnChange";
import { loadFormFromLocal } from "@/lib/formLocalStorage";

const defaultValues = {
    profiles: StudentDefaultValues,
}

export default function StudentProfile() {

    const form = useAppForm({
        defaultValues,
        validators: {
            onChange: StudentProfileSchema,
        },
        onSubmit: async ({ value }) => {
            console.log(value)
        },
    });

    useEffect(() => {
        const prev = loadFormFromLocal({
            key: 'studentprofile',
            fallback: defaultValues,
            schema: StudentProfileSchema,
        });
        form.reset(prev ?? defaultValues);
    }, [form]);

    return (
        <FormWrapper title={"Students' Profile"} noPadding={true}>
            <form
                className="w-full flex flex-col"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
                <StudentProfileTableForm form={form} />
                <form.AppForm>
                    <div className="text-center">
                        <FormErrorOnChange />
                    </div>

                    <div className="flex justify-between mt-5 m-5">
                        <div className="flex flex-row gap-4">
                            <ResetButton
                                defaultVal={defaultValues}
                            />

                            <SaveButton storageKey={"studentprofile"} getValue={() => form.state.values} schema={StudentProfileDraftSchema} />
                        </div>

                        <SubscribeButton label="Submit" />
                    </div>
                </form.AppForm>
            </form>
        </FormWrapper>
    );
}