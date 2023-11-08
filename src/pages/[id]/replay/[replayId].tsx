import { getCourse, getReplayOfCourse } from "@/api";
import Icon from "@/components/Icon";
import { message, Modal, Tooltip } from "antd";
import { find } from "lodash";
import { useRouter } from "next/router";
import { RefObject, useCallback, useContext, useEffect, useRef, useState } from "react";
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard'
import dynamic from "next/dynamic";
import { USER_INFO_STORAGE_KEY } from "@/constants";
import U from "@/common/U";
import { Toast } from "antd-mobile";
import { ExclamationOutlined } from "@ant-design/icons";
import pcStyles from './index.module.scss'
import h5Styles from './mobile.module.scss'
import { ClientContext } from "@/store/context/clientContext";
import { useTranslation } from "react-i18next";

const VideoReplayer = dynamic(
    import('@/components/VideoReplayer'),
    { ssr: false }
)

const SwitchLanguage = dynamic(
    import('@/components/SwitchLanguage'),
    { ssr: false }
)

function Replay() {
    const router = useRouter();
    const { id: courseId, replayId } = router.query;
    const [replay, setReplay] = useState<any>();
    const [link, setlink] = useState("");
    const [course, setCourse] = useState({})
    const { isMobile } = useContext(ClientContext)
    const styles = isMobile ? h5Styles : pcStyles;
    const videoPlayerRef = useRef<{
        leaveVideo: () => void,
        videoRef: RefObject<HTMLVideoElement>
    }>()
    const { t } = useTranslation()

    const initData = useCallback(async () => {
        if (!courseId) return
        const userId = localStorage.getItem(USER_INFO_STORAGE_KEY) || "";
        if (!U.str.isMobile(userId)) {
            localStorage.removeItem(USER_INFO_STORAGE_KEY)
            Toast.show({
                icon: <ExclamationOutlined />,
                content: t('replay.tip.please_login'),
                duration: 2000
            });
            router.push("/")
        }
        const replayList = await getReplayOfCourse(courseId?.toString() || "")
        const replay = find(replayList, ({ id }) => `${id}` === replayId)
        const course = await getCourse(courseId)
        setCourse(course)
        setReplay(replay)
        setlink(window.location.href)
    }, [courseId])

    useEffect(() => {
        initData()
    }, [initData])

    useEffect(() => {
        const handleTabClose = (event: any) => {
            event.preventDefault();
            console.log('beforeunload event triggered');
            videoPlayerRef.current?.videoRef.current?.pause()
            videoPlayerRef.current?.leaveVideo()
            return (event.returnValue = 'Are you sure you want to exit?');
        };

        window.addEventListener('beforeunload', handleTabClose);
        return () => {
            window.removeEventListener('beforeunload', handleTabClose);
        };
    }, []);

    return (
        <div className={styles["video-wrapper"]}>
            <div className={styles["video-replay-modal"]}>
                <header className={styles['header']}>
                    <div className={styles["title"]}>{replay?.className}</div>
                    <div className={styles["actions"]}>
                        <Tooltip title={t('replay.button.language')}>
                            <SwitchLanguage style={{
                                width: "20px",
                                height: "20px",
                                transform: "scale(0.8)"
                            }} />
                        </Tooltip>
                        <Tooltip title={t('replay.button.copy')}>
                            <CopyToClipboard
                                text={link}
                                onCopy={() => { message.success(t('replay.tip.copy_success')) }}
                            >
                                <Icon symbol="icon-share" />
                            </CopyToClipboard>
                        </Tooltip>

                        <Tooltip title={t('replay.button.return_course')}>
                            <Icon symbol="icon-fanhui" onClick={() => {
                                Modal.confirm({
                                    title: t('replay.tip.return_course'),
                                    onOk() {
                                        videoPlayerRef.current!.leaveVideo()
                                        router.push(`/${courseId}`)
                                    },
                                    okText: t('common.button.confirm'),
                                    cancelText: t('common.button.cancel'),
                                })
                            }
                            } />
                        </Tooltip>
                    </div>
                </header>
                <div className={styles["video-replay-content"]}>
                    <VideoReplayer onRef={videoPlayerRef} replay={replay} course={course} />
                </div>
            </div>
        </div>)
}

export default Replay;