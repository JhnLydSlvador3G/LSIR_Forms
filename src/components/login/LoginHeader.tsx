export default function LoginHeader() {
  return (
    <>
      <div className="flex flex-row justify-center gap-4 items-center mb-2 sm:mb-4">
        <a href="https://leb.gov.ph/">
          <img
            src="/leb-logo.png"
            alt="LEB Logo"
            className="h-20 sm:h-24 object-contain"
          />
        </a>
        <a href="https://www.bagongpilipinastayo.com/">
          <img
            src="/bagong-pilipinas.png"
            alt="Bagong Pilipinas Logo"
            className="h-20 sm:h-24 object-contain"
          />
        </a>
      </div>
      <h2 className="text-8xl sm:text-[10rem] font-bold text-leb tracking-widest leading-none text-center text-shadow-lg/5 ">
        LSIR
      </h2>
    </>
  )
}