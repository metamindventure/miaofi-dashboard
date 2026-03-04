import { useAuth, AuthState } from "@/contexts/AuthContext";

const states: { value: AuthState; label: string }[] = [
  { value: "anonymous", label: "Anonymous" },
  { value: "anonymous-post-diagnosis", label: "Post-Diagnosis" },
  { value: "signed-in-free", label: "Free User (2 credits)" },
  { value: "signed-in-paid", label: "Paid User" },
];

const AuthStateSwitcher = () => {
  const { authState, setAuthState, setCredits, setTotalCredits } = useAuth();

  const handleSwitch = (state: AuthState) => {
    setAuthState(state);
    if (state === "signed-in-free") {
      setCredits(2);
      setTotalCredits(3);
    } else if (state === "signed-in-paid") {
      setCredits(12);
      setTotalCredits(15);
    } else if (state === "anonymous") {
      setCredits(1);
      setTotalCredits(1);
    } else if (state === "anonymous-post-diagnosis") {
      setCredits(0);
      setTotalCredits(1);
    }
  };

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 rounded-full px-1.5 py-1"
      style={{
        background: "rgba(10, 10, 15, 0.9)",
        backdropFilter: "blur(12px)",
        border: "1px solid hsl(0 0% 100% / 0.1)",
        boxShadow: "0 8px 32px -8px rgba(0,0,0,0.6)",
      }}
    >
      <span className="text-[10px] text-muted-foreground px-2 font-mono uppercase tracking-wider">Auth State</span>
      {states.map((s) => (
        <button
          key={s.value}
          onClick={() => handleSwitch(s.value)}
          className={`text-[11px] px-3 py-1.5 rounded-full transition-all font-medium ${
            authState === s.value
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-white/5"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
};

export default AuthStateSwitcher;
