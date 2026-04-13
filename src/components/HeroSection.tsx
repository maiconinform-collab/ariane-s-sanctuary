import { ArrowDown } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const { ref, isVisible } = useScrollAnimation(0);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden" ref={ref}>
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Fisioterapia de alta performance"
          width={1920}
          height={1080}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <p className={`text-gold text-sm tracking-[0.3em] uppercase font-body font-medium transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Dra. Ariane Moreira · CREFITO
          </p>

          <h1 className={`font-heading text-4xl md:text-6xl lg:text-7xl font-semibold leading-tight transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Reabilitação de Elite e{" "}
            <span className="gold-text-gradient">Performance Humana</span>
          </h1>

          <p className={`text-muted-foreground text-lg md:text-xl font-body font-light max-w-xl mx-auto transition-all duration-700 delay-[400ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Fisioterapia Desportiva, Estética & Alta Performance.
            Sua mente e corpo em equilíbrio.
          </p>

          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-[600ms] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            <a
              href="https://wa.me/5575981465876"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-primary text-primary-foreground font-body text-sm font-medium tracking-widest uppercase rounded-xl hover:bg-gold-light hover:gold-glow transition-all duration-300"
            >
              Agende sua Sessão
            </a>
            <a
              href="#servicos"
              className="px-8 py-4 border border-border text-foreground font-body text-sm font-medium tracking-widest uppercase rounded-xl hover:border-gold hover:text-gold transition-colors duration-300"
            >
              Conheça os Serviços
            </a>
          </div>
        </div>
      </div>

      <a href="#servicos" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gold animate-bounce">
        <ArrowDown size={24} />
      </a>
    </section>
  );
};

export default HeroSection;
