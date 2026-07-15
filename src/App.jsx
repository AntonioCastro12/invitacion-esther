import React, { useRef, useState } from 'react'
import {
  CalendarDays,
  CalendarPlus,
  Clock,
  MapPin,
  Music2,
  Pause,
  Play,
  Send,
  Share2,
  Shirt,
  Sparkles,
} from 'lucide-react'

const EVENT_CONFIG = {
  title: 'Esther 50 años',
  subtitle: 'Fiesta retro 80s & 90s',
  day: '31 de octubre',
  year: 2026,
  startTime: '8:00 p.m.',
  location: 'Agregar dirección editable',
  mapsUrl: 'https://maps.google.com/?q=Agregar%20direcci%C3%B3n%20editable',
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

  return (
    <section className={`intro-screen ${isRevealed ? 'is-revealed' : 'is-waiting'}`} aria-label="Pantalla inicial de la invitación">
      <div className="scanlines" />
      <button
        className="intro-orb-button"
        type="button"
        onClick={onAdvance}
        aria-label={isRevealed ? 'Entrar a la invitación' : 'Abrir esfera disco'}
      >
        <DiscoBallImage intro revealed={isRevealed} />
      </button>
      {!isRevealed && <p className="intro-hint">Toca la esfera</p>}
      <div className="intro-copy">
        <span>Estás invitado</span>
        <h1>Cumpleaños 50 de Esther</h1>
        <p>Fiesta retro 80s & 90s</p>
        <button className="primary-open" type="button" onClick={onAdvance} aria-label="Entrar a la invitación">
          <Play size={20} aria-hidden="true" />
          Toca para entrar
        </button>
      </div>
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

function ActionButtons({ onCalendar, onShare, shareStatus }) {
  const actions = [
    {
      type: 'link',
      label: 'Confirmar asistencia',
      tone: 'Reserva tu lugar',
      href: EVENT_CONFIG.whatsappUrl,
      icon: Send,
      className: 'action-hot is-primary',
      ariaLabel: 'Confirmar asistencia por WhatsApp',
    },
    {
      type: 'link',
      label: 'Ver ubicación',
      tone: 'Cómo llegar',
      href: EVENT_CONFIG.mapsUrl,
      icon: MapPin,
      className: 'action-cyan',
      ariaLabel: 'Abrir ubicación en Google Maps',
    },
    {
      type: 'button',
      label: 'Agregar al calendario',
      tone: 'Guarda la fecha',
      onClick: onCalendar,
      icon: CalendarPlus,
      className: 'action-yellow',
      ariaLabel: 'Descargar evento para calendario',
    },
    {
      type: 'button',
      label: 'Compartir',
      tone: 'Enviar invitación',
      onClick: onShare,
      icon: Share2,
      className: 'action-blue',
      ariaLabel: 'Compartir invitación',
    },
  ]

  return (
    <div className="actions-area">
      <div className="action-grid" aria-label="Acciones de la invitación">
        {actions.map(({ type, label, tone, href, onClick, icon: Icon, className, ariaLabel }) =>
          type === 'link' ? (
            <a
              className={`action-button ${className}`}
              href={href}
              key={label}
              target="_blank"
              rel="noreferrer"
              aria-label={ariaLabel}
            >
              <span className="action-orb">
                <Icon size={22} aria-hidden="true" />
              </span>
              <span className="action-copy">
                <strong>{label}</strong>
                <small>{tone}</small>
              </span>
            </a>
          ) : (
            <button
              className={`action-button ${className}`}
              type="button"
              onClick={onClick}
              key={label}
              aria-label={ariaLabel}
            >
              <span className="action-orb">
                <Icon size={22} aria-hidden="true" />
              </span>
              <span className="action-copy">
                <strong>{label}</strong>
                <small>{tone}</small>
              </span>
            </button>
          ),
        )}
      </div>
      <p className="share-status" role="status" aria-live="polite">
        {shareStatus}
      </p>
    </div>
  )
}

function InvitationPoster({ isMusicPlaying, musicNotice, onToggleMusic, onCalendar, onShare, shareStatus }) {
  return (
    <main className="party-page">
      <div className="scanlines" />
      <div className="vapor-floor" aria-hidden="true" />
      <span className="party-star star-one" aria-hidden="true">✦</span>
      <span className="party-star star-two" aria-hidden="true">✧</span>
      <span className="party-star star-three" aria-hidden="true">✦</span>

      <section className="poster-stage" aria-label="Invitación Esther 50 años">
        <MusicPlayer isPlaying={isMusicPlaying} notice={musicNotice} onToggle={onToggleMusic} />

        <div className="poster-hero">
          <div className="poster-copy">
            <p className="eyebrow">Cumpleaños retro</p>
            <h1>{EVENT_CONFIG.title}</h1>
            <p className="subtitle">{EVENT_CONFIG.subtitle}</p>
          </div>

          <DiscoBallImage />

          <div className="date-marquee" aria-label={`Fecha ${EVENT_CONFIG.day}`}>
            <span>Fecha</span>
            <strong>{EVENT_CONFIG.day}</strong>
          </div>
        </div>

        <p className="highlight">
          <Sparkles size={18} aria-hidden="true" />
          {EVENT_CONFIG.highlight}
        </p>

        <EventDetails />
        <ActionButtons onCalendar={onCalendar} onShare={onShare} shareStatus={shareStatus} />
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
