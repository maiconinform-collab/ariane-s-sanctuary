import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Course {
  id: string;
  title: string;
  description: string;
  detailed_text: string | null;
  duration: string | null;
  has_certificate: boolean;
  is_featured: boolean;
  image_url: string | null;
  sort_order: number;
}

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Course[];
    },
  });
}
