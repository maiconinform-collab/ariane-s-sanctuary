import { Activity, Dumbbell, Sparkles, Users } from "lucide-react";

const services = [
  {
    icon: Activity,
    title: "Liberação Miofascial",
    description: "Técnica avançada para alívio de tensões profundas, restaurando a mobilidade e eliminando dores crônicas com precisão.",
  },
  {
    icon: Dumbbell,
    title: "Fisioterapia Desportiva",
    description: "Reabilitação e prevenção de lesões para atletas de alto rendimento, com protocolos personalizados de recuperação.",
  },
  {
    icon: Sparkles,
    title: "Estética de Alta Performance",
    description: "Drenagem linfática, massagem modeladora, eletrolipólise e protocolos estéticos com tecnologia de ponta.",
  },
  {
    icon: Users,
    title: "Atendimento para Atletas",
    description: "Acompanhamento exclusivo para atletas profissionais e amadores, focado em performance e recuperação acelerada.",
  },
];

const ServicesSection = () => {
  return (
    <section id="servicos" className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
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
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group p-8 bg-card border border-border rounded-sm hover:border-gold/40 hover:gold-glow transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <service.icon className="text-gold mb-6" size={32} strokeWidth={1.5} />
              <h3 className="font-heading text-xl font-semibold mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground font-body font-light leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
