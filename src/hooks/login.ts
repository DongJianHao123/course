import { useState, useEffect, useCallback } from 'react'
import { USER_INFO_STORAGE_KEY } from '@/constants'
import { useStore } from '@/store'
import U from '@/common/U'

export const useLogined = (needPhone?: boolean): [boolean, string?] => {
  const [logined, setLogined] = useState<boolean>(false)
  const [phone, setPhone] = useState<string>()

  const login = (phone: string) => {
    if (U.str.isMobile(phone)) {
      setLogined(true)
      setPhone(phone)
    }
  }
  const initUserInfo = useCallback(() => {
    const _phone = localStorage.getItem(USER_INFO_STORAGE_KEY) || null
    if (_phone) {
      login(_phone)
    }
  }, [])

  useEffect(() => {
    initUserInfo()
  }, [initUserInfo])

  // useEffect(() => {
  //   if (currentUser?.phone) {
  //     setLogined(true)
  //     setPhone(currentUser.phone)
  //   } else {
  //     if (logined) {
  //       setLogined(false)
  //       setPhone(undefined)
  //     }
  //   }
  // }, [logined, currentUser?.phone])

  if (needPhone) {
    return [logined, phone]
  }

  return [logined]
}
