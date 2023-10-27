import { GlobalOutlined } from "@ant-design/icons"
import styles from './h5.module.scss'
import { useState } from 'react'
import { Popup } from "antd-mobile"
import { useTranslation } from "react-i18next"
import { i18nextLng } from "@/pages/_app"

const SwitchLanguage = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { t } = useTranslation()
    const languages = [{
        label: '中文(简体)',
        value: 'zh_CN'
    }, {
        label: 'English',
        value: 'en_US'
    }]
    const onLanguageClick = (e: any) => {
        if (e !== localStorage.getItem(i18nextLng)) {
            location.search = `?locale=${e}`
        }
    }
    return <>
        <div className={styles["sl-wrap"]} onClick={() => setIsOpen(true)}>
            <GlobalOutlined style={{ fontSize: '16px' }} />
        </div>
        <Popup
            visible={isOpen}
            onMaskClick={() => {
                setIsOpen(false)
            }}
            onClose={() => {
                setIsOpen(false)
            }}
            bodyStyle={{ height: '30vh' }}
            style={{ borderRadius: '10px' }}
        >
            <div className={styles['sl-popup']}>
                <div className={styles['title']}>
                    <GlobalOutlined style={{ fontSize: '16px' }} />  {t('home_page.header.choose_language.title')}
                </div>
                <ul>
                    {languages.map((item, index) => {
                        return <li key={index} className={item.value === localStorage.getItem(i18nextLng) ? styles['action'] : ''} onClick={() => onLanguageClick(item.value)}>{item.label}</li>
                    })}
                </ul>
            </div>
        </Popup>
    </>

}

export default SwitchLanguage