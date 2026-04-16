import { Star, Quote } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useReviews } from "@/hooks/useReviews";

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { data: reviews } = useReviews(true);

  const displayReviews = reviews && reviews.length > 0 ? reviews : [
    { id: "1", author_name: "Carlos M.", content: "A Dra. Ariane transformou minha recuperação. Voltei a competir em tempo recorde.", rating: 5, is_approved: true, created_at: "" },
    { id: "2", author_name: "Fernanda S.", content: "Os resultados superaram todas as minhas expectativas. Profissional impecável!", rating: 5, is_approved: true, created_at: "" },
    { id: "3", author_name: "Roberto A.", content: "Encontrei na liberação miofascial a solução definitiva. Recomendo de olhos fechados.", rating: 5, is_approved: true, created_at: "" },
  ];

  return (
    <section id="depoimentos" className="py-24 md:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`text-center max-w-2xl mx-auto mb-16 space-y-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-gold text-sm tracking-[0.3em] uppercase font-body font-medium">Feedback</p>
          <h2 className="font-heading text-3xl md:text-5xl font-semibold">O que dizem os Pacientes</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {displayReviews.map((t, index) => (
            <div
              key={t.id}
              className={`p-8 rounded-2xl glass border border-border/50 space-y-4 hover:border-gold/30 hover:gold-glow transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${index * 100 + 200}ms` }}
            >
              <Quote className="text-gold/40" size={32} strokeWidth={1.5} />
              <p className="text-muted-foreground font-body font-light leading-relaxed text-sm italic">"{t.content}"</p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={i < t.rating ? "text-gold fill-gold" : "text-muted-foreground"} size={14} />
                ))}
              </div>
              <div>
                <p className="font-heading text-sm font-semibold">{t.author_name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
