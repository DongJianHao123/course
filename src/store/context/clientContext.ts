import { Dispatch, createContext } from "react";


export const ClientContext = createContext<{
    clientInfo?: any,
    isLogin?: boolean
    isMobile?: boolean,
    user?: string
    setClientInfo?: Dispatch<any>,
    checkLogined?: (phone?: string) => void,
    logout?: () => void,
    language?: string,
    changeLanguage?: (key: string) => void
}>({});
