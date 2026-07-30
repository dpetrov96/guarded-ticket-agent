import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type TicketRefreshContextValue = {
  version: number;
  refreshTicketData: () => void;
};

const TicketRefreshContext = createContext<TicketRefreshContextValue | null>(
  null,
);

export function TicketRefreshProvider({ children }: { children: ReactNode }) {
  const [version, setVersion] = useState(0);

  const refreshTicketData = useCallback(() => {
    setVersion((current) => current + 1);
  }, []);

  const value = useMemo(
    () => ({ version, refreshTicketData }),
    [version, refreshTicketData],
  );

  return (
    <TicketRefreshContext.Provider value={value}>
      {children}
    </TicketRefreshContext.Provider>
  );
}

export function useTicketRefresh(): TicketRefreshContextValue {
  const value = useContext(TicketRefreshContext);
  if (!value) {
    throw new Error("useTicketRefresh must be used within TicketRefreshProvider");
  }
  return value;
}
