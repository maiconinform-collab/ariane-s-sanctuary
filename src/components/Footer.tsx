import { Instagram, Phone, MapPin, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const { data: settings } = useSiteSettings();
  const siteName = settings?.site_name || "Ariane Moreira";
  const whatsapp = settings?.whatsapp || "5575981465876";
  const instagram = settings?.instagram || "@fisio.arimoreira";
  const address = settings?.address || "Salvador, BA";

  const phoneFormatted = whatsapp.replace(/^55(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  const instagramHandle = instagram.startsWith("@") ? instagram : `@${instagram}`;
  const instagramUrl = `https://instagram.com/${instagramHandle.replace("@", "")}`;

  const nameParts = siteName.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  return (
    <footer id="contato" className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-semibold">
              <span className="text-foreground">{firstName}</span>{" "}
              <span className="text-gold">{lastName}</span>
            </h3>
            <p className="text-muted-foreground font-body font-light text-sm leading-relaxed">
              Fisioterapeuta especializada em alta performance, estética e bem-estar integrativo.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-heading text-sm tracking-widest uppercase text-gold">Contato</h4>
            <div className="space-y-3 text-sm text-muted-foreground font-body">
              <a href={`tel:+${whatsapp}`} className="flex items-center gap-3 hover:text-gold transition-colors">
                <Phone size={16} className="text-gold" strokeWidth={1.5} />
                {phoneFormatted}
              </a>
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-gold transition-colors">
                <Instagram size={16} className="text-gold" strokeWidth={1.5} />
                {instagramHandle}
              </a>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gold" strokeWidth={1.5} />
                {address}
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

        <div className="pt-8 border-t border-border text-center space-y-2">
          <p className="text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()} {siteName} — Todos os direitos reservados
          </p>
          <p className="text-[11px] text-muted-foreground/50 font-body tracking-wider">
            Desenvolvido por <span className="text-gold/70 font-medium">Michael Pithon</span>
          </p>
          <div className="pt-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 text-gold/80 hover:text-gold hover:border-gold/60 hover:bg-gold/5 transition-all font-body text-xs tracking-widest uppercase"
            >
              <Lock size={12} strokeWidth={1.5} />
              Área Administrativa
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
