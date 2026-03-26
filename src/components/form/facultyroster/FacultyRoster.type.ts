import { z } from "zod";

// Enums
export const genderEnum = z.enum(["Male", "Female", "Other"]);
export const employmentStatusEnum = z.enum(["Regular", "Part-Time"]);

// Utility schemas
const DigitString = z
    .string()
    .regex(/^\d+$/, { message: "Digits only" });

const YearString = z
    .string()
    .refine((val) => val === "" || /^\d+$/.test(val), {
        message: "Digits only",
    })
    .refine((val) => {
        const yearNum = Number(val);
        return val === "" || yearNum <= new Date().getFullYear();
    }, {
        message: "Year cannot be in the future",
    });

// Single faculty schema
export const facultySchema = z.object({
    id: z.string(),
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

// Arrays and subfields
export const subjectsArraySchema = z
    .array(z.string().min(1, { message: "Subject is required" }))
    .min(1, { message: "At least one subject is required" });

export const relevantExperienceSchema = z
    .array(z.string().min(1, { message: "Experience is required" }))
    .optional();

// Faculty roster schema (includes subjects & relevant experience)
export const facultyRosterSchema = facultySchema.extend({
    subjects: subjectsArraySchema,
    relevantToTeachingLoad: relevantExperienceSchema,
});

// Types
export type FacultyRosterData = z.infer<typeof facultyRosterSchema>;
export const facultyRosterArraySchema = z.array(facultyRosterSchema);


// Default values
// We cast the input to 'any' or just provide the bare minimum 
// so Zod can fill in the rest (including the ID).
export const createDefaultFaculty = (): FacultyRosterData => {
    return {
        // Manually invoke the ID generator here
        id: crypto.randomUUID(),
        lastName: "",
        firstName: "",
        middleName: "",
        gender: "Male",
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
        subjects: [""],
    };
};

// Main form schema
export const facultyRosterFormSchema = z.object({
    facultyRoster: facultyRosterArraySchema,
}).superRefine((data, ctx) => {
    if (data.facultyRoster.length === 0) {
        ctx.addIssue({
            code: 'custom',
            message: "You must add at least one faculty member to the roster.",
            path: ["facultyRoster"],
        });
    }
});
export type FacultyRosterFormValues = z.infer<typeof facultyRosterFormSchema>;

export const defaultFacultyRosterFormValues: FacultyRosterFormValues = {
    facultyRoster: [],
};