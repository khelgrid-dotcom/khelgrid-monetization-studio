import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type UserAccount, type UserRole, DEMO_ACCOUNTS, normalizeRole } from "@/types/auth";
import { recordUserLoginInDatabase } from "@/lib/user-profile-service";

export type Plan = "free" | "pro";

export interface AuthState {
  isAuthenticated: boolean;
  user: UserAccount;
  name: string; // for backward compatibility with existing components
  email: string;
  phone: string;
  plan: Plan;
  wallet: number;
  applications: string[]; // trial IDs applied to (counts include paid unlocks)
  paidApplications: string[]; // trial IDs paid for individually
  boostedTrials: string[];
  sportsCVUnlocked: boolean;
  role: UserRole;
  lastLoginAt?: string;
  lastSyncedToDb?: boolean;
}

export interface LoginOptions {
  identifier: string; // phone number or email
  role: "user" | "coach" | "academy";
  name?: string;
  organization?: string;
  otp?: string;
  password?: string;
}

export interface LoginResult {
  success: boolean;
  syncedToDb: boolean;
  user: UserAccount;
  targetRoute: string;
  message?: string;
}

interface AuthContextValue extends AuthState {
  freeLimit: number;
  remainingFree: number;
  canApply: (trialId: string) => boolean;
  applyToTrial: (trialId: string) => void;
  deductWallet: (amount: number, description: string) => boolean;
  topUpWallet: (amount: number) => void;
  upgradeToPro: () => void;
  payForApplication: (trialId: string, method: "wallet" | "upi") => boolean;
  boostTrial: (trialId: string, method: "wallet" | "upi") => boolean;
  unlockSportsCV: (method: "wallet" | "upi") => boolean;
  login: (options: LoginOptions) => Promise<LoginResult>;
  logout: () => void;
  switchRole: (role: "user" | "coach" | "academy") => Promise<void>;
  setRole: (r: UserRole) => void;
  reset: () => void;
}

const FREE_LIMIT = 2;
const STORAGE_KEY = "khelgrid-auth-v1";

const defaultUser: UserAccount = DEMO_ACCOUNTS.user;

