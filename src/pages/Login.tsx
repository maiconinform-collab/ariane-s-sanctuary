import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && user && isAdmin) navigate("/admin");
  }, [user, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) setError(error.message);
      else setMessage("Verifique seu e-mail para confirmar o cadastro.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-semibold">
            <span className="text-foreground">Ariane</span>{" "}
            <span className="text-gold">Moreira</span>
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-2">
            {isSignUp ? "Criar conta" : "Acesso ao Painel Administrativo"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 glass p-8 rounded-2xl border border-border">
          <div>
            <label className="text-sm font-body text-muted-foreground">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold transition-colors"
              required
            />
          </div>
          <div className="relative">
            <label className="text-sm font-body text-muted-foreground">Senha</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 bg-secondary border border-border rounded-xl text-foreground font-body text-sm focus:outline-none focus:border-gold transition-colors pr-12"
              required
              minLength={6}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-muted-foreground hover:text-gold">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-destructive text-sm font-body">{error}</p>}
          {message && <p className="text-gold text-sm font-body">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-body text-sm font-medium tracking-widest uppercase rounded-xl hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            <LogIn size={16} />
            {loading ? "Carregando..." : isSignUp ? "Cadastrar" : "Entrar"}
          </button>

          <p className="text-center text-sm text-muted-foreground font-body">
            {isSignUp ? "Já tem conta?" : "Não tem conta?"}{" "}
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-gold hover:underline">
              {isSignUp ? "Fazer login" : "Cadastre-se"}
            </button>
          </p>
        </form>

        <div className="text-center">
          <a href="/" className="text-sm text-muted-foreground hover:text-gold font-body transition-colors">
            ← Voltar ao site
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
