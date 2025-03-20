import { createContext, useContext, useState } from "react";

const AppStateContext = createContext();

export const AppStateProvider = ({ children }) => {
    const [state, setState] = useState({
        user: null,
        isAuthenticated: false,
    });

    return (
        <AppStateContext.Provider value={[state, setState]}>
            {children}
        </AppStateContext.Provider>
    );
};

export const useAppState = () => useContext(AppStateContext);
