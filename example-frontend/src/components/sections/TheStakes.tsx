import { useScrollReveal } from "@/hooks/useScrollReveal";

const TheStakes = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="bg-cream py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <p className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-navy leading-relaxed mb-8">
            The unemployment rate for blind adults is nearly{" "}
            <span className="text-coral">70%</span>. For those who learned braille as children, it drops to{" "}
            <span className="text-teal">44%</span>.
          </p>
          <p className="font-display font-bold text-xl sm:text-2xl text-navy/70 mb-8">
            Early tactile literacy isn't a nice-to-have.{" "}
            <span className="text-navy">It's a life trajectory.</span>
          </p>
          <div className="w-24 h-1 bg-gold mx-auto rounded-full mb-8" />
          <p className="font-display font-extrabold text-xl text-gold">
            That's why we built OpenDots.
          </p>
        </div>
      </div>
    </section>
  );
};

export default TheStakes;
