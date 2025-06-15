import { createContext, useContext, useState } from "react";

const SessionExpiredContext = createContext();

export const SessionExpiredProvider = ({ children }) => {
  const [isExpired, setIsExpired] = useState(false);

  const triggerSessionExpired = () => setIsExpired(true);
  const resetSessionExpired = () => setIsExpired(false);

  return (
    <SessionExpiredContext.Provider value={{ isExpired, triggerSessionExpired, resetSessionExpired }}>
      {children}
    </SessionExpiredContext.Provider>
  );
};

export const useSessionExpired = () => useContext(SessionExpiredContext);
