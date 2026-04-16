import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Horario {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export function useHorarios() {
  return useQuery({
    queryKey: ["horarios"],
    queryFn: async () => {
      const { data, error } = await supabase.from("horarios").select("*").order("created_at");
      if (error) throw error;
      return data as Horario[];
    },
  });
}
