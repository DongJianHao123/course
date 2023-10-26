import { useStore } from '@/store'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import { USER_INFO_STORAGE_KEY } from '../constants'
import { Modal } from 'antd-mobile'
import { useTranslation } from 'react-i18next'

export const useLogout = (callback?: any) => {
  const router = useRouter()
  const { t } = useTranslation()
  const logout = useCallback(() => {

    Modal.confirm({
      content: t('login.login_out.title'),
      onConfirm: () => {
        localStorage.removeItem(USER_INFO_STORAGE_KEY);
        if (location.pathname === "/course/myCourse") {
          router.push("/")
        }
        callback && callback();
      },
      onCancel: () => {
      },
      confirmText:t('common.button.confirm'),
      cancelText:t('common.button.cancel'),
      closeOnMaskClick: true,
    })
  }, [])

  return logout
}
