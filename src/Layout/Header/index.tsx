import { useContext, useState } from 'react'
import styles from './index.module.scss'
import { Dropdown, MenuProps } from 'antd'
import { CaretDownOutlined, GlobalOutlined } from '@ant-design/icons'
import LoginStatus from '../LoginStatus'
import { ClientContext } from '@/store/context/clientContext'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useClientContext } from '@/store/context'
import { i18nextLng } from '@/pages/_app'

const Header = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { isLogin, logout, user } = useContext(ClientContext)
    const { t } = useTranslation()

    const { isMobile } = useClientContext()

    const dropDownMenus: MenuProps['items'] = [
        {
            label: t('home_page.header.my_course'),
            key: '0',
            onClick: () => { window.open("/course/myCourse", '_blank') }
        },
        {
            type: 'divider',
        },
        {
            label: t('home_page.header.logout'),
            key: '1',
            onClick: () => { logout!() }
        },

    ]

    const languages: { key: string, label: string }[] = [
        {
            key: 'zh_CN',
            label: '中文'
        },
        {
            key: 'en_US',
            label: 'English'
        },
        // {
        //     key: 'de-DE',
        //     label: 'Deutsch'
        // },
        // {
        //     key: 'fr-FR',
        //     label: 'Français'
        // },

    ]

    const onLanguageClick = (e: any) => {
        if (e.key !== localStorage.getItem(i18nextLng)) {
            location.search = `?locale=${e.key}`
        }
    }
    return <div style={{ display: isMobile ? 'none' : '' }} className={styles['layout-header']}>
        <div className={styles["logo-wrap"]}>
            <img src='https://ssl.cdn.maodouketang.com/Fpkgonzaw5GTUFa0Bfvd_ZlO5yq1' className={styles['logo']} alt='' />
            <Link href={'https://os2edu.cn/'} className={styles['title']}>{t('home_page.header.logo')}</Link>
        </div>
        <div className={styles["user-wrap"]}>
            <ul className={styles['links']}>
                <li className={styles['link']}><Link href="/">{t('home_page.header.back_home')}</Link></li>
            </ul>
            <Dropdown menu={{ items: languages, onClick: onLanguageClick }} >
                <GlobalOutlined style={{ fontSize: '16px' }} />
            </Dropdown>
            {
                isLogin ?
                    <Dropdown className={styles['myinfo']} onOpenChange={(e) => setIsOpen(e)} menu={{ items: dropDownMenus }} trigger={['click']}>
                        <div className={styles['myinfo']} onClick={() => setIsOpen(!isOpen)}>
                            <img className={styles['avatar']} src="https://ssl.cdn.maodouketang.com/Fn2y9zZHL6Cp7tLDsUq5b1kF7S88" alt="" />
                            <span className={styles['account']}>{user}</span>
                            <CaretDownOutlined />
                        </div>
                    </Dropdown>
                    :
                    <LoginStatus />
            }

        </div>
    </div >
}

export default Header