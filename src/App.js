import { useRef, useState, useEffect } from 'react'

import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious'
import PauseIcon from '@material-ui/icons/Pause'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit'
import VolumeUpIcon from '@material-ui/icons/VolumeUp'
import VolumeOffIcon from '@material-ui/icons/VolumeOff'
import CircularProgress from '@material-ui/core/CircularProgress'

import Slider from '@material-ui/core/Slider'

import { withStyles, makeStyles } from '@material-ui/styles'

const initState = {
  playing: false,
  muted: true,
  fullscreen: false,
  moving: false,
  currentSeek: 0,
  currentTime: 0,
  loading: false
}

export default function App() {
  return <Player src={["http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"]} />
}

function Player({ src = [], handleNextPrevEpisode, color = "#0BA4E8", title = "Titolo anime - Episodio 1" }) {

  const video = useRef(null)
  const videoContainer = useRef(null)

  const useStyles = makeStyles({
    slider: {
      padding: "13px 0",
      height: 3,
      color: color,
      borderRadius: 2,
    }
  })
  const styles = useStyles()
  const [playing, setPlay] = useState(initState.playing)
  const [fullscreen, setFullscreen] = useState(initState.fullscreen)
  const [muted, setMuted] = useState(initState.muted)
  const [currentTime, setCurrentTime] = useState(initState.currentTime)
  const [currentSeek, setCurrentSeek] = useState(initState.currentSeek)
  const [loading, setLoading] = useState(initState.loading)
  const [moving, setMoving] = useState(initState.moving)

  const iconStyle = { height: 30, width: 30, cursor: 'pointer', color: '#FFFFFF' }

  useEffect(() => {
    initState.playing ? video.current.play() : video.current.pause()
    video.current.muted = initState.muted
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setMoving(false)
    }, 10000);
    return () => clearTimeout(timer)
  }, [moving])

  const resetPlayer = () => {
    setPlay(false)
    setCurrentTime(0)
    setCurrentSeek(0)
    setMoving(false)
    video.current.load()
  }

  useEffect(() => {
    if (video.current)
      resetPlayer()

  }, [src])

  const Loader = withStyles(() => ({
    colorPrimary: {
      color: color,

    },
  }))(CircularProgress);

  useEffect(() => {
    document.onfullscreenchange = () => setFullscreen(!fullscreen)
    return () => document.removeEventListener('fullscreenchange', () => setFullscreen(!fullscreen), true)
  }, [fullscreen])

  const handlePlayPause = () => {
    playing ? video.current.pause() : video.current.play()
    setPlay(!playing)
  }

  const handleForwardBackward = (dir) => {
    video.current.currentTime += dir * 10
  }


  const handleFullscreen = () => {
    if (fullscreen) {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen()
      }
    } else {
      if (videoContainer.current.requestFullscreen) {
        videoContainer.current.requestFullscreen()
      } else if (videoContainer.current.webkitRequestFullscreen) { /* Safari */
        videoContainer.current.webkitRequestFullscreen()
      } else if (videoContainer.current.msRequestFullscreen) { /* IE11 */
        videoContainer.current.msRequestFullscreen()
      }
    }
  }

  const handleMuted = () => {
    video.current.muted = !muted
    setMuted(!muted)

  }

  const handleSeeking = (_, val) => {
    video.current.currentTime = val * video.current.duration / 100
    setCurrentTime(val * video.current.duration / 100)
    setCurrentSeek(val)
  }

  const timeFormatter = (sec) => {
    const parsedSec = parseFloat(sec)
    const hours = parsedSec > 3600 ? Math.trunc(parsedSec / 3600) : 0
    const minutes = Math.trunc((parsedSec - hours * 3600) / 60)
    const seconds = Math.trunc(parsedSec - minutes * 60 - hours * 3600)
    const timeFormatted = hours > 0 ? (hours + ':' + (minutes / 10 < 1 ? '0' + minutes : minutes) + ':' + (seconds / 10 < 1 ? '0' + seconds : seconds)) : ((minutes / 10 < 1 ? '0' + minutes : minutes) + ':' + (seconds / 10 < 1 ? '0' + seconds : seconds))
    return timeFormatted
  }

  const handleKey = (key) => {
    switch (key) {
      case 'k':
      case 'K':
        handlePlayPause()
        setMoving(true)
        break
      case 'l':
      case 'L':
        handleForwardBackward(1)
        setMoving(true)
        break
      case 'j':
      case 'J':
        handleForwardBackward(-1)
        setMoving(true)
        break
      case 'm':
        handleMuted()
        setMoving(true)
        break
      case 'f':
        handleFullscreen()
        setMoving(true)
        break
      default:
        break
    }
  }

  return (
    <div
      style={{ height: '100%', maxHeight: 450, width: '100%', maxWidth: 800, position: 'relative' }}
      ref={videoContainer}
      onMouseEnter={() => setMoving(true)}
      onMouseMove={() => setMoving(true)}
      onKeyPress={(e) => handleKey(e.key)}>
      <video
        ref={video}
        width='100%'
        controls={false}
        onTimeUpdate={(e) => {
          setCurrentTime(isNaN(e.target.currentTime) ? 0 : e.target.currentTime);
          setCurrentSeek(isNaN(e.target.currentTime * 100 / e.target.duration) ? 0 : e.target.currentTime * 100 / e.target.duration)
        }}
        onEnded={() => setPlay(false)}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onSeeking={() => setLoading(true)}
        onClick={handlePlayPause}
        onDoubleClick={handleFullscreen}
      >
        {src.map((s, index) => (
          <source key={index} src={s} type="video/mp4" />
        ))}
      </video>
      {loading &&
        <Loader
          thickness={5}
          size={50}
          style={{
            position: 'absolute',
            top: 'calc(50% - 25px)',
            left: 'calc(50% - 25px)',
          }}
        />}
      {video.current &&
        <div
          style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'rgba(0, 0, 0, .5)', padding: 20 }}>
          {moving && <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 30 }}>
              <div
                style={{ display: 'flex', alignItems: 'center', height: 30, border: '1px solid ' + color, padding: '2px 10px', borderRadius: 10, cursor: 'pointer' }}
                onClick={() => handleNextPrevEpisode(-1)}>
                <SkipPreviousIcon style={iconStyle} />
              </div>

              <div
                style={{ display: 'flex', alignItems: 'center', height: 30, border: '1px solid ' + color, padding: '2px 10px', borderRadius: 10, cursor: 'pointer' }}
                onClick={() => handleNextPrevEpisode(1)}>

                <SkipNextIcon style={iconStyle} />
              </div>

            </div>
            <div style={{ flex: 1 }} onClick={handlePlayPause} onDoubleClick={handleFullscreen} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '100%' }}>
                <Slider
                  className={styles.slider}
                  value={currentSeek}
                  min={0}
                  max={100}
                  onChange={handleSeeking}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>

                    {playing ?
                      <PauseIcon style={iconStyle} onClick={handlePlayPause} />
                      :
                      <PlayArrowIcon style={iconStyle} onClick={handlePlayPause} />}

                    {muted ?
                      <VolumeOffIcon style={{ ...iconStyle, height: iconStyle.height - 3, width: iconStyle.width - 3 }} onClick={handleMuted} />
                      :
                      <VolumeUpIcon style={{ ...iconStyle, height: iconStyle.height - 3, width: iconStyle.width - 3 }} onClick={handleMuted} />}

                    <span style={{ color: '#FFFFFF', margin: '0 3px' }}>{timeFormatter("" + currentTime)} / {video.current.duration ? timeFormatter(video.current.duration) : '00:00'}</span>

                  </div>

                  {fullscreen ? <FullscreenExitIcon style={iconStyle} onClick={handleFullscreen} /> : <FullscreenIcon style={iconStyle} onClick={handleFullscreen} />}

                </div>
              </div>
            </div>
          </>}
        </div>}
    </div>
  )
}