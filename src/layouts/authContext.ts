import {createContext, useContext} from "react";

export type AuthContextType = {
    resetAuthentication: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => useContext(AuthContext);

