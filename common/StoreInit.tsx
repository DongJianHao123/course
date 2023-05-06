import { fetchClient, getHomePage, getMyRegisters } from "@/api";
import { USER_INFO_STORAGE_KEY } from "@/constants";
import { useStore } from "@/store";
import { useContext, useEffect, useState } from "react";
import { Utils } from "./Utils";
import { ClientContext } from "@/store/context/clientContext";

const StoreInit = () => {
  let store = useStore();
  const clientContext: any = useContext(ClientContext);
  const { clientInfo, setClientInfo } = clientContext;

  const [client, setClient] = useState<any>();
  const [homePage, setHomePage] = useState<any>();

  useEffect(() => {
    const { host } = location;
    let phone = Utils.storage.get(USER_INFO_STORAGE_KEY);

    Utils.client.getClientByHost(host).then((res) => {
      const clientId = res.clientId;
      fetchClient(clientId).then((res) => {
        setClient(res);
        store.client.setClient({ ...res })
      })
      if (!!phone) {
        // store.user.setUserInfo({ phone });
        getMyRegisters(phone, clientId).then((registers) => {
          store.myRegisters.setMyRegisters(registers);
        });
      }
      getHomePage(clientId).then((homePage) => {
        setHomePage(homePage)
        store.homePage.setHomePage(homePage)
      })
    });
  }, []);

  useEffect(() => {
    setClientInfo({ ...client, ...homePage })
  }, [client, homePage])



  return <></>;
};

export { StoreInit };
