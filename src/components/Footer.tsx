import { Instagram, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contato" className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-semibold">
              <span className="text-foreground">Ariane</span>{" "}
              <span className="text-gold">Moreira</span>
            </h3>
            <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">
              Fisioterapeuta especializada em alta performance, estética e bem-estar integrativo.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading text-sm tracking-widest uppercase text-gold">Contato</h4>
            <div className="space-y-3 text-sm text-muted-foreground font-body">
              <a href="tel:+5575981465876" className="flex items-center gap-3 hover:text-gold transition-colors">
                <Phone size={16} className="text-gold" strokeWidth={1.5} />
                (75) 98146-5876
              </a>
              <a href="https://instagram.com/fisio.arimoreira" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-gold transition-colors">
                <Instagram size={16} className="text-gold" strokeWidth={1.5} />
                @fisio.arimoreira
              </a>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gold" strokeWidth={1.5} />
                Feira de Santana, BA
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading text-sm tracking-widest uppercase text-gold">Horário</h4>
            <div className="space-y-2 text-sm text-muted-foreground font-body">
              <p>Segunda a Sexta: 8h — 18h</p>
              <p>Sábado: 8h — 12h</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center">
          <p className="text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()} Ariane Moreira — Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
