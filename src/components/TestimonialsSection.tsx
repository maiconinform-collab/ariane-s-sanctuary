import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const testimonials = [
  {
    name: "Carlos M.",
    role: "Atleta Profissional",
    text: "A Dra. Ariane transformou minha recuperação. Voltei a competir em tempo recorde graças ao tratamento personalizado.",
  },
  {
    name: "Fernanda S.",
    role: "Paciente de Estética",
    text: "Os resultados da drenagem linfática e massagem modeladora superaram todas as minhas expectativas. Profissional impecável!",
  },
  {
    name: "Roberto A.",
    role: "Empresário",
    text: "Depois de anos sofrendo com dores crônicas, encontrei na liberação miofascial a solução definitiva. Recomendo de olhos fechados.",
  },
];

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="depoimentos" className="py-24 md:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`text-center max-w-2xl mx-auto mb-16 space-y-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-gold text-sm tracking-[0.3em] uppercase font-body font-medium">
            Feedback
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-semibold">
            O que dizem os Pacientes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, index) => (
            <div
              key={t.name}
              className={`p-8 rounded-2xl glass border border-border/50 space-y-4 hover:border-gold/30 hover:gold-glow transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <Quote className="text-gold/40" size={32} strokeWidth={1.5} />
              <p className="text-muted-foreground font-body font-light leading-relaxed text-sm italic">
                "{t.text}"
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-gold fill-gold" size={14} />
                ))}
              </div>
              <div>
                <p className="font-heading text-sm font-semibold">{t.name}</p>
                <p className="text-muted-foreground text-xs font-body">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
