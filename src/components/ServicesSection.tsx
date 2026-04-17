import { Activity, Dumbbell, Sparkles, Users, Heart, Shield, Zap, Star, MessageCircle } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const iconMap: Record<string, any> = { Activity, Dumbbell, Sparkles, Users, Heart, Shield, Zap, Star };

const ServicesSection = () => {
  const { data: services, isLoading } = useServices();
  const { data: settings } = useSiteSettings();
  const { ref, isVisible } = useScrollAnimation();

  const items = services || [];
  const whatsapp = settings?.whatsapp || "5575981465876";

  const handleSchedule = (serviceTitle: string) => {
    const message = encodeURIComponent(`Olá! Gostaria de agendar o serviço: ${serviceTitle}`);
    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
  };

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
            Passe o mouse sobre cada card para descobrir mais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-card/50 border border-border animate-pulse h-64" />
              ))
            : items.map((service, index) => {
                const Icon = iconMap[service.icon_name] || Activity;
                return (
                  <div
                    key={service.id}
                    className={`flip-card h-64 transition-all duration-700 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${index * 80 + 200}ms` }}
                  >
                    <div className="flip-card-inner">
                      {/* FRONT */}
                      <div className="flip-card-front glass border border-border/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                          <Icon className="text-gold" size={32} strokeWidth={1.5} />
                        </div>
                        <h3 className="font-heading text-xl font-semibold mb-2">
                          {service.title}
                        </h3>
                        <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">
                          {service.description}
                        </p>
                        <p className="text-gold/60 text-xs mt-4 font-body tracking-widest uppercase">
                          Saiba mais →
                        </p>
                      </div>

                      {/* BACK */}
                      <div className="flip-card-back glass border border-gold/40 gold-glow rounded-2xl p-6 flex flex-col justify-between text-center">
                        <div>
                          <h3 className="font-heading text-lg font-semibold mb-3 text-gold">
                            {service.title}
                          </h3>
                          <p className="text-foreground/90 font-body font-light text-sm leading-relaxed">
                            {service.detailed_text || service.description}
                          </p>
                        </div>
                        <button
                          onClick={() => handleSchedule(service.title)}
                          className="mt-4 inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-gold to-gold/80 text-background font-body font-medium text-sm rounded-xl hover:scale-105 transition-transform"
                        >
                          <MessageCircle size={16} />
                          Agendar via WhatsApp
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
