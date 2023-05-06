// hooks/useHostnameData.js
import { Utils } from '@/common/Utils';
import { useState, useEffect } from 'react';
const useHostClient = () => {
    const [client, setClient] = useState<any>();
    useEffect(() => {
        const fetchData = async () => {
            const host = window.location.host;
            const res = await Utils.client.localClient(host);
            setClient(res);
        };
        fetchData();
    }, []);
    return { client };
};
export default useHostClient;