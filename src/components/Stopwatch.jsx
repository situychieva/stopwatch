import { useRef, useState } from 'react'

function Stopwatch({ stopwatch, onDelete, onUpdate }) {
  const [intervalId, setIntervalId] = useState(null)
  const lastTimestampRef = useRef(null)

  const formatTime = (milliseconds) => {
    const totalMs = Math.floor(milliseconds)
    const hours = Math.floor(totalMs / 3600000)
    const minutes = Math.floor((totalMs % 3600000) / 60000)
    const seconds = Math.floor((totalMs % 60000) / 1000)
    const centiseconds = Math.floor((totalMs % 1000) / 10)

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
      seconds
    ).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`
  }

  const handleStart = () => {
    if (stopwatch.isRunning || intervalId) return

    onUpdate(stopwatch.id, sw => ({
      ...sw,
      isRunning: true,
      isPaused: false
    }))

    const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()
    lastTimestampRef.current = now

    const id = setInterval(() => {
      const current = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()
      const last = lastTimestampRef.current ?? current
      const delta = current - last
      lastTimestampRef.current = current

      onUpdate(stopwatch.id, sw => ({
        ...sw,
        time: sw.time + delta
      }))
    }, 10)

    setIntervalId(id)
  }

  const handlePause = () => {
    if (!intervalId) return

    clearInterval(intervalId)
    setIntervalId(null)
    lastTimestampRef.current = null

    onUpdate(stopwatch.id, sw => ({
      ...sw,
      isRunning: false,
      isPaused: true
    }))
  }

  const handleResume = () => {
    if (stopwatch.isRunning || intervalId) return

    onUpdate(stopwatch.id, sw => ({
      ...sw,
      isRunning: true,
      isPaused: false
    }))

    const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()
    lastTimestampRef.current = now

    const id = setInterval(() => {
      const current = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()
      const last = lastTimestampRef.current ?? current
      const delta = current - last
      lastTimestampRef.current = current

      onUpdate(stopwatch.id, sw => ({
        ...sw,
        time: sw.time + delta
      }))
    }, 10)

    setIntervalId(id)
  }

  const handleClear = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    lastTimestampRef.current = null

    onUpdate(stopwatch.id, sw => ({
      ...sw,
      time: 0,
      isRunning: false,
      isPaused: false
    }))
  }

  const handleDelete = () => {
    if (intervalId) {
      clearInterval(intervalId)
    }
    onDelete(stopwatch.id)
  }

  return (
    <div className="stopwatch">
      <div className="stopwatch-header">
        <div className="stopwatch-title">TIMER #{stopwatch.id}</div>
        <button className="delete-button" onClick={handleDelete}>
          DELETE
        </button>
      </div>

      <div className="display">
        <div className="time">{formatTime(stopwatch.time)}</div>
      </div>

      <div className="controls">
        {!stopwatch.isRunning && !stopwatch.isPaused && (
          <button className="control-button start-button" onClick={handleStart}>
            START
          </button>
        )}

        {stopwatch.isRunning && (
          <button className="control-button pause-button" onClick={handlePause}>
            PAUSE
          </button>
        )}

        {stopwatch.isPaused && (
          <button className="control-button resume-button" onClick={handleResume}>
            RESUME
          </button>
        )}

        {(stopwatch.isRunning || stopwatch.isPaused) && (
          <button className="control-button clear-button" onClick={handleClear}>
            CLEAR
          </button>
        )}
      </div>
    </div>
  )
}

export default Stopwatch