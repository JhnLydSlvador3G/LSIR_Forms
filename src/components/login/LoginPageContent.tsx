'use client'

import Footer from '../footer'
import ContentSection from '@/components/login/ContentSection'

export default function LoginPageContent() {
  const welcomeContent = {
    title: 'Welcome to the LSIR System Portal',
    paragraphs: [
      'We are pleased to present a dedicated platform designed to support an efficient and organized reporting experience for law schools. This system offers a secure and user-friendly environment where institutions can manage and update essential information with ease.',
      'The Portal is built to simplify reporting tasks, reduce administrative workload, and ensure that submitted data is well-structured and accessible. Through an intuitive interface and streamlined workflows, users can navigate requirements confidently and complete submissions efficiently.',
    ],
  }

  const purposeContent = {
    title: 'Purpose',
    paragraphs: [
      'The Law School Information Reporting (LSIR) System Portal is an initiative of the Project Management and Planning Division (PMPD), through the Knowledge Management and Planning Unit (KMPU), implemented under the directive of the Chairperson of the Legal Education Board pursuant to LEB Memorandum Order No. 6.',
      'The Portal is intended to serve as a centralized, secure, and user-friendly platform that enables law schools to submit and update required institutional data with ease. Its core purpose is to streamline the processes of collecting, validating, and managing information prescribed by regulatory standards, thereby promoting compliance and operational efficiency.',
      'By minimizing manual procedures, reducing reporting errors, and improving data accessibility for both law schools and the Board, the LSIR System Portal is expected to support evidence-based planning, facilitate policy development, and contribute to the continual enhancement of legal education.',
    ],
  }

  return (
    <main className="flex flex-col min-h-screen bg-lebThird">
      <div className="flex flex-col px-10 lg:px-20 gap-15 py-10 grow">
        <ContentSection
          title={welcomeContent.title}
          paragraphs={welcomeContent.paragraphs}
        />
        <ContentSection
          title={purposeContent.title}
          paragraphs={purposeContent.paragraphs}
        />
      </div>

      <Footer />
    </main>
  )
}
