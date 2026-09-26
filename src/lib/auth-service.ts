import { supabase } from "@/lib/supabase";

export async function signInWithPassword(email:string,password:string){
  const {data,error}=await supabase.auth.signInWithPassword({email,password});
  if(error) throw error;
  return data;
}
export async function signInWithOtp(email:string){
  const {data,error}=await supabase.auth.signInWithOtp({email,options:{emailRedirectTo:window.location.origin+"/auth/callback"}});
  if(error) throw error;
  return data;
}
export async function signOut(){ return supabase.auth.signOut(); }
