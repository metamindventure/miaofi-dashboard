import { createContext, useContext, useState, ReactNode } from "react";

export type AuthState = "anonymous" | "anonymous-post-diagnosis" | "signed-in-free" | "signed-in-paid";

interface AuthContextType {
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
  credits: number;
  setCredits: (n: number) => void;
  totalCredits: number;
  setTotalCredits: (n: number) => void;
  userName: string;
  walletAddress: string;
  signIn: () => void;
  signOut: () => void;
  upgradeModalOpen: boolean;
  setUpgradeModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>("anonymous");
  const [credits, setCredits] = useState(3);
  const [totalCredits, setTotalCredits] = useState(3);
  const [userName] = useState("0x7a3B…9f4E");
  const [walletAddress] = useState("0x7a3B1c8D2e5F6a9b0C4d3E8f1A2b5c7D9e4F9f4E");
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  const signIn = () => {
    setAuthState("signed-in-free");
    setCredits(2);
    setTotalCredits(3);
  };

  const signOut = () => {
    setAuthState("anonymous");
    setCredits(0);
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState,
        credits,
        setCredits,
        totalCredits,
        setTotalCredits,
        userName,
        walletAddress,
        signIn,
        signOut,
        upgradeModalOpen,
        setUpgradeModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
