import { useStore } from "@/store";
import { map } from "lodash";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import pcStyles from './index.module.scss';
import h5styles from './h5.module.scss'

const Footer = ({ isMobile }: { isMobile: boolean }) => {
  const store = useStore();
  const homePage = store.homePage.homePage;

  const { t } = useTranslation();
  const client = store.client.client;
  const styles = isMobile ? h5styles : pcStyles
  const siteConfig = {
    // title: "阿图教育",
    // subTitle: "为中国培养100万信创产业一流人才",
    footer: {
      resources: [],
      contact: [
        { label: t('home_page.footer.customer_service_phone'), text: "131-6751-8813" },
        { label: t('home_page.footer.address'), text: t('home_page.footer.address_content') },
      ]
    }
  }

  const footerLinks = [
    { index: 0, text: t('home_page.footer.resource_link1'), link: "http://docs.os2edu.cn/" },
    { index: 1, text: t('home_page.footer.resource_link2'), link: "http://rcore-os.cn/rCore-Tutorial-Book-v3/" },
    { index: 2, text: t('home_page.footer.resource_link3'), link: "https://os.educg.net/2022CSCC" },
  ]


  return (
    <footer className={styles['footer-container']}>
      <div className={styles["footer-info"]}>
        <section>
          <div className={styles['footer-item']}>
            <div className={styles["sub-title"]}>{t('home_page.footer.title')}</div>
            <div className={styles["sub-items"]}>
              <span>{t('home_page.footer.intro')}</span>
            </div>
          </div>
        </section>
        <section>
          <div className={styles['footer-item']}>
            <div className={styles["sub-title"]}>{t('home_page.footer.resource_links')}</div>
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
            <div className={styles["sub-title"]}>{t('home_page.footer.contact_us')}</div>
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
        {t('home_page.footer.benan_title')}<a target={"_blank"} href="https://beian.miit.gov.cn/" rel="noreferrer">{t('home_page.footer.benan_icp')}</a>
      </span>
    </footer>
  );
};

export default observer(Footer);
