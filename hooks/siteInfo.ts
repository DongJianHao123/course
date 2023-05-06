import { getHomePage } from '@/api'
import { Utils } from '@/common/Utils'
import { useCallback, useEffect, useState } from 'react'

export const useSiteInfo = () => {
  const [config, setConfig] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [clientId, setClientId] = useState<any>()

  const init = useCallback(async () => {
    const _client =await Utils.client.getClientByHost();
    const _clientId = _client.clientId;
    const res = await getHomePage(_clientId);
    setLoading(false)
    setConfig(res)
    setClientId(_clientId)
  }, [])

  useEffect(() => {
    init()
  }, [init])

  return { config, loading, clientId }
}
