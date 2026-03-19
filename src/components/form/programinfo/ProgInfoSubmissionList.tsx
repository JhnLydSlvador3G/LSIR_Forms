import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { FormWrapper } from '../FormWrapper'
import {
  type ProgramInfoSubmission,
} from './ProgInfo.types'
import { loadProgramInfoSubmissions } from '@/lib/programInfoSubmissions'

const dateTimeFormatter = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const formatProgramType = (value: ProgramInfoSubmission['data']['programType']) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : 'N/A'

export default function ProgInfoSubmissionList() {
  const [submissions, setSubmissions] = useState<ProgramInfoSubmission[]>([])

  useEffect(() => {
    setSubmissions(loadProgramInfoSubmissions())
  }, [])

  return (
    <FormWrapper
      title="Submitted Program Information"
      subtitle="Locally saved submissions from this browser session."
      noPadding
    >
      <div className="flex items-center justify-between px-8 pt-6">
        <p className="text-sm text-gray-600">
          {submissions.length} submission{submissions.length === 1 ? '' : 's'} found
        </p>
        <Link
          to="/programinfo"
          className="rounded-xl bg-leb px-4 py-2 text-sm font-medium text-white transition-all hover:scale-105"
        >
          New submission
        </Link>
      </div>

      {submissions.length === 0 ? (
        <div className="px-8 pb-8 pt-2">
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center text-sm text-gray-600">
            No submitted program information forms yet.
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto px-8 pb-8 pt-2">
          <table className="min-w-full border-collapse overflow-hidden rounded-2xl border border-gray-200 text-sm">
            <thead className="bg-leb text-left text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Submitted</th>
                <th className="px-4 py-3 font-semibold">Program Type</th>
                <th className="px-4 py-3 font-semibold">Permit Number</th>
                <th className="px-4 py-3 font-semibold">Location/Site</th>
                <th className="px-4 py-3 font-semibold">Curricular Schedule</th>
                <th className="px-4 py-3 font-semibold">Duration</th>
                <th className="px-4 py-3 font-semibold">Curricula</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission.id} className="border-t border-gray-200 bg-white align-top">
                  <td className="px-4 py-3 text-gray-700">
                    {dateTimeFormatter.format(new Date(submission.submittedAt))}
                  </td>
                  <td className="px-4 py-3">{formatProgramType(submission.data.programType)}</td>
                  <td className="px-4 py-3">{submission.data.permitNumber}</td>
                  <td className="px-4 py-3">{submission.data.locationSite}</td>
                  <td className="px-4 py-3">{submission.data.curricularSchedule}</td>
                  <td className="px-4 py-3">{submission.data.programDuration}</td>
                  <td className="px-4 py-3">{submission.data.curricula.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </FormWrapper>
  )
}
