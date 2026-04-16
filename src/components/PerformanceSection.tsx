import { Trophy, GraduationCap, Users, Dumbbell, CalendarDays, MapPin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const highlights = [
  { icon: Dumbbell, label: "Fisiculturismo", desc: "Atendimento especializado a atletas de alto rendimento" },
  { icon: Trophy, label: "Alta Performance", desc: "Protocolos exclusivos para competidores profissionais" },
  { icon: GraduationCap, label: "Professora", desc: "Formação de novos profissionais em cursos e workshops" },
  { icon: Users, label: "Mentoria", desc: "Orientação personalizada para fisioterapeutas" },
];

const workshops = [
  { title: "Liberação Miofascial Avançada", date: "Em breve", location: "Salvador, BA" },
  { title: "Fisioterapia Esportiva para Atletas", date: "Em breve", location: "Salvador, BA" },
];

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop", alt: "Atendimento atleta" },
  { src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop", alt: "Performance esportiva" },
  { src: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=600&h=400&fit=crop", alt: "Workshop fisioterapia" },
  { src: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop", alt: "Treinamento de elite" },
];

const PerformanceSection = () => {
  const { ref, isVisible } = useScrollAnimation();
  const { data: settings } = useSiteSettings();
  const whatsapp = settings?.whatsapp || "5575981465876";

  return (
    <section id="performance" className="py-24 md:py-32 relative overflow-hidden" ref={ref}>
      {/* Subtle gold accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px gold-gradient" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className={`text-center max-w-3xl mx-auto mb-20 space-y-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-gold text-sm tracking-[0.3em] uppercase font-body font-medium">Excelência</p>
          <h2 className="font-heading text-3xl md:text-5xl font-semibold">Performance de Elite</h2>
          <p className="text-muted-foreground font-body font-light leading-relaxed">
            Referência no atendimento a atletas de fisiculturismo e na formação de profissionais
            através de cursos e workshops especializados.
          </p>
        </div>

        {/* Authority highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
          {highlights.map((item, i) => (
            <div
              key={item.label}
              className={`text-center p-6 rounded-2xl glass border border-border/50 hover:border-gold/30 hover:gold-glow transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 100 + 200}ms` }}
            >
              <item.icon className="mx-auto mb-3 text-gold" size={28} strokeWidth={1.5} />
              <h3 className="font-heading text-sm md:text-base font-semibold mb-1">{item.label}</h3>
              <p className="text-muted-foreground text-xs font-body font-light leading-relaxed hidden md:block">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Gallery grid */}
        <div className={`mb-20 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h3 className="font-heading text-xl md:text-2xl font-semibold text-center mb-8">Em Ação</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {galleryImages.map((img, i) => (
              <div key={i} className="relative group overflow-hidden rounded-2xl aspect-[4/3] border border-border/30">
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <p className="absolute bottom-3 left-3 text-xs font-body text-foreground/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500">{img.alt}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming workshops */}
        <div className={`max-w-2xl mx-auto transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h3 className="font-heading text-xl md:text-2xl font-semibold text-center mb-8">Próximos Workshops</h3>
          <div className="space-y-4">
            {workshops.map((w, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl glass border border-border/50 hover:border-gold/30 transition-all duration-300 gap-4"
              >
                <div className="space-y-1">
                  <h4 className="font-heading text-base font-semibold">{w.title}</h4>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground font-body">
                    <span className="flex items-center gap-1.5"><CalendarDays size={13} className="text-gold" /> {w.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={13} className="text-gold" /> {w.location}</span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/${whatsapp}?text=Olá! Gostaria de saber mais sobre o workshop "${w.title}".`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 text-xs tracking-wider uppercase font-medium border border-gold/50 text-gold rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-300 whitespace-nowrap"
                >
                  Quero participar
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Instagram CTA */}
        <div className={`text-center mt-16 transition-all duration-700 delay-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-muted-foreground text-sm font-body mb-4">Acompanhe o trabalho da Ariane nas redes</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://www.instagram.com/fisio.arimoreira/" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors text-sm font-body tracking-wider">
              @fisio.arimoreira
            </a>
            <span className="hidden sm:inline text-border">|</span>
            <a href="https://www.instagram.com/arimoreiraespacointegrativo/" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light transition-colors text-sm font-body tracking-wider">
              @arimoreiraespacointegrativo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;