const defaultState: AuthState = {
  isAuthenticated: true,
  user: defaultUser,
  name: defaultUser.name,
  email: defaultUser.email,
  phone: defaultUser.phone,
  plan: "free",
  wallet: 150,
  applications: [],
  paidApplications: [],
  boostedTrials: ["t-3"],
  sportsCVUnlocked: false,
  role: "user",
  lastLoginAt: new Date().toISOString(),
  lastSyncedToDb: true,
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const resolvedRole = normalizeRole(parsed.role || parsed.user?.role);
        const baseUser = DEMO_ACCOUNTS[resolvedRole] || defaultUser;
        const resolvedUser: UserAccount = {
          ...baseUser,
          ...(parsed.user || {}),
          name: parsed.name || parsed.user?.name || baseUser.name,
          role: resolvedRole,
        };

        setState({
          ...defaultState,
          ...parsed,
          user: resolvedUser,
          name: resolvedUser.name,
          role: resolvedRole,
        });
      }
    } catch {
      // Ignore localStorage parse errors
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, hydrated]);

  const remainingFree = Math.max(
    0,
    FREE_LIMIT - state.applications.filter((id) => !state.paidApplications.includes(id)).length,
  );

  const canApply = (trialId: string) => {
    if (state.applications.includes(trialId)) return true;
    if (state.plan === "pro") return true;
    return remainingFree > 0;
  };

  const applyToTrial = (trialId: string) => {
    setState((s) =>
      s.applications.includes(trialId) ? s : { ...s, applications: [...s.applications, trialId] },
    );
  };

  const deductWallet = (amount: number, _description: string) => {
    if (state.wallet < amount) return false;
    setState((s) => ({ ...s, wallet: s.wallet - amount }));
    return true;
  };

  const topUpWallet = (amount: number) => setState((s) => ({ ...s, wallet: s.wallet + amount }));

  const upgradeToPro = () => setState((s) => ({ ...s, plan: "pro" }));

  const payForApplication = (trialId: string, method: "wallet" | "upi") => {
    if (method === "wallet") {
      if (state.wallet < 49) return false;
      setState((s) => ({
        ...s,
        wallet: s.wallet - 49,
        applications: s.applications.includes(trialId)
          ? s.applications
          : [...s.applications, trialId],
        paidApplications: s.paidApplications.includes(trialId)
          ? s.paidApplications
          : [...s.paidApplications, trialId],
      }));
      return true;
    }
    setState((s) => ({
      ...s,
      applications: s.applications.includes(trialId)
        ? s.applications
        : [...s.applications, trialId],
      paidApplications: s.paidApplications.includes(trialId)
        ? s.paidApplications
        : [...s.paidApplications, trialId],
    }));
    return true;
  };

  const boostTrial = (trialId: string, method: "wallet" | "upi") => {
    if (method === "wallet") {
      if (state.wallet < 1500) return false;
      setState((s) => ({
        ...s,
        wallet: s.wallet - 1500,
        boostedTrials: s.boostedTrials.includes(trialId)
          ? s.boostedTrials
          : [...s.boostedTrials, trialId],
      }));
      return true;
    }
    setState((s) => ({
      ...s,
      boostedTrials: s.boostedTrials.includes(trialId)
        ? s.boostedTrials
        : [...s.boostedTrials, trialId],
    }));
    return true;
  };

  const unlockSportsCV = (method: "wallet" | "upi") => {
    if (method === "wallet") {
      if (state.wallet < 199) return false;
      setState((s) => ({ ...s, wallet: s.wallet - 199, sportsCVUnlocked: true }));
      return true;
    }
    setState((s) => ({ ...s, sportsCVUnlocked: true }));
    return true;
  };

  const login = async (options: LoginOptions): Promise<LoginResult> => {
    const role = options.role;
    const baseDemo = DEMO_ACCOUNTS[role];
    const isEmail = options.identifier.includes("@");

    const account: UserAccount = {
      id: `${role}-${options.identifier.replace(/[^a-zA-Z0-9]/g, "").slice(0, 15) || "demo"}`,
      name: options.name || baseDemo.name,
      email: isEmail
        ? options.identifier
        : options.identifier
          ? `${options.identifier}@khelgrid.com`
          : baseDemo.email,
      phone: !isEmail ? options.identifier : baseDemo.phone,
      role,
      avatarUrl: baseDemo.avatarUrl,
      city: baseDemo.city,
      primarySport: baseDemo.primarySport,
      secondarySports: baseDemo.secondarySports,
      organization: options.organization || baseDemo.organization,
      credentials: baseDemo.credentials,
      licenseNumber: baseDemo.licenseNumber,
      verified: true,
      lastLoginAt: new Date().toISOString(),
      targetRoute: baseDemo.targetRoute,
    };

    // Sync to Supabase user_profiles table and localStorage
    const dbResult = await recordUserLoginInDatabase(account);

    setState((s) => ({
      ...s,
      isAuthenticated: true,
      user: account,
      name: account.name,
      email: account.email,
      phone: account.phone,
      role,
      lastLoginAt: dbResult.timestamp,
      lastSyncedToDb: dbResult.syncedToDb,
    }));

    return {
      success: true,
      syncedToDb: dbResult.syncedToDb,
      user: account,
      targetRoute: account.targetRoute || "/dashboard",
      message: `Signed in as ${account.name} (${role})`,
    };
  };

  const logout = () => {
    setState((s) => ({
      ...s,
      isAuthenticated: false,
      name: "Guest User",
      role: "user",
      user: {
        id: "guest-user",
        name: "Guest User",
        email: "guest@khelgrid.com",
        phone: "",
        role: "user",
      },
    }));
  };

  const switchRole = async (targetRole: "user" | "coach" | "academy") => {
    const targetAccount = DEMO_ACCOUNTS[targetRole];
    await login({
      identifier: targetAccount.phone,
      role: targetRole,
      name: targetAccount.name,
    });
  };

  const setRole = (r: UserRole) => {
    const norm = normalizeRole(r);
    setState((s) => ({
      ...s,
      role: r,
      user: {
        ...s.user,
        role: norm,
      },
    }));
  };

  const reset = () => setState(defaultState);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        freeLimit: FREE_LIMIT,
        remainingFree,
        canApply,
        applyToTrial,
        deductWallet,
        topUpWallet,
        upgradeToPro,
        payForApplication,
        boostTrial,
        unlockSportsCV,
        login,
        logout,
        switchRole,
        setRole,
        reset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
