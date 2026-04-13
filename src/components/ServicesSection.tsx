import { Activity, Dumbbell, Sparkles, Users, Heart, Shield, Zap, Star } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const iconMap: Record<string, any> = { Activity, Dumbbell, Sparkles, Users, Heart, Shield, Zap, Star };

const ServicesSection = () => {
  const { data: services, isLoading } = useServices();
  const { ref, isVisible } = useScrollAnimation();

  const items = services || [];

  return (
    <section id="servicos" className="py-24 md:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`text-center max-w-2xl mx-auto mb-16 space-y-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-gold text-sm tracking-[0.3em] uppercase font-body font-medium">
            Especialidades
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-semibold">
            Serviços Premium
          </h2>
          <p className="text-muted-foreground font-body font-light">
            Abordagem integrativa com foco em resultados excepcionais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-8 rounded-2xl bg-card/50 border border-border animate-pulse h-48" />
              ))
            : items.map((service, index) => {
                const Icon = iconMap[service.icon_name] || Activity;
                return (
                  <div
                    key={service.id}
                    className={`group p-8 rounded-2xl glass border border-border/50 hover:border-gold/40 hover:gold-glow transition-all duration-500 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${index * 100 + 200}ms` }}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <Icon className="text-gold" size={28} strokeWidth={1.5} />
                    </div>
                    <h3 className="font-heading text-xl font-semibold mb-3">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground font-body font-light leading-relaxed text-sm">
                      {service.description}
                    </p>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
