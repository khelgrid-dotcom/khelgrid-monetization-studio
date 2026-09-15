import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Plan = "free" | "pro";

export interface ScheduledSession {
  id: string;
  type: "trial" | "coaching";
  title: string;
  provider: string;
  location: string;
  scheduledAt: string;
}

export interface AuthState {
  name: string;
  plan: Plan;
  wallet: number;
  applications: string[]; // trial IDs applied to (counts include paid unlocks)
  paidApplications: string[]; // trial IDs paid for individually
  boostedTrials: string[];
  sportsCVUnlocked: boolean;
  role: "athlete" | "organizer" | "recruiter";
  scheduledSessions: ScheduledSession[];
  referralCode: string;
  referralInvitesSent: number;
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
  setRole: (r: "athlete" | "organizer" | "recruiter") => void;
  scheduleSession: (session: ScheduledSession) => void;
  recordReferralInvite: () => boolean;
  reset: () => void;
}

const FREE_LIMIT = 2;
const STORAGE_KEY = "khelgrid-auth-v1";

function createDefaultState(): AuthState {
  const scheduledAt = new Date();
  scheduledAt.setDate(scheduledAt.getDate() + 2);
  scheduledAt.setHours(18, 0, 0, 0);

  return {
    name: "Arjun Mehta",
    plan: "free",
    wallet: 150,
    applications: [],
    paidApplications: [],
    boostedTrials: ["t-3"],
    sportsCVUnlocked: false,
    role: "athlete",
    scheduledSessions: [
      {
        id: "coaching-c4",
        type: "coaching",
        title: "Football Skills Lab",
        provider: "Coach Vikram Singh",
        location: "Dwarka, Delhi",
        scheduledAt: scheduledAt.toISOString(),
      },
    ],
    referralCode: "ARJUN50",
    referralInvitesSent: 0,
  };
}

const defaultState = createDefaultState();

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...defaultState, ...JSON.parse(raw) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

  const setRole = (r: "athlete" | "organizer" | "recruiter") => setState((s) => ({ ...s, role: r }));
  const scheduleSession = (session: ScheduledSession) =>
    setState((s) => ({
      ...s,
      scheduledSessions: [...s.scheduledSessions.filter((item) => item.id !== session.id), session],
    }));
  const recordReferralInvite = () => {
    const nextInviteCount = state.referralInvitesSent + 1;
    const unlockedReward = nextInviteCount % 3 === 0;
    setState((s) => ({
      ...s,
      referralInvitesSent: nextInviteCount,
      wallet: unlockedReward ? s.wallet + 150 : s.wallet,
    }));
    return unlockedReward;
  };
  const reset = () => setState(createDefaultState());

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
        setRole,
        scheduleSession,
        recordReferralInvite,
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
