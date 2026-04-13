import { BookOpen, Award, Clock, Star } from "lucide-react";
import { useCourses } from "@/hooks/useCourses";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const CoursesSection = () => {
  const { data: courses, isLoading } = useCourses();
  const { ref, isVisible } = useScrollAnimation();

  const items = courses || [];

  return (
    <section id="cursos" className="py-24 md:py-32 bg-card/30" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`text-center max-w-2xl mx-auto mb-16 space-y-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-8 rounded-2xl bg-card/50 border border-border animate-pulse h-64" />
              ))
            : items.map((course, index) => (
                <div
                  key={course.id}
                  className={`relative p-8 rounded-2xl glass border transition-all duration-500 ${
                    course.is_featured
                      ? "border-gold/40 gold-glow"
                      : "border-border/50 hover:border-gold/30"
                  } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${index * 100 + 200}ms` }}
                >
                  {course.is_featured && (
                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1 px-3 py-1 text-xs bg-primary text-primary-foreground font-body tracking-widest uppercase rounded-full">
                        <Star size={10} fill="currentColor" /> Destaque
                      </span>
                    </div>
                  )}

                  <BookOpen className="text-gold mb-5" size={32} strokeWidth={1.5} />

                  <h3 className="font-heading text-lg font-semibold mb-3 pr-16">
                    {course.title}
                  </h3>

                  <p className="text-muted-foreground font-body font-light leading-relaxed text-sm mb-6">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-body mb-6">
                    {course.duration && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="text-gold" size={14} strokeWidth={1.5} />
                        <span>{course.duration}</span>
                      </div>
                    )}
                    {course.has_certificate && (
                      <div className="flex items-center gap-1.5">
                        <Award className="text-gold" size={14} strokeWidth={1.5} />
                        <span>Certificado</span>
                      </div>
                    )}
                  </div>

                  <a
                    href={`https://wa.me/5575981465876?text=Olá! Gostaria de saber mais sobre o curso: ${course.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2.5 bg-primary text-primary-foreground font-body text-xs font-medium tracking-widest uppercase rounded-xl hover:bg-gold-light transition-colors duration-300"
                  >
                    Quero Participar
                  </a>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
