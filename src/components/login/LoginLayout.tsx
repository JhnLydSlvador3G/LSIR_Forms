import LoginHeader from './LoginHeader'

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-lebSecond flex flex-col min-h-screen items-center sm:p-10 justify-center ">
      {/* Logos + Title */}
      <LoginHeader />
      <div className="flex flex-col items-center gap-4 w-full max-w-md sm:max-w-2xl px-4 py-8 shrink-0">
        {children}
      </div>
    </div>
  )
}
