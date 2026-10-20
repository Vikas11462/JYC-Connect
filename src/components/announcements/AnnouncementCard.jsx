import { Megaphone } from 'lucide-react'

export default function AnnouncementCard({ item }) {
  return (
    <article className="card announce-card">
      <span className="announce-icon" aria-hidden="true"><Megaphone size={19} /></span>
      <div>
        <time dateTime={item.date}>{item.date}</time>
        <h4>{item.title}</h4>
        <p>{item.text}</p>
      </div>
    </article>
  )
}
