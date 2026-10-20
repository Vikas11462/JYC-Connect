import AnnouncementCard from '../../components/announcements/AnnouncementCard'
import DemoNotice from '../../components/common/DemoNotice'
import { ANNOUNCEMENTS } from '../../data/mock'

export default function StudentAnnouncementsPage() {
  return (
    <div>
      <h1 className="section-title" style={{ fontSize: '1.6rem' }}>Announcements</h1>
      <p className="section-sub">Official updates and notices from JYC and your hubs.</p>
      <DemoNotice show />
      <div className="grid" style={{ gap: 'var(--space-4)', marginTop: 'var(--space-5)' }}>
        {ANNOUNCEMENTS.map((a) => <AnnouncementCard key={a.id} item={a} />)}
      </div>
    </div>
  )
}
