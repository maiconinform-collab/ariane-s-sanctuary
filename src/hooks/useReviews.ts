import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  author_name: string;
  content: string;
  rating: number;
  is_approved: boolean;
  created_at: string;
}

export function useReviews(onlyApproved = true) {
  return useQuery({
    queryKey: ["reviews", onlyApproved],
    queryFn: async () => {
      let query = supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (onlyApproved) query = query.eq("is_approved", true);
      const { data, error } = await query;
      if (error) throw error;
      return data as Review[];
    },
  });
}
