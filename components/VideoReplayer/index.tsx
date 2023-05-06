import { useState, useEffect, useCallback, useRef } from 'react'
import dayjs from 'dayjs'
import { filter, map, isEmpty, debounce } from 'lodash'
import { Empty, Spin, Input } from 'antd'
import { getReplayerChatHistory } from '@/api'
import Icon from '@/components/Icon'
import HighlightText from '@/components/HighlightText'
import { Utils } from '@/common/Utils'

window.HELP_IMPROVE_VIDEOJS = false


interface IReplay {
  id: string
  title: string
  roomId: string
  choseUrl: string
  startAt: string
  endAt: string
}
interface IProps {
  replay?: IReplay
  chat?: { totalNum: number; roomActionList: any[] }
}

const PlayBackRages = [0.7, 1.0, 1.5, 2.0]
const chatHistoryMap: Record<string, any> = {}

const VideoReplayerModal = (props: IProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<any>(null)
  const [chatLoading, setChatLoading] = useState(false)
  const [keyword, setKeyword] = useState('')
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

  useEffect(() => {
    getChatHistory()
  }, [getChatHistory])

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

  useEffect(() => {
    initializeVideo()
  }, [initializeVideo])

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

  // Dispose the Video.js player when the functional component unmounts
  useEffect(() => {
    return () => {
      dispose()
    }
  }, [playerRef])

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
  return (
    <div className="video-replay-wrap">
      <div className="replay-box">
        <div data-vjs-player style={{ width: '100%', height: '100%' }}>
          <video
            controls
            playsInline
            ref={videoRef}
            id="replay-video"
            className="video-js vjs-big-play-centered"
            preload="auto"
          // poster={siteConfig.logo}
          >
            <source src={props.replay?.choseUrl} type="video/mp4" />
            <p className="vjs-no-js">
              To view this video please enable JavaScript, and consider upgrading to a web browser
              that
              <a href="https://videojs.com/html5-video-support/" target="_blank">
                supports HTML5 video
              </a>
            </p>
          </video>
        </div>
      </div>
      <div className="replay-chat-history">
        <header>
          <h3>聊天记录 </h3>
          {chat?.totalNum && (
            <span className="chat-total">
              共<span>{chat?.totalNum}</span>条
            </span>
          )}
        </header>
        <main className={`${chatLoading ? 'chat-loading' : ''}`}>
          {chatLoading ? (
            <Spin spinning={chatLoading} />
          ) : isEmpty(chat?.roomActionList) ? (
            <Empty description="暂无数据" />
          ) : (
            <>
              <Input
                allowClear
                className="chat-text-search"
                width="100%"
                placeholder="请输入查询关键字!"
                suffix={<Icon symbol="icon-search" />}
                onChange={handleSearch}
                onPressEnter={(e) => {
                  const value = e.currentTarget.value.trim()
                  setKeyword(value)
                }}
              />
              {map(filterChat(), (item) => (
                <div key={item.id} className="chat-item">
                  <span className="chator">
                    <HighlightText text={item.userName} highlight={keyword} />
                    <span className="chat-time">{dayjs(item.actionTime).format('HH:mm:ss')}</span>
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
