import { useState, useEffect } from "react";
import { Menu, X, Calendar } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Início", href: "#hero" },
    { label: "Serviços", href: "#servicos" },
    { label: "Cursos", href: "#cursos" },
    { label: "Depoimentos", href: "#depoimentos" },
    { label: "Contato", href: "#contato" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="#hero" className="font-heading text-xl font-semibold tracking-wide">
          <span className="text-foreground">Ariane</span>{" "}
          <span className="text-gold">Moreira</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-body text-muted-foreground hover:text-gold transition-colors duration-300 tracking-wider uppercase"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://wa.me/5575981465876"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-sm hover:bg-gold-light transition-colors duration-300 tracking-wider uppercase"
          >
            <Calendar size={16} />
            Agendar
          </a>
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden glass border-t border-border">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-body text-muted-foreground hover:text-gold transition-colors py-2 tracking-wider uppercase"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/5575981465876"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-sm tracking-wider uppercase"
            >
              <Calendar size={16} />
              Agendar Sessão
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
