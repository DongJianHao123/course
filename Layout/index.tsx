import Footer from "./Footer"
import Header from "./Header"

const MyLayout = (props: any) => {

    return <div className="layout-container">
        <Header />
        {props.children}
        {/* <Footer /> */}
    </div>
}

export default MyLayout