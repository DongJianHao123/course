import { footerLinks } from "@/constants";
import { useStore } from "@/store";
import { map } from "lodash";
import { observer } from "mobx-react-lite";
import pcStyles from './index.module.scss'

const Footer = () => {
  const store = useStore();
  const homePage = store.homePage.homePage;
  const client = store.client.client;
  const styles = pcStyles
  const siteConfig = {
    // title: "阿图教育",
    // subTitle: "为中国培养100万信创产业一流人才",
    footer: {
      resources: [],
      contact: [
        { label: "客服电话", text: "131-6751-8813" },
        { label: "地址", text: "北京市海淀区清华科技园" },
      ]
    }
  }


  return (
    <footer className={styles['footer-container']}>
      <div className={styles["footer-info"]}>
        <section>
          <div className={styles['footer-item']}>
            <div className={styles["sub-title"]}>{client ? client.name : ""}</div>
            <div className={styles["sub-items"]}>
              <span>{homePage?.icpInfo}</span>
            </div>
          </div>
        </section>
        <section>
          <div className={styles['footer-item']}>
            <div className={styles["sub-title"]}>资源链接</div>
            <div className={styles["links"]}>
              {footerLinks.map(({ text, link }: any, index: number) => {
                return <a key={link} href={link} target="_blank" rel="noreferrer">
                  {text}
                </a>
              })
              }
            </div>

          </div>
        </section>

        <section>
          <div className={styles['footer-item']}>
            <div className={styles["sub-title"]}>联系我们</div>
            <div className={styles["sub-items"]}>
              {map(siteConfig.footer.contact, ({ label, text }) => (
                <div key={label}>
                  <span>{label}：</span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <span className={styles["record-number"]}>
        北京清华大学·<a target={"_blank"} href="https://beian.miit.gov.cn/" rel="noreferrer">京ICP备16045052号</a>
      </span>
    </footer>
  );
};

export default observer(Footer);
