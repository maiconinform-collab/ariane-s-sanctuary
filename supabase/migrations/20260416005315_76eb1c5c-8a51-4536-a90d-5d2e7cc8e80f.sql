
CREATE TABLE public.performance_elite (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT NOT NULL DEFAULT 'highlight',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.performance_elite ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view visible performance items"
  ON public.performance_elite FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Admins can manage performance items"
  ON public.performance_elite FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_performance_elite_updated_at
  BEFORE UPDATE ON public.performance_elite
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
