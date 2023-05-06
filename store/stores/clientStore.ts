import { Client, ICurrentUser } from "@/api/types";

export interface IClinetStore {
    client: Client;
    // eslint-disable-next-line no-unused-vars
    setClient: (value: Client) => void;
    getClientId: () => number;

}

const clientStore = (): IClinetStore => {
    return {
        client: { id: 0, clientId: "1" },
        setClient: function (value) {
            this.client = value;
        },
        getClientId: function (): number {
            return parseInt(this.client.clientId)
        }
    };
};

export default clientStore;