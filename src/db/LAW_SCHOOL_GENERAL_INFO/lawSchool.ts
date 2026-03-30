import { check, date, integer, pgTable, serial, text, varchar, } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import {
    accreditationClassification,
    formStatus,
    recognitionStatus,
    region
} from '../enum'
import { user } from '../accounts'
import { faculty } from '../FACULTY/faculty_roster'
import { program_information } from '../PROGRAM_INFORMATION/program'
import { deanAssignment } from './dean'

export const lawSchool = pgTable('law_school', {
    law_school_id: serial().primaryKey(),
    user_id: text().references(() => user.id).notNull(),
})

export const lawSchool_info = pgTable('law_school_info', {
    law_school_info_id: serial().primaryKey(),
    law_school_id: integer().references(() => lawSchool.law_school_id),
    building: varchar(),
    street: varchar(),
    barangay: varchar(),
    district: varchar(),
    city: varchar(),
    province: varchar(),
    region: region('region'),
    email: varchar(),
    telephone: varchar(),
    accreditation_status: varchar(),
    recognition_status: recognitionStatus(),
    accredication_status: accreditationClassification(),
    created_at: date(),
    form_status: formStatus('form_status').default('Draft'),
},
    (t) => [
        check(
            'hei_id_required_when_not_draft_chk',
            sql`${t.form_status} = 'Draft' OR (${t.law_school_id} IS NOT NULL AND
                ${t.email} IS NOT NULL AND
                ${t.telephone} IS NOT NULL AND
                ${t.recognition_status} IS NOT NULL AND
                ${t.accreditation_status} IS NOT NULL AND
                ${t.building} IS NOT NULL AND
                ${t.street} IS NOT NULL AND
                ${t.barangay} IS NOT NULL AND
                ${t.district} IS NOT NULL AND
                ${t.city} IS NOT NULL AND
                ${t.region} IS NOT NULL AND
                ${t.province} IS NOT NULL)`
        )
    ]
)

export const lawSchool_info_relations = relations(lawSchool_info, ({ one }) => ({
    lawSchool: one(lawSchool, {
        fields: [lawSchool_info.law_school_id],
        references: [lawSchool.law_school_id]
    }),
}));

export const lawSchool_relations = relations(lawSchool, ({ one, many }) => ({
    user: one(user, {
        fields: [lawSchool.user_id],
        references: [user.id]
    }),
    lawSchool_info: many(lawSchool_info),
    deanAssignments: many(deanAssignment),
    faculties: many(faculty),
    programInformations: many(program_information)
}))
