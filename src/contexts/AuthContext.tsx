import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from "react";
import { useCollection } from "./CollectionContext";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  register: (username: string, email: string, password: string) => void;
  logout: () => void;
}

// Demo users với thẻ đã mua sẵn
const DEMO_USERS = {
  "demo@pixelmage.com": {
    id: "demo_user_1",
    username: "demo_user",
    email: "demo@pixelmage.com",
    purchasedCards: ["odin-wisdom", "thor-strength", "loki-cunning"]
  },
  "collector@pixelmage.com": {
    id: "collector_user_2",
    username: "collector",
    email: "collector@pixelmage.com",
    purchasedCards: ["odin-wisdom", "thor-strength", "freya-beauty", "valkyrie-honor"]
  },
  "legend@pixelmage.com": {
    id: "legend_user_3",
    username: "legend_hunter",
    email: "legend@pixelmage.com",
    purchasedCards: ["odin-wisdom", "thor-strength", "freya-beauty", "valkyrie-honor", "loki-cunning", "yggdrasil-unity"]
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, password: string) => {
    // Check if demo user
    const demoUser = DEMO_USERS[email as keyof typeof DEMO_USERS];
    
    const newUser: User = demoUser ? {
      id: demoUser.id,
      username: demoUser.username,
      email: demoUser.email,
    } : {
      id: `user_${Date.now()}`,
      username: email.split("@")[0],
      email,
    };
    
    setUser(newUser);
    
    // Store demo user info for CollectionContext to use
    if (demoUser) {
      localStorage.setItem('demo_user_cards', JSON.stringify(demoUser.purchasedCards));
    }
  }, []);

  const register = useCallback((username: string, email: string, password: string) => {
    // Mock register - in real app, call API
    const newUser: User = {
      id: `user_${Date.now()}`,
      username,
      email,
    };
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('demo_user_cards');
  }, []);

  const value = useMemo(() => ({
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }), [user, login, register, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
