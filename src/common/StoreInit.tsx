import { fetchClient, getHomePage, getMyRegisters } from "@/api";
import { USER_INFO_STORAGE_KEY } from "@/constants";
import { useStore } from "@/store";
import { useContext, useEffect, useState } from "react";
import { Utils } from "./Utils";
import { ClientContext } from "@/store/context/clientContext";
import { Client } from "@/api/types";

const StoreInit = () => {
  let store = useStore();
  const clientContext = useContext(ClientContext);
  const { clientInfo, setClientInfo } = clientContext;

  const [client, setClient] = useState<any>();
  const [homePage, setHomePage] = useState<any>();

  useEffect(() => {
    let phone = Utils.storage.get(USER_INFO_STORAGE_KEY);
    Utils.client.localClient().then((localClient) => {
      store.client.setClient(localClient)
      setClient(localClient)
    });

    if (!!phone) {
      // store.user.setUserInfo({ phone });
      getMyRegisters(phone).then((registers) => {
        store.myRegisters.setMyRegisters(registers);
      });
    }
    getHomePage().then((homePage) => {
      setHomePage(homePage)
      store.homePage.setHomePage(homePage)
    })
  }, []);

  useEffect(() => {
    setClientInfo!({ ...client, ...homePage })
  }, [client, homePage])



  return <></>;
};

export { StoreInit };
