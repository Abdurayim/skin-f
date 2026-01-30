import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Neon Orbs - Subtle */}
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-primary rounded-full blur-[150px] opacity-10 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-accent rounded-full blur-[150px] opacity-10 animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-accent-green rounded-full blur-[120px] opacity-5 animate-pulse" style={{ animationDelay: '3s' }} />

        {/* Cyber Grid */}
        <div className="absolute inset-0 cyber-grid opacity-20" />

        {/* Floating Geometric Shapes - subtle for light theme */}
        <div
          className="absolute top-20 left-[10%] w-16 h-16 border border-primary/10 rotate-45 animate-float-rotate"
          style={{ animationDuration: '25s' }}
        />
        <div
          className="absolute top-[30%] right-[5%] w-20 h-20 border border-rose-200/40 rounded-full animate-float-rotate"
          style={{ animationDuration: '30s', animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-[20%] left-[5%] w-12 h-12 border border-primary/8 animate-float-rotate"
          style={{ animationDuration: '20s', animationDelay: '5s' }}
        />

        {/* Soft accent lines */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/5 to-transparent" />

        {/* Corner Accents - subtle */}
        <div className="absolute top-4 left-4 w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/20 to-transparent" />
          <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-primary/20 to-transparent" />
        </div>
        <div className="absolute top-4 right-4 w-16 h-16">
          <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-primary/20 to-transparent" />
          <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-primary/20 to-transparent" />
        </div>
        <div className="absolute bottom-4 left-4 w-16 h-16">
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/15 to-transparent" />
          <div className="absolute bottom-0 left-0 w-[1px] h-full bg-gradient-to-t from-primary/15 to-transparent" />
        </div>
        <div className="absolute bottom-4 right-4 w-16 h-16">
          <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-primary/15 to-transparent" />
          <div className="absolute bottom-0 right-0 w-[1px] h-full bg-gradient-to-t from-primary/15 to-transparent" />
        </div>
      </div>

      <Navbar />
      <main className="flex-1 relative z-10">
        {children}
      </main>
      <Footer />
    </div>
  )
}
