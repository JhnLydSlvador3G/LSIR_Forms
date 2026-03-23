import { boolean, check, decimal, index, integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core'
import { relations, sql } from 'drizzle-orm'
import { feeCategory,formStatus, programType,yearLevel } from '../../enum'
import {program_information} from '@/db/PROGRAM_INFORMATION/program'

export const financial_report = pgTable('financial_report', {
    financial_report_id: serial().primaryKey(),
    program_information_id: integer().references(() => program_information.program_information_id, { onDelete: 'cascade' }).notNull().unique(),
    last_fee_increase_sy: decimal({ precision: 10, scale: 2 }),
    course: programType(),
    form_status: formStatus('form_status').default('Draft'),
},
    (t) => [
        check('financial_report_info_required_when_not_draft_chk',
            sql`${t.form_status} = 'Draft' OR (${t.last_fee_increase_sy} IS NOT NULL AND
                ${t.course} IS NOT NULL)`
        ),
        index('financial_report_submission_id_idx').on(t.program_information_id),
    ]
)

export const year_level_report = pgTable('year_level_report', {
    year_level_report_id: serial().primaryKey(),
    financial_report_id: integer().references(() => financial_report.financial_report_id, { onDelete: 'cascade' }).notNull(),
    year_level: yearLevel(),
    tuition_per_unit: decimal({ precision: 10, scale: 2 }),
    is_draft: boolean().default(true),
},
    (t) => [check('year_level_report_info_required_when_not_draft_chk',
            sql`${t.is_draft} = true OR (${t.year_level} IS NOT NULL AND
                ${t.tuition_per_unit} IS NOT NULL)`
        ),
    ]
)

export const fees = pgTable('fees', {
    fees_id: serial().primaryKey(),
    year_level_report_id: integer().references(() => year_level_report.year_level_report_id, { onDelete: 'cascade' }).notNull(),
    fee_description: varchar(),
    fee_amount: decimal({ precision: 10, scale: 2 }),
    category: feeCategory(),
    is_draft: boolean().default(true),
},
    (t) => [check('fees_info_required_when_not_draft_chk',
            sql`${t.is_draft} = true OR (${t.fee_description} IS NOT NULL AND
                ${t.fee_amount} IS NOT NULL AND
                ${t.category} IS NOT NULL)`
        ),
    ]
)  

export const financial_report_relations = relations(financial_report, ({ one, many }) => ({
    program_information: one(program_information, {
        fields: [financial_report.program_information_id],
        references: [program_information.submission_id],
    }),
    yearLevelReports: many(year_level_report),
    fees: many(fees),
}))

export const year_level_report_relations = relations(year_level_report, ({ one, many }) => ({
    financialReport: one(financial_report, {
        fields: [year_level_report.financial_report_id],
        references: [financial_report.financial_report_id],
    }),
    fees: many(fees)
}))

export const fees_relations = relations(fees, ({ one }) => ({
    yearLevelReport: one(year_level_report, {
        fields: [fees.year_level_report_id],
        references: [year_level_report.year_level_report_id],
    }),
}))
