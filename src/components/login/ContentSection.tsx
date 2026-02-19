interface ContentSectionProps {
  title: string
  paragraphs: Array<string>
}

const ContentSection = ({ title, paragraphs }: ContentSectionProps) => {
  return (
    <section className="flex flex-col gap-5 lg:gap-8 max-w-80%">
      <h1 className="text-leb text-shadow-lg/5 text-[clamp(3.5rem,6vw,4.5rem)] text-center md:text-left font-semibold">
        {title}
      </h1>

      {paragraphs.map((text, index) => (
        <p
          key={index}
          className="text-leb text-[clamp(1rem,3vw,1.375rem)] font-light leading-relaxed"
        >
          {text}
        </p>
      ))}
    </section>
  )
}

export default ContentSection
