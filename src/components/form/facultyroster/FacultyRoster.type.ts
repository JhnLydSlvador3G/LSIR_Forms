import { z } from "zod";

export const genderEnum = z.enum(["Male", "Female", "Other"]);
export const employmentStatusEnum = z.enum(["Regular", "Part-Time"]);
const DigitString = z
    .string()
    .regex(/^\d+$/, { message: "Digits only" })

const YearString = z
    .string()
    .refine((val) => val === "" || /^\d+$/.test(val), {
        message: "Digits only",
    })
    .refine((val) => {
        const yearNum = Number(val)
        return val === "" || yearNum <= new Date().getFullYear()
    }, {
        message: "Year cannot be in the future",
    })


export const facultySchema = z.object({
    lastName: z.string().min(1, { message: "Required" }),
    firstName: z.string().min(1, { message: "Required" }),
    middleName: z.string().max(2, { message: "Initials Only" }).optional(),
    gender: genderEnum,
    rollNumber: z.string().optional(),
    heiEmploymentStatus: employmentStatusEnum,
    yearsTeaching: DigitString,

    highestLawDegree: z.object({
        degree: z.string().optional(),
        grantingHEI: z.string().optional(),
        year: YearString,
    }),

    professionalExperienceYears: DigitString,
});

export const subjectsArraySchema = z
    .array(z.string().min(1, { message: "Subject is required" }))
    .min(1, { message: "At least one subject is required" });

export const relevantExperienceSchema = z
    .array(z.string().min(1, { message: "Cannot be empty" }))
    .optional()

export const facultyRosterSchema = facultySchema.extend({
    subjects: subjectsArraySchema,
    relevantToTeachingLoad: relevantExperienceSchema
});

export type FacultyRosterData = z.infer<typeof facultyRosterSchema>;

export const defaultFacultyValues: FacultyRosterData = {
    lastName: "",
    firstName: "",
    middleName: "",
    gender: "Male", // you can change this default if desired
    rollNumber: "",
    heiEmploymentStatus: "Part-Time",
    yearsTeaching: "0",
    highestLawDegree: {
        degree: "",
        grantingHEI: "",
        year: new Date().getFullYear().toString(),
    },
    professionalExperienceYears: "0",
    relevantToTeachingLoad: [""],

    // start as empty so user must add at least 1 subject
    subjects: [""],
};


export const facultyRosterArraySchema = z
    .array(facultyRosterSchema)
    .min(1, { message: "At least one faculty member is required" });

export type FacultyRosterArrayData = z.infer<
    typeof facultyRosterArraySchema
>;


export const facultyRosterFormSchema = z.object({
    facultyRoster: facultyRosterArraySchema,
});