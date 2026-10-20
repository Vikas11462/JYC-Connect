import { UserRound } from 'lucide-react'

export default function TeamMemberCard({ member }) {
  const initials = member.placeholder ? '?' : member.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="card team-card">
      <span className="avatar" aria-hidden="true">
        {member.photo ? <img src={member.photo} alt="" /> : (member.placeholder ? <UserRound size={32} /> : initials)}
      </span>
      <div>
        <h4>{member.name}</h4>
        <span className="role">{member.role}</span>
        {member.hub && <div className="hub-aff">{member.hub}</div>}
        {member.placeholder && (
          <div className="hub-aff">Profile placeholder — pending official details</div>
        )}
      </div>
    </div>
  )
}
