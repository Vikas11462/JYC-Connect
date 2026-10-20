import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding JYC Connect database...')

  const passwordHash = await bcrypt.hash('Password@123', 10)

  // 1. Create Default Users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jyc.ac.in' },
    update: {},
    create: {
      email: 'admin@jyc.ac.in',
      name: 'JYC Administrator',
      passwordHash,
      role: 'ADMIN',
      rollNumber: 'FAC-ADMIN',
      department: 'Student Affairs'
    }
  })

  const coordinator = await prisma.user.upsert({
    where: { email: 'coordinator@jyc.ac.in' },
    update: {},
    create: {
      email: 'coordinator@jyc.ac.in',
      name: 'Rohan Verma',
      passwordHash,
      role: 'COORDINATOR',
      rollNumber: '221B101',
      department: 'Computer Science',
      yearOfStudy: 3
    }
  })

  const student = await prisma.user.upsert({
    where: { email: 'student@jyc.ac.in' },
    update: {},
    create: {
      email: 'student@jyc.ac.in',
      name: 'Aarav Gupta',
      passwordHash,
      role: 'STUDENT',
      rollNumber: '231B205',
      department: 'Information Technology',
      yearOfStudy: 2
    }
  })

  // 2. Seed 10 Official JYC Hubs
  const hubsData = [
    { slug: 'cultural', name: 'Cultural Hub', category: 'Creative', icon: 'Palette', color: '#db2777', tint: '#fdf2f8', tagline: 'Celebrate traditions, festivals, dance, music and campus culture.' },
    { slug: 'visual-art', name: 'Visual Art Hub', category: 'Creative', icon: 'Brush', color: '#ea580c', tint: '#fff7ed', tagline: 'Make ideas visible — sketching, painting, design, photography and craft.' },
    { slug: 'ai-coding', name: 'AI & Coding Hub', category: 'Technology', icon: 'Code2', color: '#4f46e5', tint: '#eef2ff', tagline: 'Build with code, explore AI, and solve real problems together.' },
    { slug: 'literary', name: 'Literary Hub', category: 'Creative', icon: 'BookOpen', color: '#16a34a', tint: '#f0fdf4', tagline: 'Read, write, debate, and find your voice through words.' },
    { slug: 'sports', name: 'Sports Hub', category: 'Community', icon: 'Trophy', color: '#ca8a04', tint: '#fefce8', tagline: 'Play as a team, stay active, and push your limits.' },
    { slug: 'business', name: 'Business Hub', category: 'Growth', icon: 'Briefcase', color: '#9333ea', tint: '#faf5ff', tagline: 'Turn ideas into ventures and learn how business works.' },
    { slug: 'tinkering', name: 'Tinkering Hub', category: 'Technology', icon: 'Wrench', color: '#0891b2', tint: '#ecfeff', tagline: 'Prototype, experiment, and learn by making things.' },
    { slug: 'media', name: 'Media Hub', category: 'Creative', icon: 'Camera', color: '#dc2626', tint: '#fef2f2', tagline: 'Tell campus stories through video, photo, and digital media.' },
    { slug: 'social-work', name: 'Social Work Hub', category: 'Community', icon: 'HeartHandshake', color: '#ea580c', tint: '#fff7ed', tagline: 'Create positive change through service and community action.' },
    { slug: 'alumni', name: 'Alumni Hub', category: 'Growth', icon: 'GraduationCap', color: '#0d9488', tint: '#f0fdfa', tagline: 'Connect students and graduates through mentorship and stories.' }
  ]

  for (const h of hubsData) {
    await prisma.hub.upsert({
      where: { slug: h.slug },
      update: {},
      create: h
    })
  }

  // 3. Assign Coordinator to AI & Coding Hub
  const aiHub = await prisma.hub.findUnique({ where: { slug: 'ai-coding' } })
  if (aiHub) {
    await prisma.hubCoordinator.upsert({
      where: {
        userId_hubId: {
          userId: coordinator.id,
          hubId: aiHub.id
        }
      },
      update: {},
      create: {
        userId: coordinator.id,
        hubId: aiHub.id
      }
    })
  }

  console.log('✅ Seed completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
