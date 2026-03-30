import Footer from '../Footer'
import ContentSection from './ContentSection'

// Left side content for the signup page
// Different from LoginPageContent to distinguish the two pages
export default function SignUpPageContent() {
  const getStartedContent = {
    title: 'Get Started with LSIR',
    paragraphs: [
      "Create your institution's account to begin submitting and managing your law school's required reports. Registration is quick and straightforward.",
      "Once registered, you will have full access to the LSIR System Portal where you can manage faculty information, student profiles, schedules, and more.",
    ],
  }

  const requirementsContent = {
    title: 'What You Need',
    paragraphs: [
      "To register, please prepare your institution's official email address, HEI name, and the credentials of the authorized representative who will manage submissions.",
      "All submitted data is handled in accordance with the Legal Education Board's data privacy and security standards.",
    ],
  }

  return (
    <main className="flex flex-col min-h-screen bg-lebThird">
      <div className="flex flex-col px-10 lg:px-20 gap-15 py-10 grow">
        <ContentSection
          title={getStartedContent.title}
          paragraphs={getStartedContent.paragraphs}
        />

        <ContentSection
          title={requirementsContent.title}
          paragraphs={requirementsContent.paragraphs}
        />
      </div>
      <Footer />
    </main>
  )
}
