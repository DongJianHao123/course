import { useContext, useState } from 'react'
import styles from './index.module.scss'
import { Button, Divider, Dropdown, MenuProps } from 'antd'
import { Space } from 'antd-mobile'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import LoginStatus from '../LoginStatus'
import { ClientContext } from '@/store/context/clientContext'
import Link from 'next/link'




const Header = () => {
    const [isOpen, setIsOpen] = useState(false)
    const { isLogin, logout, user } = useContext(ClientContext)
    const dropDownMenus: MenuProps['items'] = [
        {
            label: (
                <a target="_blank" rel="noopener noreferrer" href="/course/myCourse">
                    我的课程
                </a>
            ),
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: (
                <span onClick={() => { logout!() }}>
                    退出登录
                </span>
            ),
            key: '1',
        },

    ]
    return <div className={styles['layout-header']}>
        <div className={styles["logo-wrap"]}>
            <img src='https://ssl.cdn.maodouketang.com/Fpkgonzaw5GTUFa0Bfvd_ZlO5yq1' className={styles['logo']} alt='' />
            <Link href={'https://os2edu.cn/'} className={styles['title']}>开源操作系统社区</Link>
        </div>
        <div className={styles["user-wrap"]}>
            <ul className={styles['links']}>
                <li className={styles['link']}><Link href="/">课程培训</Link></li>
            </ul>
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