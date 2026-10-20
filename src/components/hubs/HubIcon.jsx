import { Palette, Brush, Code2, BookOpen, Trophy, Briefcase, Wrench, Camera, HeartHandshake, GraduationCap, Users } from 'lucide-react'

const ICONS = { Palette, Brush, Code2, BookOpen, Trophy, Briefcase, Wrench, Camera, HeartHandshake, GraduationCap }

export default function HubIcon({ hub, size = 22 }) {
  const Icon = ICONS[hub?.icon] || Users
  return (
    <span
      className="hub-icon"
      style={{ '--hub-color': hub?.color, '--hub-tint': hub?.tint }}
      aria-hidden="true"
    >
      <Icon size={size} strokeWidth={2} />
    </span>
  )
}
