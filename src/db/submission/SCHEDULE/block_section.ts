import { check, index, integer, pgTable, serial, time, varchar} from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { days, formStatus } from '../../enum'
import { faculty } from '../../FACULTY/faculty_roster'
import {program_information} from '@/db/PROGRAM_INFORMATION/program'


export const block_section = pgTable('block_section', {
    block_section_id: serial().primaryKey(),
    program_information_id: integer().references(() => program_information.program_information_id, {onDelete: 'cascade'}).notNull(),
    year_level: integer(),
    section: varchar()
},
    (t) => [
        index('block_section_submission_id_idx').on(t.program_information_id),
    ]
);

export const class_schedule = pgTable('class_schedule', {
    class_schedule_id: serial().primaryKey(),
    block_section_id: integer().references(() => block_section.block_section_id, {onDelete: 'cascade'}),
    faculty_name: varchar(),
    faculty_id: integer().references(() => faculty.faculty_id),
    subject_title: varchar(),
    day: days(),
    time_start: time(),
    time_end: time(),
    form_status: formStatus('form_status').default('Draft'),
},
    (t) => [
        check(
            'class_schedule_required_when_not_draft_chk',
            sql`${t.form_status} = 'Draft' OR (
                ${t.faculty_name} IS NOT NULL AND
                ${t.faculty_id} IS NOT NULL AND
                ${t.subject_title} IS NOT NULL AND
                ${t.day} IS NOT NULL AND
                ${t.time_start} IS NOT NULL AND
                ${t.time_end} IS NOT NULL)`
        ),
    ]
);

export const block_section_relations = relations(block_section, ({ one, many }) => ({
    program_information: one(program_information, {
        fields: [block_section.program_information_id],
        references: [program_information.program_information_id],
    }),
    classSchedules: many(class_schedule),
}))

export const class_schedule_relations = relations(class_schedule, ({ one }) => ({
    blockSection: one(block_section, {
        fields: [class_schedule.block_section_id],
        references: [block_section.block_section_id],
    }),
    faculty: one(faculty, {
        fields: [class_schedule.faculty_id],
        references: [faculty.faculty_id],
    }),
}))

