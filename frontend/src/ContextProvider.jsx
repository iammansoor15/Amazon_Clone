import { useState, useContext, createContext, useEffect } from "react";

export const LoginContext = createContext(null);

const ContextProvider = ({ children }) => {
    const [account, setAccount] = useState(() => {
        const storedAccount = localStorage.getItem("account");
        return storedAccount ? JSON.parse(storedAccount) : null;
    });

    useEffect(() => {
        if (account) {
            localStorage.setItem("account", JSON.stringify(account));
        } else {
            localStorage.removeItem("account");
        }
    }, [account]);

    return (
        <LoginContext.Provider value={{ account, setAccount }}>
            {children}
        </LoginContext.Provider>
    );
};

export default ContextProvider;
