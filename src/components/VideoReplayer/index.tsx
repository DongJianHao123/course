import { useState, useEffect, useCallback, useRef, useImperativeHandle, MutableRefObject, RefObject, useContext } from 'react'
import dayjs from 'dayjs'
import { filter, map, isEmpty, debounce } from 'lodash'
import { Empty, Spin, Input } from 'antd'
import { getReplayerChatHistory, studentAction } from '@/api'
import Icon from '@/components/Icon'
import HighlightText from '@/components/HighlightText'
import { useDeviceDetect } from '@/hooks'
import { RoomActionType } from '@/api/types'
import { ActionType, RoleNameMap } from '@/constants'
import { useStore } from '@/store'


import pcStyles from './index.module.scss'
import h5Styles from './mobile.module.scss'
import { Utils } from '@/common/Utils'
import { ClientContext } from '@/store/context/clientContext'
import { useTranslation } from 'react-i18next'


window.HELP_IMPROVE_VIDEOJS = false


interface IReplay {
  id: string
  title: string
  roomId: string
  choseUrl: string
  startAt: string
  endAt: string
  className: string
}
interface IProps {
  replay: IReplay
  course: any
  chat?: { totalNum: number; roomActionList: any[] }
  onRef: MutableRefObject<{
    leaveVideo: () => void
    videoRef: RefObject<HTMLVideoElement>
  } | undefined>
}

const PlayBackRages = [0.7, 1.0, 1.5, 2.0]
const chatHistoryMap: Record<string, any> = {}
let timer: NodeJS.Timeout;
let duration = 1

