import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Card} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {AuthContext} from "@/layouts/authContext.ts";

interface AuthLayoutProps {
    children: React.ReactNode;
    type: "user" | "admin";
}


const AuthLayout = ({children, type}: AuthLayoutProps) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const resetAuthentication = useCallback(() => {
        setIsAuthenticated(false);
        setUsername("");
        setPassword("");
    }, [setIsAuthenticated, setUsername, setPassword]);

    useEffect(() => {
        const storedCredentials = localStorage.getItem(`${type}Credentials`);
        if (storedCredentials) {
            setIsAuthenticated(true);
        }
    }, [type]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password) {
            localStorage.setItem(
                `${type}Credentials`,
                btoa(`${username}:${password}`)
            );
            setIsAuthenticated(true);
        }
    };

    if (!isAuthenticated) {
        return (
            <div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                <Card className="w-full max-w-md p-6 backdrop-blur-sm bg-white/90 shadow-xl border border-gray-100">
                    <div className="space-y-6">
                        <div className="space-y-2 text-center">
                            <h2 className="text-3xl font-semibold tracking-tight">Welcome</h2>
                            <p className="text-sm text-gray-500">Please enter your credentials to continue</p>
                        </div>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full"
                                />
                                <Input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Button type="submit" className="w-full">
                                    Continue
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => navigate("/")}
                                    className="w-full"
                                >
                                    Return to Home
                                </Button>
                            </div>
                        </form>
                    </div>
                </Card>
            </div>
        );
    }

    return <>
        <AuthContext.Provider value={{resetAuthentication}}>
            {children}
        </AuthContext.Provider>
    </>;
};

export default AuthLayout;
