import { useContext } from "react"
import Footer from "./Footer"
import Header from "./Header"
import pcStyles from './index.module.scss'
import h5Styles from './mobile.module.scss'
import { ClientContext } from "@/store/context/clientContext"

const MyLayout = (props: any) => {

    const { isMobile } = useContext(ClientContext)
    const styles = isMobile ? h5Styles : pcStyles
    return <div className={styles['layout-container']}>
        <Header />
        {props.children}
        {/* <Footer /> */}
    </div>
}

export default MyLayout