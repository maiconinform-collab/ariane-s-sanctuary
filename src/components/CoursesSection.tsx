import { BookOpen, Award, Clock } from "lucide-react";

const CoursesSection = () => {
  return (
    <section id="cursos" className="py-24 md:py-32 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <p className="text-gold text-sm tracking-[0.3em] uppercase font-body font-medium">
            Educação
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-semibold">
            Cursos & Workshops
          </h2>
          <p className="text-muted-foreground font-body font-light">
            Aprenda com quem domina a prática clínica e a alta performance
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 md:p-12 border border-gold/30 rounded-sm gold-glow bg-card">
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 text-xs bg-primary text-primary-foreground font-body tracking-widest uppercase rounded-sm">
                Destaque
              </span>
            </div>

            <div className="space-y-6">
              <BookOpen className="text-gold" size={40} strokeWidth={1.5} />

              <h3 className="font-heading text-2xl md:text-3xl font-semibold">
                Workshop de Liberação Miofascial
              </h3>

              <p className="text-muted-foreground font-body font-light leading-relaxed max-w-2xl">
                Curso intensivo voltado para profissionais da saúde que desejam dominar técnicas avançadas de liberação miofascial. 
                Conteúdo teórico-prático com abordagem integrativa e protocolos exclusivos.
              </p>

              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground font-body">
                <div className="flex items-center gap-2">
                  <Clock className="text-gold" size={16} strokeWidth={1.5} />
                  <span>16 horas de conteúdo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="text-gold" size={16} strokeWidth={1.5} />
                  <span>Certificado incluso</span>
                </div>
              </div>

              <a
                href="https://wa.me/5575981465876?text=Olá! Gostaria de saber mais sobre o Workshop de Liberação Miofascial."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 bg-primary text-primary-foreground font-body text-sm font-medium tracking-widest uppercase rounded-sm hover:bg-gold-light transition-colors duration-300"
              >
                Quero Participar
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
