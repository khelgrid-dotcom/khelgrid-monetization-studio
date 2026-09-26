import { supabase } from "@/lib/supabase";

export async function getLiveTrials() {
  const {data,error}=await supabase.from("opportunities").select("*, sports(name), academies(name)").eq("status","published").order("start_at",{ascending:true});
  if(error) throw error;
  return (data ?? []).map((row:any)=>({
    id:row.id,title:row.title,academy:row.academies?.name ?? "KhelGrid Organizer",sport:row.sports?.name ?? "Multi-Sport",
    city:row.city ?? "",date:row.start_at ? new Date(row.start_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : "Date TBA",
    fee:Number(row.fee ?? 0),spots:Number(row.capacity ?? 0),tag:row.opportunity_type==="trial"?"Open":row.opportunity_type,
    sourceUrl:row.metadata?.sourceUrl,sourceLabel:row.metadata?.sourceLabel,lastVerified:row.updated_at,
    eligibility:typeof row.eligibility==="string"?row.eligibility:JSON.stringify(row.eligibility ?? {}),
    requiredDocuments:Array.isArray(row.requirements)?row.requirements:[],selectionProcess:row.metadata?.selectionProcess,
    registrationDeadline:row.registration_deadline ? new Date(row.registration_deadline).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}) : undefined,
    venue:row.location_name,verifiedLabel:row.metadata?.verifiedLabel
  }));
}

export async function getOpportunities(filters?: { sport?: string; city?: string; status?: string }) {
  let q = supabase.from("opportunities").select("*").order("created_at",{ascending:false});
  if (filters?.sport) q=q.eq("sport_id",filters.sport);
  if (filters?.city) q=q.ilike("city",filters.city);
  q=filters?.status ? q.eq("status",filters.status) : q.eq("status","published");
  const {data,error}=await q;
  if(error) throw error;
  return data;
}

export async function getMyApplications() {
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return [];
  const {data,error}=await supabase.from("applications").select("*, opportunities(*)").eq("athlete_id", (await getMyAthleteId(user.id)) ?? "00000000-0000-0000-0000-000000000000").order("applied_at",{ascending:false});
  if(error) throw error;
  return data;
}

export async function getMyAthleteId(profileId:string) {
  const {data,error}=await supabase.from("athletes").select("id").eq("profile_id",profileId).maybeSingle();
  if(error) throw error;
  return data?.id ?? null;
}

export async function applyToOpportunity(opportunityId:string, coverNote?:string) {
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) throw new Error("Please sign in first");
  const athleteId=await getMyAthleteId(user.id);
  if(!athleteId) throw new Error("Create your athlete profile before applying");
  const {data:athlete}=await supabase.from("athletes").select("*, profiles(*)").eq("id",athleteId).single();
  const {data,error}=await supabase.from("applications").insert({opportunity_id:opportunityId,athlete_id:athleteId,cover_note:coverNote ?? null,cv_snapshot:athlete ?? {}}).select().single();
  if(error) throw error;
  return data;
}
