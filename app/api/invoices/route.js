import { supabase } from "@/lib/supabase/client.ts";

export async function GET() {
  const { data, error } = await supabase
    .from("invoices")
    .select(`*,clients(*)`);

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  return Response.json(data);
}
