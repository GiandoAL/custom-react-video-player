import { useState, useRef } from 'react'
import * as Icons from "./assets"
const videoUrl = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
const iconSize = 20

const Icon = ({ style, src, alt, onClick }) => <img height={iconSize} {...{ src, alt, onClick }} style={{ ...{ cursor: 'pointer' }, ...style }} />

export default function App() {

  const video = useRef(null)
  const videoContainer = useRef(null)

  const [playing, setPlaying] = useState(false);
  const [mute, setMute] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentSeek, setCurrentSeek] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const timeFormatter = (sec) => {
    const parsedSec = parseFloat(sec)
    const hours = parsedSec > 3600 ? Math.trunc(parsedSec / 3600) : 0
    const minutes = Math.trunc((parsedSec - hours * 3600) / 60)
    const seconds = Math.trunc(parsedSec - minutes * 60 - hours * 3600)
    const timeFormatted = hours > 0 ? (hours + ':' + (minutes / 10 < 1 ? '0' + minutes : minutes) + ':' + (seconds / 10 < 1 ? '0' + seconds : seconds)) : ((minutes / 10 < 1 ? '0' + minutes : minutes) + ':' + (seconds / 10 < 1 ? '0' + seconds : seconds))
    return timeFormatted
  }
  console.log(video)

  return (
    <div>
      <div ref={videoContainer} style={{ height: 450, width: 800, background: 'black', position: 'relative' }}>

        <video width="100%" height="100%" controls ref={video}
          onTimeUpdate={(e) => {
            setCurrentTime(isNaN(e.target.currentTime) ? 0 : e.target.currentTime);
            setCurrentSeek(isNaN(e.target.currentTime * 100 / e.target.duration) ? 0 : e.target.currentTime * 100 / e.target.duration)
          }}>
          <source src={videoUrl} type="video/mp4" />
        </video>

          <div style={{ position: "absolute", inset: 0, background: 'rgba(255, 0, 0, .3)', display: 'flex', flexDirection: 'column' }}>

            <div style={{ flex: 1 }}></div>

            <div style={{ flex: 2 }}></div>

            <div style={{ flex: 1, margin: '0 20px' }}>
              <div style={{ background: 'white', width: '100%', height: 5, borderRadius: 5 }}>
                <div style={{ background: 'blue', width: currentSeek + '%', height: 5, borderRadius: 5 }}></div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
                <Icon
                  src={playing ? Icons.Pause : Icons.Play}
                  alt={(playing ? "pause" : "play") + "icon"}
                  onClick={() => {
                    playing ? video.current.pause() : video.current.play()
                    setPlaying(!playing)
                  }}
                />

                <Icon
                  src={mute ? Icons.Mute : Icons.Volume}
                  alt={(mute ? "mute" : "volume") + "icon"}
                  onClick={() => {
                    video.current.muted = !mute
                    setMute(!mute)
                  }}
                />

                {/* <p style={{ color: 'white', margin: 0, fontWeight: 'bold' }}>
                  {video.current ? (timeFormatter("" + currentTime) / video.current.duration ? timeFormatter(video.current.duration) : '00:00') : "00:00 / 00:00"}
                </p> */}

                <Icon
                  style={{ marginLeft: 'auto' }}
                  src={fullscreen ? Icons.ExitFullScreen : Icons.FullScreen}
                  alt={(fullscreen ? "exit fullscreen" : "fullscreen") + "icon"}
                  onClick={() => {
                    fullscreen ? document.exitFullscreen() : videoContainer.current.requestFullscreen()
                    setFullscreen(!fullscreen)
                  }}
                />
              </div>
            </div>

          </div>
      </div>
    </div>
  );
}
