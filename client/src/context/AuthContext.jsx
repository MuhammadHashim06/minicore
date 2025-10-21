import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const Ctx = createContext({ user: undefined, setUser: () => {} });
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined); // undefined=loading, null=logged out
  useEffect(() => { api.get("/auth/me").then(r=>setUser(r.data)).catch(()=>setUser(null)); }, []);
  return <Ctx.Provider value={{ user, setUser }}>{children}</Ctx.Provider>;
}
