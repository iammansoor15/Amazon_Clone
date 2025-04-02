import { useState,useContext, createContext,useEffect  } from "react";

export const LoginContext = createContext(null);

const ContextProvider = ({children}) =>{
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const storedAccount = localStorage.getItem("account");
        if (storedAccount) {
          setAccount(JSON.parse(storedAccount));
        }
      }, []);

        return(
            <LoginContext.Provider value={{account,setAccount}}>
                {children}
            </LoginContext.Provider>
        );
}

export default ContextProvider;

