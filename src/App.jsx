import React, { useEffect, useRef, useState } from 'react'
import {
  CalendarDays,
  CalendarPlus,
  Clock,
  Gamepad2,
  MapPin,
  Menu,
  MessageCircle,
  Music2,
  Pause,
  Play,
  Share2,
  Shirt,
  Users,
} from 'lucide-react'

const EVENT_CONFIG = {
  title: 'Esther 50 años',
  subtitle: 'Fiesta retro 80s & 90s',
  day: '31 de octubre',
  year: 2026,
  startTime: '8:00 p.m.',
  location: 'Dirección del evento, Irapuato, Guanajuato',
  mapsUrl: 'https://maps.google.com/?q=Direcci%C3%B3n%20del%20evento%20Irapuato%20Guanajuato',
  whatsappUrl:
    'https://wa.me/52462XXXXXXX?text=Hola,%20confirmo%20mi%20asistencia%20al%20cumplea%C3%B1os%2050%20de%20Esther',
  dressCode: 'Retro 80s/90s',
  description: 'Fiesta de 50 años de Esther con temática retro 80s y 90s',
  highlight:
    'Prepara tu mejor outfit retro y ven a celebrar con música, luces, baile y toda la vibra de los 80s y 90s.',
}

const details = [
  { label: 'Día', value: EVENT_CONFIG.day, icon: CalendarDays },
  { label: 'Hora', value: EVENT_CONFIG.startTime, icon: Clock },
  { label: 'Lugar', value: EVENT_CONFIG.location, icon: MapPin },
  { label: 'Dress code', value: EVENT_CONFIG.dressCode, icon: Shirt },
  { label: 'Confirmar asistencia', value: 'por WhatsApp', icon: Users },
]

const AUDIO_SOURCES = [
  {
    src: '/assets/lady-hear-me-tonight.mp3',
    activeNotice: 'Lady (Hear Me Tonight) activada',
  },
  {
    src: '/assets/retro-music.mp3',
    activeNotice: 'Música retro activada',
  },
]

