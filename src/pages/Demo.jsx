import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'

const TEAM = [
  {
    name: 'Kodirbekov Bakhrombek',
    role: 'Frontend Developer',
    skills: ['React', 'Tailwind CSS', 'Vite', 'UI/UX']
  },
  {
    name: 'Sayfullaev Umarbek',
    role: 'Marketing',
    skills: ['Market Research', 'Growth Strategy', 'Content']
  },
  {
    name: 'Otajonov Imronbek',
    role: 'Finance',
    skills: ['Financial Planning', 'Business Model', 'Analytics']
  }
]

const ROADMAP = [
  { phase: 'Idea', status: 'completed', desc: 'Market research, problem validation, architecture design' },
  { phase: 'Prototype', status: 'completed', desc: 'Core features: auth, posts, messaging, KYC verification' },
  { phase: 'MVP', status: 'current', desc: 'Subscriptions, payments, admin panel, full API' },
  { phase: 'Launched', status: 'upcoming', desc: 'Public launch, mobile app, AI recommendations' }
]

const IMPLEMENTATION_STEPS = [
  {
    step: 1,
    title: 'Secure Authentication',
    desc: 'Google OAuth for seamless sign-in. JWT access/refresh tokens for multi-device sessions. No passwords to manage or leak.',
    tech: ['Google OAuth 2.0', 'JWT', 'Redis']
  },
  {
    step: 2,
    title: 'AI-Powered KYC Verification',
    desc: 'Users upload ID + selfie. AI face recognition (face-api.js / TensorFlow.js) automatically verifies identity by comparing faces. Prevents fraud and builds trust.',
    tech: ['face-api.js', 'TensorFlow.js', 'Sharp']
  },
  {
    step: 3,
    title: 'Marketplace Engine',
    desc: 'Full CRUD for game skin listings with multi-image upload, filtering, search, pagination. Real-time messaging between buyers and sellers.',
    tech: ['MongoDB Atlas', 'Multer', 'Redis Cache']
  },
  {
    step: 4,
    title: 'Subscription & Payments',
    desc: 'PayMe integration for Uzbekistan payments. Monthly subscription model for sellers. Automated billing and grace period handling.',
    tech: ['PayMe API', 'node-cron', 'Webhooks']
  },
  {
    step: 5,
    title: 'Admin Dashboard & Moderation',
    desc: 'Full admin panel with user management, KYC review, post moderation, reports handling, subscription management, and audit logs.',
    tech: ['RBAC', 'Admin Logs', 'Analytics']
  }
]

