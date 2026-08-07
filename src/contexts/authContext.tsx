import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { getData, removeData, storeData } from "@/services/storage";

const AUTH_STORAGE_KEY = "authUser";

export type AuthUser = {
    email: string;
};

type AuthContextValue = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    login: (user: AuthUser) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        getData(AUTH_STORAGE_KEY).then((storedUser) => {
            if (storedUser) {
                setUser(storedUser);
            }
        });
    }, []);

    const login = (user: AuthUser) => {
        setUser(user);
        storeData(AUTH_STORAGE_KEY, user);
    };

    const logout = () => {
        setUser(null);
        removeData(AUTH_STORAGE_KEY);
    };

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated: !!user, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider.");
    }

    return context;
}
