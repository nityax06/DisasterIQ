import { supabase } from "./supabaseClient";

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from("incidents")
    .select("*");

  console.log("Supabase data:", data);
  console.log("Supabase error:", error);
}