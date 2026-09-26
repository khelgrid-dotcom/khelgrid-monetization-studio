import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { getCurrentProfile, upsertCurrentProfile } from "@/lib/profile-service";
import { getWalletBalance } from "@/lib/wallet-service";
import { getMyApplications } from "@/lib/opportunity-service";
import { type UserAccount, type UserRole, DEMO_ACCOUNTS, normalizeRole } from "@/types/auth";

export type Plan = "free" | "pro";
export interface AuthState {
  isAuthenticated:boolean; user:UserAccount; name:string; email:string; phone:string; plan:Plan; wallet:number;
  applications:string[]; paidApplications:string[]; boostedTrials:string[]; sportsCVUnlocked:boolean; role:UserRole;
  lastLoginAt?:string; lastSyncedToDb?:boolean;
}
export interface LoginOptions { identifier:string; role:"user"|"coach"|"academy"; name?:string; organization?:string; otp?:string; password?:string; }
export interface LoginResult { success:boolean; syncedToDb:boolean; user:UserAccount; targetRoute:string; message?:string; }

const emptyUser:UserAccount={id:"",name:"Guest User",email:"",phone:"",role:"user"};
const initial:AuthState={isAuthenticated:false,user:emptyUser,name:"Guest User",email:"",phone:"",plan:"free",wallet:0,applications:[],paidApplications:[],boostedTrials:[],sportsCVUnlocked:false,role:"user"};
const FREE_LIMIT=2;
const AuthContext=createContext<(AuthState & {
 isLoading:boolean; hydrated:boolean; freeLimit:number; remainingFree:number; canApply:(id:string)=>boolean;
 applyToTrial:(id:string)=>void; deductWallet:(amount:number,description:string)=>boolean; topUpWallet:(amount:number)=>void;
 upgradeToPro:()=>void; payForApplication:(id:string,method:"wallet"|"upi")=>boolean; boostTrial:(id:string,method:"wallet"|"upi")=>boolean;
 unlockSportsCV:(method:"wallet"|"upi")=>boolean; login:(o:LoginOptions)=>Promise<LoginResult>; logout:()=>void;
 switchRole:(r:"user"|"coach"|"academy")=>Promise<void>; setRole:(r:UserRole)=>void; reset:()=>void;
})|null>(null);

export function AuthProvider({children}:{children:ReactNode}){
 const [state,setState]=useState<AuthState>(initial); const [hydrated,setHydrated]=useState(false); const [loading,setLoading]=useState(true);
 const hydrate=async(user:any)=>{
   if(!user){setState(initial);return;}
   const profile=await getCurrentProfile().catch(()=>null);
   const wallet=await getWalletBalance().catch(()=>0);
   const apps=await getMyApplications().catch(()=>[]);
   const role=normalizeRole(profile?.role ?? "user");
   const account:UserAccount={id:user.id,name:profile?.full_name||user.user_metadata?.full_name||user.email||"KhelGrid User",email:user.email||"",phone:profile?.phone||user.phone||"",role,
     avatarUrl:profile?.avatar_url||undefined,city:profile?.city||undefined,primarySport:undefined,secondarySports:[],organization:undefined,credentials:[],verified:Boolean(profile?.is_verified),lastLoginAt:user.last_sign_in_at,targetRoute:role==="coach"?"/scout-portal":role==="academy"?"/academy":"/dashboard"};
   setState(s=>({...s,isAuthenticated:true,user:account,name:account.name,email:account.email,phone:account.phone,role,plan:(profile?.plan as Plan)||"free",wallet,applications:apps.map((a:any)=>a.opportunity_id),paidApplications:[],lastLoginAt:user.last_sign_in_at,lastSyncedToDb:true}));
 };
 useEffect(()=>{let active=true;(async()=>{const {data}=await supabase.auth.getSession();if(active) await hydrate(data.session?.user);if(active){setLoading(false);setHydrated(true)}})();const {data:{subscription}}=supabase.auth.onAuthStateChange(async(_event,session)=>{if(active) await hydrate(session?.user)});return()=>{active=false;subscription.unsubscribe()}},[]);
 const remainingFree=Math.max(0,FREE_LIMIT-state.applications.length);
 const canApply=(id:string)=>state.applications.includes(id)||state.plan==="pro"||remainingFree>0;
 const applyToTrial=(id:string)=>{void (async()=>{try{const {applyToOpportunity}=await import("@/lib/opportunity-service");await applyToOpportunity(id);await hydrate((await supabase.auth.getUser()).data.user)}catch(e){console.error(e)}})()};
 const deductWallet=(_amount:number,_description:string)=>false;
 const topUpWallet=(_amount:number)=>{console.warn("Wallet top-ups require a verified payment gateway; browser balance changes are disabled.")};
 const upgradeToPro=()=>{console.warn("Pro upgrades require a verified subscription payment; browser plan changes are disabled.")};
 const payForApplication=(_id:string,_method:"wallet"|"upi")=>{console.warn("Application payments must be confirmed server-side by a payment webhook.");return false};
 const boostTrial=(_id:string,_method:"wallet"|"upi")=>{console.warn("Trial boosts require server-side payment confirmation.");return false};
 const unlockSportsCV=(_method:"wallet"|"upi")=>{console.warn("Sports CV purchases require server-side payment confirmation.");return false};
 const login=async(o:LoginOptions):Promise<LoginResult>=>{
   const isEmail=o.identifier.includes("@"); let authData:any;
   if(o.otp){const r=await supabase.auth.verifyOtp(isEmail?{email:o.identifier,token:o.otp,type:"email"}:{phone:o.identifier,token:o.otp,type:"sms"});if(r.error)throw r.error;authData=r.data}
   else {const r=await supabase.auth.signInWithPassword({email:o.identifier,password:o.password||""});if(r.error)throw r.error;authData=r.data}
   const role=normalizeRole(o.role);
   await upsertCurrentProfile({full_name:o.name||authData.user.user_metadata?.full_name||authData.user.email||"KhelGrid User",phone:isEmail?null:o.identifier,role});
   await hydrate(authData.user);
   setState(s=>({...s,role,user:{...s.user,role}}));
   return {success:true,syncedToDb:true,user:{...state.user,role},targetRoute:role==="coach"?"/scout-portal":role==="academy"?"/academy":"/dashboard",message:"Signed in successfully"};
 };
 const logout=()=>{void supabase.auth.signOut();setState(initial)};
 const switchRole=async(r:"user"|"coach"|"academy")=>{const a=DEMO_ACCOUNTS[r];if(a) await login({identifier:a.email,role:r,password:""})};
 const setRole=(r:UserRole)=>setState(s=>({...s,role:r,user:{...s.user,role:normalizeRole(r)}}));
 const reset=()=>{void logout()};
 return <AuthContext.Provider value={{...state,isLoading:loading,hydrated,freeLimit:FREE_LIMIT,remainingFree,canApply,applyToTrial,deductWallet,topUpWallet,upgradeToPro,payForApplication,boostTrial,unlockSportsCV,login,logout,switchRole,setRole,reset}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const c=useContext(AuthContext);if(!c)throw new Error("useAuth must be used within AuthProvider");return c;}
