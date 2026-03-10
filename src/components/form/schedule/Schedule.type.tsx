import { z } from 'zod'

const DigitString = z.string().nonempty("Required").refine((val) => val === '' || /^\d+$/.test(val), 'Must contain digits only')

const DigitStringNoZero = z
    .string()
    .nonempty("Required")
    .refine(
        (val) => val === '' || /^[1-9]+$/.test(val),
        'Must contain digits 1-9 only'
    );

const ScheduleTableSchema = z.array(
    z.object({
        subject_title: z.string().nonempty("Required"),
        academic_weight: DigitString,
        faculty_id: z.string().nonempty("Required"),
        day: z.string().nonempty("Required"),
        time_start: z.string().regex(
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            "Invalid time format (HH:MM)"
        ),
        time_end: z.string().regex(
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            "Invalid time format (HH:MM)"
        ),
    }))

export type ScheduleTableData = z.infer<typeof ScheduleTableSchema>



// Block = year_level + section + array of schedules
export const BlockSchema = z.object({
    year_level: DigitStringNoZero,
    section: z.string().optional(),
    schedules: ScheduleTableSchema,
})

export type BlockValues = z.infer<typeof BlockSchema>

export const BlockDefaultValues: BlockValues = {
    year_level: "1",
    section: "",
    schedules: [
        {
            subject_title: "",
            academic_weight: "",
            faculty_id: "",
            day: "",
            time_start: "",
            time_end: "",
        },
    ],
}

// Schedule form = array of blocks
export const ScheduleSchema = z.object({
    blocks: z.array(BlockSchema),
}).superRefine((data, ctx) => {
    const seen = new Set()

    data.blocks.forEach((b, i) => {
        const key = `${b.year_level}-${b.section}`

        if (seen.has(key)) {
            ctx.addIssue({
                code: "custom",
                message: "Duplicate year level and section",
                path: ["blocks", i, "section"],
            })
            ctx.addIssue({
                code: "custom",
                message: "Duplicate year level and section",
                path: ["blocks", i, "year_level"],
            })
        }

        seen.add(key)
    })
})

export type ScheduleFormValues = z.infer<typeof ScheduleSchema>

export const ScheduleDefaultValues: ScheduleFormValues = {
    blocks: [
        {
            year_level: "1",
            section: "",
            schedules: [
                {
                    subject_title: "",
                    academic_weight: "",
                    faculty_id: "",
                    day: "",
                    time_start: "",
                    time_end: "",
                },
            ],
        },
        {
            year_level: "2",
            section: "",
            schedules: [
                {
                    subject_title: "",
                    academic_weight: "",
                    faculty_id: "",
                    day: "",
                    time_start: "",
                    time_end: "",
                },
            ],
        },
        {
            year_level: "3",
            section: "",
            schedules: [
                {
                    subject_title: "",
                    academic_weight: "",
                    faculty_id: "",
                    day: "",
                    time_start: "",
                    time_end: "",
                },
            ],
        },
        {
            year_level: "4",
            section: "",
            schedules: [
                {
                    subject_title: "",
                    academic_weight: "",
                    faculty_id: "",
                    day: "",
                    time_start: "",
                    time_end: "",
                },
            ],
        }
    ]
}