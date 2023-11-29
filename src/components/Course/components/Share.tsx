/* eslint-disable @next/next/no-img-element */
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react'
import { find } from "lodash";
import { RoleNameMap } from "@/constants";
import { BASE_URL } from "@/utils/request";
import Icon from "@/components/Icon";
import QRCode from "./QRCode";

const Share = observer((props: { courseInfo: any; isMobile?: boolean }) => {
    const store = useStore();
    let currentUser = store.user.currentUser;
    let myRegisters = store.myRegisters.myRegisters;
    const { id: courseId } = useParams<{ id: string }>();
    const [pageLink, setPageLink] = useState("");
    const { t } = useTranslation()

    let miniQRPath: string = "";
    if (currentUser?.phone) {
        const registerCourse = find(
            myRegisters,
            (course) => course.courseId === courseId
        );
        let path = "";
        if (!!registerCourse) {
            path = encodeURIComponent(
                `pages/room/room?userId=${registerCourse.phone}-m&roomId=${props.courseInfo.roomId
                }&role=${RoleNameMap[registerCourse.status] || "student"}&username=${registerCourse.name
                }-m`
            );
        } else {
            path = encodeURIComponent(
                `pages/index/index?roomId=${props.courseInfo.roomId}`
            );
        }
        miniQRPath = `${BASE_URL}/seller/api/room/path.jpg?path=${path}`;
    }

    useEffect(() => {
        setPageLink(location.href)
    }, [])

    return (
        <>
            <div className="share-box">
                <span>
                    <Icon symbol="icon-share" />
                    {t('course.share.share_qr_code')}
                </span>
                <span style={{ marginBottom: 10 }}>{t('course.share.invite_friends')}</span>
                <div className={`share-imgs ${props.isMobile ? "share-imgs-mobile" : ""}`}                >
                    <QRCode
                        style={{ width: 100}}
                        fgColor="#3db477"
                        viewBox={`0 0 256 256`}
                        value={pageLink}
                    />
                    {miniQRPath && <img src={miniQRPath} alt="mini" />}
                </div>
            </div>
        </>
    );
});

export default Share