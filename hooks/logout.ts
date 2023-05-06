import { useStore } from '@/store'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { USER_INFO_STORAGE_KEY } from '../constants'
import { ETabs } from '@/pages'
import { Modal } from 'antd-mobile'

export const useLogout = (callback?: any) => {
  const router = useRouter();
  const store = useStore();
  const logout = useCallback(() => {

    Modal.confirm({
      content: '确定要退出登录吗？',
      onConfirm: () => {
        localStorage.removeItem(USER_INFO_STORAGE_KEY);
        if (location.pathname === "/myCourse") {
          router.push("/")
        }
        callback && callback();
      },
      onCancel: () => {
      },
      closeOnMaskClick: true,
    })


  }, [])

  return logout
}