function escapeIcsText(value) {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

function downloadCalendarEvent() {
  const start = `${EVENT_CONFIG.year}1031T200000`
  const end = `${EVENT_CONFIG.year}1101T010000`
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//RCM CodeDev//Esther 50//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:esther-50-retro-${EVENT_CONFIG.year}@rcm-codedev`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcsText(EVENT_CONFIG.title)}`,
    `DESCRIPTION:${escapeIcsText(EVENT_CONFIG.description)}`,
    `LOCATION:${escapeIcsText(EVENT_CONFIG.location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  const blob = new Blob([icsLines.join('\r\n')], {
    type: 'text/calendar;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'esther-50-fiesta-retro.ics'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function DiscoBallImage({ intro = false, revealed = false }) {
  return (
    <div className={`disco-wrap ${intro ? 'is-intro' : ''} ${revealed ? 'is-revealed' : ''}`} aria-hidden="true">
      <span className="light-beam beam-left" />
      <span className="light-beam beam-right" />
      <span className="light-beam beam-top-left" />
      <span className="light-beam beam-top-right" />
      <span className="spark spark-a" />
      <span className="spark spark-b" />
      <span className="spark spark-c" />
      <span className="spark spark-d" />
      <img className="disco-image" src="/assets/disco-ball-real.png" alt="" />
    </div>
  )
}

function IntroScreen({ step, onAdvance }) {
  const isRevealed = step > 0

  if (isRevealed) {
    return (
      <section className="intro-screen is-revealed retro-entry" aria-label="Pantalla de entrada retro">
        <div className="scanlines" />
        <div className="entry-floor" aria-hidden="true" />
        <span className="entry-laser laser-pink" aria-hidden="true" />
        <span className="entry-laser laser-cyan" aria-hidden="true" />
        <span className="entry-laser laser-yellow" aria-hidden="true" />
        <span className="entry-laser laser-violet" aria-hidden="true" />
        <span className="entry-shape entry-shape-a" aria-hidden="true">✦</span>
        <span className="entry-shape entry-shape-b" aria-hidden="true">♪</span>
        <span className="entry-shape entry-shape-c" aria-hidden="true">✧</span>
        <span className="entry-shape entry-shape-d" aria-hidden="true">⚡</span>

        <button className="entry-poster" type="button" onClick={onAdvance} aria-label="Abrir invitación completa">
          <span className="entry-kicker">Estás invitado</span>
          <span className="entry-title" aria-label="Fiesta retro">
            <span>Fiesta</span>
            <strong>Retro</strong>
          </span>
          <span className="entry-era">80s & 90s</span>

          <DiscoBallImage intro revealed />

          <span className="entry-date">{EVENT_CONFIG.day}</span>
          <span className="entry-message">Una noche para bailar, recordar y disfrutar como antes.</span>

          <span className="entry-open">
            Abrir invitación
            <Play size={18} aria-hidden="true" />
          </span>

          <span className="cassette cassette-left" aria-hidden="true">
            <i />
            <i />
          </span>
          <span className="cassette cassette-right" aria-hidden="true">
            <i />
            <i />
          </span>
          <span className="equalizer" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, index) => (
              <i key={index} />
            ))}
          </span>
        </button>
      </section>
    )
  }

  return (
    <section className="intro-screen is-waiting" aria-label="Pantalla inicial de la invitación">
      <div className="scanlines" />
      <button
        className="intro-orb-button"
        type="button"
        onClick={onAdvance}
        aria-label="Abrir esfera disco"
      >
        <DiscoBallImage intro />
      </button>
      <p className="intro-hint">Toca la esfera</p>
    </section>
  )
}

function MusicPlayer({ isPlaying, notice, onToggle }) {
  return (
    <div className="music-player" aria-label="Control de música">
      <span className="music-led" aria-hidden="true" />
      <Music2 size={17} aria-hidden="true" />
      <span>{notice}</span>
      <button
        type="button"
        onClick={onToggle}
        className="music-toggle"
        aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
      >
        {isPlaying ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
      </button>
    </div>
  )
}

function EventDetails() {
  return (
    <div className="details-strip" aria-label="Datos del evento">
      {details.map(({ label, value, icon: Icon }) => (
        <div className="detail-pill" key={label}>
          <Icon size={17} aria-hidden="true" />
          <span>
            <small>{label}</small>
            <strong>{value}</strong>
          </span>
        </div>
      ))}
    </div>
  )
}

function getCountdownParts() {
  const target = new Date(EVENT_CONFIG.year, 9, 31, 20, 0, 0)
  const remaining = Math.max(0, target.getTime() - Date.now())
  const totalSeconds = Math.floor(remaining / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds }
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getCountdownParts)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getCountdownParts())
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  const units = [
    { label: 'Días', value: timeLeft.days },
    { label: 'Horas', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Seg', value: timeLeft.seconds },
  ]

  return (
    <div className="countdown-panel" aria-label="Cuenta regresiva para la fiesta">
      <span className="countdown-title">Cuenta regresiva</span>
      <div className="countdown-units">
        {units.map(({ label, value }) => (
          <span className="countdown-unit" key={label}>
            <strong>{String(value).padStart(2, '0')}</strong>
            <small>{label}</small>
          </span>
        ))}
      </div>
    </div>
  )
}

function PosterActions({ onCalendar, onShare, shareStatus }) {
  const actions = [
    {
      type: 'link',
      label: 'Confirmar asistencia',
      href: EVENT_CONFIG.whatsappUrl,
      icon: MessageCircle,
      className: 'poster-action-green',
      ariaLabel: 'Confirmar asistencia por WhatsApp',
    },
    {
      type: 'link',
      label: 'Ver ubicación',
      href: EVENT_CONFIG.mapsUrl,
      icon: MapPin,
      className: 'poster-action-cyan',
      ariaLabel: 'Abrir ubicación en Google Maps',
    },
    {
      type: 'button',
      label: 'Agregar al calendario',
      onClick: onCalendar,
      icon: CalendarPlus,
      className: 'poster-action-violet',
      ariaLabel: 'Descargar evento para calendario',
    },
    {
      type: 'button',
      label: 'Compartir invitación',
      onClick: onShare,
      icon: Share2,
      className: 'poster-action-yellow',
      ariaLabel: 'Compartir invitación',
    },
  ]

  const renderAction = ({ type, label, href, onClick, icon: Icon, className, ariaLabel }) =>
    type === 'link' ? (
      <a
        className={`poster-action ${className}`}
        href={href}
        key={label}
        target="_blank"
        rel="noreferrer"
        aria-label={ariaLabel}
      >
        <Icon size={18} aria-hidden="true" />
        <span>{label}</span>
      </a>
    ) : (
      <button className={`poster-action ${className}`} type="button" onClick={onClick} key={label} aria-label={ariaLabel}>
        <Icon size={18} aria-hidden="true" />
        <span>{label}</span>
      </button>
    )

  return (
    <div className="poster-actions-area">
      <div className="poster-action-stack" aria-label="Acciones de la invitación">
        {actions.map(renderAction)}
      </div>
      <p className="share-status" role="status" aria-live="polite">
        {shareStatus}
      </p>
    </div>
  )
}

function InvitationPoster({ isMusicPlaying, musicNotice, onToggleMusic, onCalendar, onShare, shareStatus }) {
  return (
    <main className="party-page final-party-page">
      <div className="scanlines" />
      <span className="final-neon-line line-left" aria-hidden="true" />
      <span className="final-neon-line line-right" aria-hidden="true" />
      <span className="final-symbol symbol-menu" aria-hidden="true"><Menu size={24} /></span>
      <span className="final-symbol symbol-music" aria-hidden="true"><Music2 size={22} /></span>
      <span className="final-symbol symbol-bolt" aria-hidden="true">⚡</span>
      <span className="final-symbol symbol-game" aria-hidden="true"><Gamepad2 size={30} /></span>
      <span className="final-symbol symbol-cassette" aria-hidden="true" />
      <span className="final-disco-small" aria-hidden="true">
        <img src="/assets/disco-ball-real.png" alt="" />
      </span>

      <section className="final-poster" aria-label="Invitación Esther 50 años">
        <header className="final-hero">
          <span className="final-pill">¡Estás invitado!</span>
          <h1>
            <em>Fiesta</em>
            <strong>Retro</strong>
            <span>80s & 90s</span>
          </h1>

          <div className="final-date-sign" aria-label={`Fecha ${EVENT_CONFIG.day}`}>
            <span>31 de octubre</span>
          </div>

          <p>{EVENT_CONFIG.highlight}</p>
        </header>

        <div className="final-details-panel">
          <EventDetails />
        </div>

        <Countdown />
        <PosterActions onCalendar={onCalendar} onShare={onShare} shareStatus={shareStatus} />

        <div className="final-boombox" aria-hidden="true">
          <span />
          <span />
          <i />
        </div>

        <MusicPlayer isPlaying={isMusicPlaying} notice={musicNotice} onToggle={onToggleMusic} />
        {/* <footer>Invitación digital desarrollada por RCM CodeDev</footer> */}
      </section>
    </main>
  )
}

export default function App() {
  const audioRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [introStep, setIntroStep] = useState(0)
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [musicNotice, setMusicNotice] = useState('Música lista')
  const [shareStatus, setShareStatus] = useState('')

  async function audioExists(src) {
    try {
      const response = await fetch(src, { method: 'HEAD', cache: 'no-store' })
      return response.ok
    } catch {
      return false
    }
  }

  async function playMusic() {
    const audio = audioRef.current
    if (!audio) return

    for (const source of AUDIO_SOURCES) {
      const exists = await audioExists(source.src)
      if (!exists) continue

      try {
        if (!audio.currentSrc.endsWith(source.src)) {
          audio.src = source.src
          audio.load()
        }

        audio.volume = 0.36
        await audio.play()
        setIsMusicPlaying(true)
        setMusicNotice(source.activeNotice)
        return
      } catch {
        continue
      }
    }

    setIsMusicPlaying(false)
    setMusicNotice('Agrega lady-hear-me-tonight.mp3 en assets')
  }

  async function handleIntroAdvance() {
    if (introStep === 0) {
      setIntroStep(1)
      await playMusic()
      return
    }

    setIsOpen(true)
  }

  async function handleToggleMusic() {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      await playMusic()
      return
    }

    audio.pause()
    setIsMusicPlaying(false)
    setMusicNotice('Música en pausa')
  }

  async function handleShare() {
    const shareData = {
      title: EVENT_CONFIG.title,
      text: `${EVENT_CONFIG.title} - ${EVENT_CONFIG.day} a las ${EVENT_CONFIG.startTime}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        setShareStatus('Invitación compartida.')
        return
      }

      await navigator.clipboard.writeText(window.location.href)
      setShareStatus('Enlace copiado al portapapeles.')
    } catch {
      setShareStatus('Copia el enlace desde la barra del navegador.')
    }
  }

  return (
    <>
      <audio ref={audioRef} loop preload="auto" />
      {!isOpen && <IntroScreen step={introStep} onAdvance={handleIntroAdvance} />}
      {isOpen && (
        <InvitationPoster
          isMusicPlaying={isMusicPlaying}
          musicNotice={musicNotice}
          onToggleMusic={handleToggleMusic}
          onCalendar={downloadCalendarEvent}
          onShare={handleShare}
          shareStatus={shareStatus}
        />
      )}
    </>
  )
}
