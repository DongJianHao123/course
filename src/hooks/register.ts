import { useStore } from '@/store';
import { useCallback, useEffect } from 'react'
import { getMyRegisters } from '../api'

// 获取当前登录用户的注册课程信息
export const useFetchMyRegister = () => {
  const store = useStore();
  let currentUser=store.user.currentUser;

  const loadMyRegister = useCallback(async () => {
    if (currentUser?.phone) {
      const res = await getMyRegisters(currentUser?.phone)
      store.myRegisters.setMyRegisters(res)
    }
  }, [currentUser?.phone])

  useEffect(() => {
    loadMyRegister()
  }, [loadMyRegister])
}
