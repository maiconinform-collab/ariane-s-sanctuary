
-- Drop overly permissive policies
DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can send messages" ON public.messages;

-- More restrictive insert policies (still allow anonymous but require content)
CREATE POLICY "Anyone can submit reviews" ON public.reviews 
  FOR INSERT TO anon, authenticated 
  WITH CHECK (author_name IS NOT NULL AND content IS NOT NULL AND char_length(author_name) > 0 AND char_length(content) > 0);

CREATE POLICY "Anyone can send messages" ON public.messages 
  FOR INSERT TO anon, authenticated 
  WITH CHECK (name IS NOT NULL AND message IS NOT NULL AND char_length(name) > 0 AND char_length(message) > 0);