const VideoReplayerModal = (props: IProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<any>(null)
  const [chatLoading, setChatLoading] = useState(false)
  const [keyword, setKeyword] = useState('');
  const [canPlay, setCanPlay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const { isMobile } = useContext(ClientContext)
  const store = useStore()
  const currentUser = store.user.currentUser
  const client = store.client.client
  const myRegisters = store.myRegisters.myRegisters
  const { t } = useTranslation()

  const styles = isMobile ? h5Styles : pcStyles;

  const getChatHistory = useCallback(async () => {
    if (props.replay && !chatHistoryMap[props.replay.id]) {
      setChatLoading(true)
      const { id, roomId, startAt, endAt } = props.replay
      const res = await getReplayerChatHistory({
        roomId,
        startTime: startAt,
        endTime: endAt || dayjs(startAt).add(3, 'hour').toJSON(),// consider default endtime as 3 hours later
      })
      chatHistoryMap[id] = res
      setChatLoading(false)
    }
  }, [props.replay?.id])

  const initializeVideo = useCallback(() => {
    if (!props.replay?.choseUrl) return
    if (playerRef.current) {
      playerRef.current.src(props.replay?.choseUrl)
      playerRef.current.playbackRates(PlayBackRages)
    } else {
      if (videoRef.current) {
        const options = {
          playbackRates: PlayBackRages
        }
        const player = (window as any).videojs(videoRef.current, options, function ready() { })
        playerRef.current = player
      }
    }
  }, [props.replay?.choseUrl, videoRef.current])

  const dispose = useCallback(() => {
    const player = playerRef.current
    if (player) {
      // player.dispose()
      player.reset()
      // playerRef.current = null
      // if (videoRef.current) {
      //   videoRef.current.id = 'replay-video'
      // }
    }
  }, [playerRef.current])


  const setVideoCurrentTime = (time: string) => {
    if (props.replay?.startAt && playerRef.current) {
      const currentTime = dayjs(time).diff(dayjs(props.replay?.startAt), 'second')
      playerRef.current.currentTime(currentTime)
    }
  }

  const chat = chatHistoryMap[props.replay?.id || '']

  const handleSearch = debounce((e) => {
    const value = e.target.value.trim()
    setKeyword(value)
  }, 300)

  const filterChat = () => {
    if (keyword) {
      return filter(chat?.roomActionList, (item) => {
        return (
          item.userName?.toLowerCase().includes(keyword) ||
          item.description
            .replace(/(TEXT:|CODE:)/, '')
            .toLowerCase()
            .includes(keyword)
        )
      })
    }
    return chat?.roomActionList
  }

  const addDuration = () => {
    canPlay && duration++
    console.log(duration);
    setIsPlaying(true)
  }

  const onVideoPlay = () => {
    console.log("开始播放");
    setIsPlaying(true)
    timer = setInterval(() => addDuration(), 1000)
  }

  const onVideoPause = () => {
    console.log("暂停播放");
    setIsPlaying(false)
    clearInterval(timer)
  }

  const onCanPlay = () => {
    setCanPlay(true);
    if (isPlaying) {
      videoRef.current?.click()
      videoRef.current?.click()
    }
  }

  const leaveVideo = () => {
    let data: RoomActionType = {
      userId: currentUser.phone || "",
      userName: myRegisters?.find((item) => item.courseId === props.course.courseId)?.name || "",
      courseClassId: parseInt(props.replay?.id || ""),
      role: RoleNameMap[1],
      clientId: client.clientId,
      clientName: client.clientName || "",
      actionType: ActionType.PLAY_BACK,
      description: duration,
      actionTime: new Date(),
      courseId: props.course.courseId || "",
      courseName: props.course.title,
      courseClassName: props.replay!.className,
      roomId: props.replay.roomId,
    }
    duration > 1 && studentAction(data);
    duration = 0
    console.log("已记录用户行为", data);
  }

  //将方法暴露给父组件
  useImperativeHandle(props.onRef, () => {
    return {
      leaveVideo: Utils.common.throttle(leaveVideo, 2000),
      videoRef: videoRef
    }
  })

  useEffect(() => {
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    getChatHistory()
  }, [getChatHistory])

  useEffect(() => {
    initializeVideo()
  }, [initializeVideo])

  useEffect(() => {
    return () => {
      dispose()
    }
  }, [playerRef])


  return (
    <div className={styles["video-replay-wrap"]}>
      <div className={styles["replay-box"]}>
        <div data-vjs-player style={{ width: '100%', height: !isMobile ? '100%' : "calc(26vh)" }}>
          <video
            controls
            playsInline
            ref={videoRef}
            id="replay-video"
            className={"video-js vjs-big-play-centered"}
            preload="auto"
            onPlay={onVideoPlay}
            onPause={onVideoPause}
            onCanPlay={onCanPlay}
          // poster={siteConfig.logo}
          >
            <source src={props.replay?.choseUrl} type="video/mp4" />
            <p className={styles["vjs-no-js"]}>
              To view this video please enable JavaScript, and consider upgrading to a web browser
              that
              <a href="https://videojs.com/html5-video-support/" target="_blank" rel="noreferrer">
                supports HTML5 video
              </a>
            </p>
          </video>
        </div>
      </div>
      <div className={styles["replay-chat-history"]}>
        <header>
          <h3>{t('replay.chat.title')}</h3>
          {chat?.totalNum && (
            <span className={styles["chat-total"]}>
              {t('replay.chat.total', { num: chat.totalNum as string })}
            </span>
          )}
        </header>
        <main className={`${chatLoading ? styles['chat-loading'] : ''}`}>
          {chatLoading ? (
            <Spin spinning={chatLoading} />
          ) : isEmpty(chat?.roomActionList) ? (
            <Empty description={t('replay.tip.empty')} />
          ) : (
            <>
              <Input
                allowClear
                className={styles["chat-text-search"]}
                width="100%"
                placeholder={t('replay.tip.search_placeholder')}
                suffix={<Icon symbol="icon-search" />}
                onChange={handleSearch}
                onPressEnter={(e: any) => {
                  const value = e.currentTarget.value.trim()
                  setKeyword(value)
                }}
              />
              {map(filterChat(), (item) => (
                <div key={item.id} className={styles["chat-item"]}>
                  <span className={styles["chator"]}>
                    <HighlightText text={item.userName} highlight={keyword} />
                    <span className={styles["chat-time"]}>{dayjs(item.actionTime).format('HH:mm:ss')}</span>
                  </span>
                  <pre onClick={() => setVideoCurrentTime(item.actionTime)}>
                    <HighlightText
                      text={item.description.replace(/(TEXT:|CODE:)/, '')}
                      highlight={keyword}
                    />
                  </pre>
                </div>
              ))}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default VideoReplayerModal
