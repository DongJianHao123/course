import { getReplayOfCourse } from "@/api";
import Icon from "@/components/Icon";
import { message, Tooltip } from "antd";
import { find } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard'
import dynamic from "next/dynamic";
import { useStore } from "@/store";
import { Utils } from "@/common/Utils";

const VideoReplayer = dynamic(
    import('@/components/VideoReplayer'),
    { ssr: false }
)

function Replay() {
    const router = useRouter();
    const { id: courseId, replayId } = router.query;
    const [replay, setReplay] = useState<any>();
    const [link, setlink] = useState("");

    const store=useStore();

    const initData = useCallback(async () => {
        const replayList = await getReplayOfCourse(courseId?.toString() || "")
        const replay = find(replayList, ({ id }) => `${id}` === replayId)
        setReplay(replay)
        setlink(window.location.href)
    }, [courseId])

    useEffect(() => {
        initData()
    }, [initData])


    return (<div className="video-replay-modal">
        <header>
            <div className="title">{replay?.className}</div>
            <div className="actions">
                <Tooltip title="复制链接">  
                    <CopyToClipboard
                        text={link}
                        onCopy={() => {
                            message.success('复制成功!')
                        }}
                    >
                        <Icon symbol="icon-share" />
                    </CopyToClipboard>
                </Tooltip>
                <Tooltip title="返回课程">
                    <Icon symbol="icon-fanhui" onClick={() => router.push(`/${courseId}`)} />
                </Tooltip>
            </div>
        </header>
        <div className="video-replay-content">
            <VideoReplayer replay={replay} />
        </div>
    </div>)
}

export default Replay;