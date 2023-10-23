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

const VideoReplayer = dynamic(
    import('@/components/VideoReplayer'),
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
    

    const initData = useCallback(async () => {
        if (!courseId) return
        const userId = localStorage.getItem(USER_INFO_STORAGE_KEY) || "";
        if (!U.str.isChinaMobile(userId)) {
            Toast.show({
                icon: <ExclamationOutlined />,
                content: "请登录后观看",
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
                        <Tooltip title="复制链接">
                            <CopyToClipboard
                                text={link}
                                onCopy={() => { message.success('复制成功!') }}
                            >
                                <Icon symbol="icon-share" />
                            </CopyToClipboard>
                        </Tooltip>

                        <Tooltip title="返回课程">
                            <Icon symbol="icon-fanhui" onClick={() => {
                                Modal.confirm({
                                    title: "要返回到课程页面吗？",
                                    onOk() {
                                        videoPlayerRef.current!.leaveVideo()
                                        router.push(`/${courseId}`)
                                    },
                                    okText: "确认",
                                    cancelText: "取消"
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