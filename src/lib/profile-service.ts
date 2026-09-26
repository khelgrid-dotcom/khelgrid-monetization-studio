import { supabase } from "@/lib/supabase";

export async function getCurrentProfile(){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return null;
  const {data,error}=await supabase.from("profiles").select("*").eq("id",user.id).maybeSingle();
  if(error) throw error;
  return data;
}

export async function upsertCurrentProfile(input: Record<string,unknown>){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) throw new Error("Please sign in first");
  const {data,error}=await supabase.from("profiles").upsert({id:user.id,email:user.email ?? null,...input}).select().single();
  if(error) throw error;
  return data;
}

export async function ensureAthleteProfile(input: Record<string,unknown>={}){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) throw new Error("Please sign in first");
  await upsertCurrentProfile({role:"athlete",...input});
  const {data,error}=await supabase.from("athletes").upsert({profile_id:user.id,...input}).select().single();
  if(error) throw error;
  return data;
}
