import { useContext } from "react";
import { ClientContext } from "./clientContext";

export const useClientContext = () => {
    return useContext(ClientContext)
}