interface ContentSectionProps {
  title: string
  paragraphs: Array<string>
}

const ContentSection = ({ title, paragraphs }: ContentSectionProps) => {
  return (
    <section className="flex flex-col gap-4 lg:gap-6 max-w-80%">
      <h1 className="text-leb text-[clamp(2.5rem,5vw,3.5rem)] text-center md:text-left font-bold border-b border-leb/20 pb-3">
        {title}
      </h1>

      {paragraphs.map((text, index) => (
        <p
          key={index}
          className="text-leb/80 text-[clamp(0.9rem,2.5vw,1.2rem)] font-normal leading-relaxed"
        >
          {text}
        </p>
      ))}
    </section>
  )
}

export default ContentSection
