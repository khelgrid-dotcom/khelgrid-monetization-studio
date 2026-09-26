import { supabase } from "@/lib/supabase";

export async function getWalletBalance(){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return 0;
  const {data,error}=await supabase.from("wallet_transactions").select("balance_after,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(1).maybeSingle();
  if(error) throw error;
  return Number(data?.balance_after ?? 0);
}

export async function getWalletTransactions(){
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return [];
  const {data,error}=await supabase.from("wallet_transactions").select("*").eq("user_id",user.id).order("created_at",{ascending:false});
  if(error) throw error;
  return data;
}
