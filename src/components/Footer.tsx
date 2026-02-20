import { cn } from '@/lib/utils'

export default function Footer({ classNameProp }: { classNameProp?: string }) {
  return (
    <footer
      className={cn(
        'text-[0.5rem] lg:text-sm text-white bg-[#937bd0] w-full px-6 py-1 bottom-0',
        classNameProp,
      )}
    >
      <div className="flex flex-row gap-2 px-3 items-center justify-center lg:justify-start">
        <a href="https://leb.gov.ph/" className="flex items-center gap-2">
          <img
            src="/leb-logo-white.png"
            alt="White LEB Logo"
            className="h-12"
          />
          <p className="tracking-widest font-semibold">Legal Education Board</p>
        </a>
        <div className="w-px h-10 bg-white/80 mx-1"></div>
        <a
          href="https://drive.google.com/file/d/1U1CP904VBoFqhhUDWgj4c0XN9HgPSBms/view"
          className="text-white/60 tracking-[0.085rem]"
        >
          Data Privacy Notice
        </a>
      </div>
    </footer>
  )
}
