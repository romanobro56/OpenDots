import { useScrollReveal } from "@/hooks/useScrollReveal";

const stats = [
  {
    number: "10%",
    text: "of blind children are learning braille today — down from 50% a generation ago.",
    context: "An entire generation of children is growing up without the literacy skills that define independence.",
  },
  {
    number: "90%",
    text: "of employed blind adults are braille literate. Learning early changes everything.",
    context: "The research is clear: early braille literacy is the single greatest predictor of future employment.",
  },
  {
    number: "$15,000",
    text: "is what existing tactile devices cost — and none of them were built for children.",
    context: "The technology exists. It's just locked behind price tags that no family or school can afford.",
  },
];

const CrisisStats = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="bg-navy py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid-bg opacity-30" />
      <div className="container relative z-10 mx-auto px-6">
        <div className="space-y-20 lg:space-y-28">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${i * 300}ms` }}
            >
              <p className="font-display font-black text-6xl sm:text-7xl lg:text-8xl text-gold mb-4">
                {stat.number}
              </p>
              <p className="font-display font-bold text-xl sm:text-2xl text-cream/90 mb-4">
                {stat.text}
              </p>
              <p className="text-cream/60 text-lg max-w-xl mx-auto">
                {stat.context}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`mt-24 text-center transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="font-display font-extrabold text-2xl sm:text-3xl text-gold">
            OpenDots was built to change all three of these numbers.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CrisisStats;
