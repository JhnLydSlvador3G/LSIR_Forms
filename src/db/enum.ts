import { pgEnum } from 'drizzle-orm/pg-core'

export const formStatus = pgEnum('form_status', [
  'Draft',
  'Submitted',
  'Approved'
])

export const jurisDoctorDuration = pgEnum('juris_doctor_duration_enum', [
  '4 years',
  '5 years',
  'Both'
])

export const graduateStudiesDuration = pgEnum('graduate_studies_duration_enum', [
  'with Thesis/Dissertation',
  'Non-thesis',
  'Online/Hybrid'
])

export const region = pgEnum('region', [
  'Ilocos Region (Region I)',
  'Cagayan Valley (Region II)',
  'Central Luzon (Region III)',
  'CALABARZON (Region IV-A)',
  'MIMAROPA (Region IV-B)',
  'Bicol Region (Region V)',
  'Western Visayas (Region VI)',
  'Central Visayas (Region VII)',
  'Eastern Visayas (Region VIII)',
  'Zamboanga Peninsula (Region IX)',
  'Northern Mindanao (Region X)',
  'Davao Region (Region XI)',
  'SOCCSKSARGEN (Region XII)',
  'Caraga (Region XIII)',
  'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)',
  'Cordillera Administrative Region (CAR)',
  'National Capital Region (NCR)',
])

export const feeCategory = pgEnum('fee_category', [
  'Other school fees',
  'Miscellaneous fees',
  'New Fee'
])

export const curricularSchedule = pgEnum('curricular_schedule', [
  'Semestral',
  'Trimesteral',
  'Summer',
])

export const programType = pgEnum('program_type', [
  'Bachelor of Laws',
  'Juris Doctor',
  'Master of Laws',
  'DCL/SJD',
  'Refresher Course',
])

export const graduateLawCourseType = pgEnum('graduate_law_course_enum', [
  'Master of Laws',
  'DCL/SJD'
])

export const semester = pgEnum('semester', [
  'First Semester',
  'Second Semester',
  'Third Semester',
])

export const employmentStatus = pgEnum('employment_status', [
  'Regular',
  'Part-time',
])

export const gender = pgEnum('gender', ['Male', 'Female', 'Other'])


export const highestAcademicDegree = pgEnum('highest_academic_degree', [
  'Basic Law Course',
  'Units in Masteral level degree in law',
  'Units in Doctoral level degree in law',
  'Doctoral degree in law',
])

export const BasicyearLevel = pgEnum('year_level', [
  'First Year',
  'Second Year',
  'Third Year',
  'Fourth Year',
  'Fifth Year',
])

export const yearLevel = pgEnum('year_level', [
  'First Year basic law course',
  'Second Year basic law course',
  'Third Year basic law course',
  'Fourth Year basic law course',
  'Fifth Year basic law course',
  'Refresher students',
  'Masteral degree level',
  'Doctoral degree level'
])

export const month = pgEnum('month', [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
])

export const days = pgEnum('days', [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
])

export const ownership = pgEnum('ownership', [
  'Private',
  'Public'
])

export const privateType = pgEnum('private_type', [
  'Sectarian',
  'Non-Sectarian'
])

export const heiType = pgEnum('hei_type', [
  'University',
  'College',
  'Others'
])

export const lawProgramClassification = pgEnum('law_program_classification', [
  'Juris Doctor',
  'Master of Laws',
  'Doctorate'
])

export const doctorateProgramClassification = pgEnum('doctorate_program_classification', [
  'Doctor of Civil Law',
  'Doctor of Juridical Science',
  'Others'
])

export const recognitionStatus = pgEnum('law_school_program_classification', [
  'Government Permit I',
  'Government Permit II',
  'Government Permit III',
  'Government Recognition',
  'Others'
])

export const accreditationClassification = pgEnum('accreditation_classification', [
  'Level I',
  'Level II',
  'Level III',
  'Center of Development',
  'Center of Excellence',
  'Deregulated Status',
  'Autonomous Status'
])

export const basicLawCourse = pgEnum('basic_law_course_enum', [
  'Ladderized Master in Legal Studies - Juris Doctor ',
  'Juris Doctor',
])