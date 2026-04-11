import { useScrollReveal } from "@/hooks/useScrollReveal";

const Testimonial = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="bg-muted py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div
          className={`max-w-3xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="w-16 h-1 bg-gold mx-auto rounded-full mb-10" />
          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl text-navy leading-relaxed mb-8 italic">
            "For the first time, my daughter felt what a butterfly looks like. She wouldn't stop smiling."
          </blockquote>
          <p className="font-display font-bold text-muted-foreground">
            — Parent of a 7-year-old OpenDots user
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
