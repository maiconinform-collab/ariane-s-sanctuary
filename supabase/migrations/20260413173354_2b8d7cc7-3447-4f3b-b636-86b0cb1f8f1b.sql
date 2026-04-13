
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Site settings table
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'Ariane Moreira',
  slogan TEXT NOT NULL DEFAULT 'Reabilitação de Elite e Performance Humana',
  font_heading TEXT NOT NULL DEFAULT 'Playfair Display',
  font_body TEXT NOT NULL DEFAULT 'Inter',
  color_primary TEXT NOT NULL DEFAULT '43 48% 56%',
  color_secondary TEXT NOT NULL DEFAULT '0 0% 14%',
  color_background TEXT NOT NULL DEFAULT '0 0% 7%',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update settings" ON public.site_settings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert settings" ON public.site_settings FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default settings
INSERT INTO public.site_settings (site_name, slogan) VALUES ('Ariane Moreira', 'Reabilitação de Elite e Performance Humana');

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  detailed_text TEXT,
  icon_name TEXT NOT NULL DEFAULT 'Activity',
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert default services
INSERT INTO public.services (title, description, icon_name, sort_order) VALUES
  ('Liberação Miofascial', 'Técnica avançada para alívio de tensões profundas, restaurando a mobilidade e eliminando dores crônicas com precisão.', 'Activity', 0),
  ('Fisioterapia Desportiva', 'Reabilitação e prevenção de lesões para atletas de alto rendimento, com protocolos personalizados de recuperação.', 'Dumbbell', 1),
  ('Estética de Alta Performance', 'Drenagem linfática, massagem modeladora, eletrolipólise e protocolos estéticos com tecnologia de ponta.', 'Sparkles', 2),
  ('Atendimento para Atletas', 'Acompanhamento exclusivo para atletas profissionais e amadores, focado em performance e recuperação acelerada.', 'Users', 3);

-- Courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  detailed_text TEXT,
  duration TEXT,
  has_certificate BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Insert default course
INSERT INTO public.courses (title, description, duration, has_certificate, is_featured, sort_order) VALUES
  ('Workshop de Liberação Miofascial', 'Curso intensivo voltado para profissionais da saúde que desejam dominar técnicas avançadas de liberação miofascial. Conteúdo teórico-prático com abordagem integrativa e protocolos exclusivos.', '16 horas', true, true, 0),
  ('Ventosaterapia Clínica', 'Aprenda as técnicas de ventosaterapia aplicadas à reabilitação e estética. Protocolo completo com prática supervisionada.', '8 horas', true, false, 1),
  ('Drenagem Linfática Avançada', 'Formação completa em drenagem linfática com técnicas manuais e instrumentais para resultados estéticos e terapêuticos.', '12 horas', true, false, 2);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-assign admin role trigger for super admin email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'maiconinform@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

CREATE POLICY "Anyone can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Admins can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update uploads" ON storage.objects FOR UPDATE USING (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete uploads" ON storage.objects FOR DELETE USING (bucket_id = 'uploads' AND public.has_role(auth.uid(), 'admin'));