export default function Demo() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Hero */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            UzTech Hackathon 2026
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-text-primary mb-4">
            Skin<span className="text-primary">Trader</span>
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto">
            The trusted marketplace for buying and selling game skins in Uzbekistan — powered by AI verification and secure payments.
          </p>
        </div>

        {/* 1. Problem → Solution */}
        <section className="mb-16 animate-fade-in-up">
          <SectionTitle number="01" title="Muammo va Yechim" subtitle="Problem & Solution" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Muammo</h3>
              <ul className="space-y-3 text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">&#x2717;</span>
                  O'zbekistonda o'yin skinlarini xavfsiz sotib olish/sotish platformasi yo'q
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">&#x2717;</span>
                  Telegram guruhlarida firibgarlik holatlari ko'p
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">&#x2717;</span>
                  Sotuvchilarni tekshirish tizimi mavjud emas
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">&#x2717;</span>
                  Mahalliy to'lov tizimlari qo'llab-quvvatlanmaydi
                </li>
              </ul>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Yechim</h3>
              <ul className="space-y-3 text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">&#x2713;</span>
                  AI orqali shaxsni tasdiqlash (KYC) — firibgarlikni oldini oladi
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">&#x2713;</span>
                  Xavfsiz bozor: faqat tasdiqlangan foydalanuvchilar sotishi mumkin
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">&#x2713;</span>
                  PayMe orqali to'lov — mahalliy va qulay
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">&#x2713;</span>
                  Google OAuth — tez va xavfsiz kirish
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. Team */}
        <section className="mb-16 animate-fade-in-up">
          <SectionTitle number="02" title="Jamoa" subtitle="Team" />
          <div className="space-y-4">
            {TEAM.map((member, i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">{member.name[0]}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-primary">{member.name}</h3>
                  <p className="text-primary text-sm font-medium mb-2">{member.role}</p>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, j) => (
                      <span key={j} className="px-2.5 py-1 rounded-lg bg-surface-hover text-text-secondary text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                {member.link && (
                  <a
                    href={member.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-secondary hover:text-primary transition-colors"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>

        </section>

        {/* 3. Why Us */}
        <section className="mb-16 animate-fade-in-up">
          <SectionTitle number="03" title="Nima uchun biz?" subtitle="Why Us" />
          <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8">
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                  title: "To'liq ishlaydigan platforma",
                  desc: 'Backend API, Frontend, Admin panel — barchasi tayyor va ishlaydi'
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                  title: 'AI bilan xavfsizlik',
                  desc: 'Face recognition orqali KYC tasdiqlash — firibgarlarni avtomatik aniqlaydi'
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ),
                  title: "Mahalliy to'lov",
                  desc: "PayMe integratsiyasi — O'zbekiston foydalanuvchilari uchun qulay"
                },
                {
                  icon: (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  title: 'Zamonaviy texnologiyalar',
                  desc: 'React, Node.js, MongoDB, Redis, JWT, Google OAuth — eng so\'nggi texnologiyalar'
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-primary mb-1">{item.title}</h4>
                    <p className="text-text-secondary text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Roadmap */}
        <section className="mb-16 animate-fade-in-up">
          <SectionTitle number="04" title="Yo'l xaritasi" subtitle="Roadmap" />
          <div className="flex flex-col sm:flex-row gap-4">
            {ROADMAP.map((item, i) => (
              <div
                key={i}
                className={`
                  flex-1 rounded-2xl p-5 border transition-all
                  ${item.status === 'completed'
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : item.status === 'current'
                      ? 'bg-primary/5 border-primary/30 ring-2 ring-primary/20'
                      : 'bg-surface border-border opacity-60'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-2">
                  {item.status === 'completed' ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : item.status === 'current' ? (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-border" />
                  )}
                  <h4 className="font-bold text-text-primary">{item.phase}</h4>
                </div>
                <p className="text-text-secondary text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Implementation Plan */}
        <section className="mb-16 animate-fade-in-up">
          <SectionTitle number="05" title="Amalga oshirish rejasi" subtitle="Implementation Plan" />
          <div className="space-y-4">
            {IMPLEMENTATION_STEPS.map((item) => (
              <div key={item.step} className="bg-surface border border-border rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-bold">{item.step}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-text-primary mb-1">{item.title}</h4>
                    <p className="text-text-secondary text-sm mb-3">{item.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tech.map((t, j) => (
                        <span key={j} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Demo */}
        <section className="mb-16 animate-fade-in-up">
          <SectionTitle number="06" title="Demo" subtitle="Live Demo" />

          {/* Demo Videos */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Video 1 — Bizning Start-Upimiz */}
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="aspect-video bg-black">
                <video
                  className="w-full h-full"
                  controls
                >
                  <source src="https://pub-9642d4543fc44e478f9bda0ebefa61b0.r2.dev/tanishturuv.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Bizning Start-Upimiz
                </h3>
              </div>
            </div>

            {/* Video 2 — Platformamiz qanday ishlaydi? */}
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="aspect-video bg-black">
                <video
                  className="w-full h-full"
                  controls
                >
                  <source src="https://pub-9642d4543fc44e478f9bda0ebefa61b0.r2.dev/instruction.MP4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Platformamiz qanday ishlaydi?
                </h3>
              </div>
            </div>
          </div>

          {/* Prototype Link */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
            <h3 className="font-bold text-text-primary mb-2">Ishlayotgan prototip</h3>
            <p className="text-text-secondary text-sm mb-4">
              Platformaning jonli versiyasini sinab ko'ring
            </p>
            <div className="flex justify-center">
              <Link to="/">
                <button className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all glow-red-subtle">
                  Platformani ochish
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-8 border-t border-border">
          <p className="text-text-secondary text-sm">
            UzTech Hackathon 2026 &middot; SkinTrader &middot; Built with React, Node.js, MongoDB & AI
          </p>
        </div>
      </div>
    </Layout>
  )
}

function SectionTitle({ number, title, subtitle }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="text-primary/30 font-bold text-4xl">{number}</span>
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary">{title}</h2>
        <p className="text-text-secondary text-sm">{subtitle}</p>
      </div>
    </div>
  )
}
