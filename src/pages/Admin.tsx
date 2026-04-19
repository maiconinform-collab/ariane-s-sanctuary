import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useServices } from "@/hooks/useServices";
import { useCourses } from "@/hooks/useCourses";
import { useReviews } from "@/hooks/useReviews";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Settings, BookOpen, Briefcase, Star, Users, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminServices from "@/components/admin/AdminServices";
import AdminCourses from "@/components/admin/AdminCourses";
import AdminReviews from "@/components/admin/AdminReviews";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminChangePassword from "@/components/admin/AdminChangePassword";

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: settings } = useSiteSettings();
  const { data: services } = useServices();
  const { data: courses } = useCourses();
  const { data: reviews } = useReviews(false);
  const [activeTab, setActiveTab] = useState<string>("settings");

  const isSuperAdmin = user?.email === "maiconinform@gmail.com";

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-gold animate-pulse font-heading text-xl">Carregando...</div></div>;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;

  const handleLogout = async () => { await supabase.auth.signOut(); };

  const tabs = [
    { id: "settings", label: "Configurações", icon: Settings },
    { id: "services", label: "Serviços", icon: Briefcase },
    { id: "courses", label: "Cursos", icon: BookOpen },
    { id: "reviews", label: "Avaliações", icon: Star },
    { id: "password", label: "Alterar Senha", icon: KeyRound },
    ...(isSuperAdmin ? [{ id: "users", label: "Usuários", icon: Users }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="glass border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-xl font-semibold">
              <span className="text-foreground">Painel</span>{" "}
              <span className="text-gold">Admin</span>
            </h1>
            <p className="text-xs text-muted-foreground font-body">{user.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-muted-foreground hover:text-gold font-body transition-colors">Ver Site</a>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-secondary text-foreground text-sm font-body rounded-xl hover:bg-destructive/20 hover:text-destructive transition-colors">
              <LogOut size={16} /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-body text-sm transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "settings" && settings && (
          <AdminSettings settings={settings} queryClient={queryClient} toast={toast} />
        )}
        {activeTab === "services" && (
          <AdminServices services={services || []} queryClient={queryClient} toast={toast} />
        )}
        {activeTab === "courses" && (
          <AdminCourses courses={courses || []} queryClient={queryClient} toast={toast} />
        )}
        {activeTab === "reviews" && (
          <AdminReviews reviews={reviews || []} queryClient={queryClient} toast={toast} />
        )}
        {activeTab === "password" && (
          <AdminChangePassword toast={toast} />
        )}
        {activeTab === "users" && isSuperAdmin && (
          <AdminUsers queryClient={queryClient} toast={toast} />
        )}
      </div>
    </div>
  );
};

export default Admin;
