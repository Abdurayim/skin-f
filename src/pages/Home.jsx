import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import PostCard from '../components/posts/PostCard'
import Button from '../components/common/Button'
import Loader from '../components/common/Loader'
import Carousel, { MultiCarousel } from '../components/common/Carousel'
import { useLanguage } from '../hooks/useLanguage'
import { useApi } from '../hooks/useApi'
import useSound from '../hooks/useSound'
import { ENDPOINTS } from '../config/api'

export default function Home() {
  const { t } = useLanguage()
  const { get } = useApi()
  const { play } = useSound()
  const [featuredPosts, setFeaturedPosts] = useState([])
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const [postsRes, gamesRes] = await Promise.all([
        get(`${ENDPOINTS.POSTS}?limit=8`),
        get(ENDPOINTS.GAMES)
      ])

      if (postsRes.data) {
        setFeaturedPosts(postsRes.data.posts || postsRes.data)
      }
      if (gamesRes.data) {
        setGames(gamesRes.data)
      }
      setLoading(false)
    }

    fetchData()
  }, [])

  // Hero slides - actual game backgrounds
  const heroSlides = [
    {
      title: t('home.hero.slide1.title'),
      subtitle: t('home.hero.slide1.subtitle'),
      image: "https://cdn.cloudflare.steamstatic.com/apps/csgo/images/csgo_react/social/cs2.jpg",
      cta: t('home.hero.slide1.cta')
    },
    {
      title: t('home.hero.slide2.title'),
      subtitle: t('home.hero.slide2.subtitle'),
      image: "https://cdn.akamai.steamstatic.com/apps/dota2/images/dota2_social.jpg",
      cta: t('home.hero.slide2.cta')
    },
    {
      title: t('home.hero.slide3.title'),
      subtitle: t('home.hero.slide3.subtitle'),
      image: "https://cdn.cloudflare.steamstatic.com/steam/apps/578080/header.jpg",
      cta: t('home.hero.slide3.cta')
    },
    {
      title: t('home.hero.slide4.title'),
      subtitle: t('home.hero.slide4.subtitle'),
      image: "https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg?t=1671558902",
      cta: t('home.hero.slide1.cta')
    },
    {
      title: t('home.hero.slide5.title'),
      subtitle: t('home.hero.slide5.subtitle'),
      image: "https://cdn.akamai.steamstatic.com/steam/apps/440/header.jpg?t=1666823513",
      cta: t('home.hero.slide1.cta')
    },
    {
      title: t('home.hero.slide6.title'),
      subtitle: t('home.hero.slide6.subtitle'),
      image: "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg?t=1671485009",
      cta: t('home.hero.slide1.cta')
    },
    {
      title: t('home.hero.slide7.title'),
      subtitle: t('home.hero.slide7.subtitle'),
      image: "https://cdn.akamai.steamstatic.com/steam/apps/346110/header.jpg?t=1671123569",
      cta: t('home.hero.slide1.cta')
    }
  ]

  // Popular games with Steam header images
  const defaultGames = [
    { id: 'cs2', name: 'Counter-Strike 2', image: 'https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg?t=1668125812' },
    { id: 'dota2', name: 'Dota 2', image: 'https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg?t=1671595431' },
    { id: 'pubg', name: 'PUBG: Battlegrounds', image: 'https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg?t=1671617312' },
    { id: 'rust', name: 'Rust', image: 'https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg?t=1671558902' },
    { id: 'tf2', name: 'Team Fortress 2', image: 'https://cdn.akamai.steamstatic.com/steam/apps/440/header.jpg?t=1666823513' },
    { id: 'apex', name: 'Apex Legends', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg?t=1671554469' },
    { id: 'gta5', name: 'GTA V', image: 'https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg?t=1671485009' },
    { id: 'ark', name: 'ARK: Survival Evolved', image: 'https://cdn.akamai.steamstatic.com/steam/apps/346110/header.jpg?t=1671123569' },
    { id: 'rl', name: 'Rocket League', image: 'https://cdn.akamai.steamstatic.com/steam/apps/252950/header.jpg?t=1668620960' },
    { id: 'destiny', name: 'Destiny 2', image: 'https://cdn.akamai.steamstatic.com/steam/apps/1085660/header.jpg?t=1671563207' }
  ]

  return (
    <Layout>
      {/* Hero Section with Carousel */}
      <section className="relative -mt-16 lg:-mt-20 mb-0">
        <Carousel className="h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] xl:h-[700px] group">
          {heroSlides.map((slide, index) => (
            <div key={index} className="relative h-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  filter: 'brightness(0.5)'
                }}
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

              {/* Neon Accents */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary via-accent to-accent-green opacity-50" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-accent-green opacity-50" />
              </div>

              {/* Content */}
              <div className="relative h-full flex items-center py-16 sm:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                  <div className="max-w-4xl">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-3 sm:mb-4 md:mb-6 leading-tight">
                      <span className="block text-white drop-shadow-lg">{slide.title}</span>
                      <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient mt-2">
                        {t('home.hero.tradeNow')}
                      </span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 drop-shadow-lg max-w-2xl">
                      {slide.subtitle}
                    </p>

                    {/* HUGE Browse Button */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5">
                      <Link to="/posts" className="group/btn" onClick={() => play('click')}>
                        <div className="relative">
                          {/* Glow effect */}
                          <div className="absolute -inset-1 sm:-inset-2 bg-gradient-to-r from-primary to-accent rounded-xl sm:rounded-2xl blur-lg sm:blur-xl opacity-75 group-hover/btn:opacity-100 animate-pulse" />

                          {/* Button */}
                          <button className="relative px-6 sm:px-10 md:px-12 py-3 sm:py-5 md:py-6 bg-gradient-to-r from-primary to-accent text-white text-lg sm:text-xl md:text-2xl font-black rounded-xl flex items-center gap-2 sm:gap-3 md:gap-4 transform group-hover/btn:scale-105 transition-all duration-300 shadow-2xl w-full sm:w-auto justify-center">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <span className="uppercase tracking-wider text-sm sm:text-base md:text-lg">{t('home.hero.browseCta')}</span>
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover/btn:translate-x-1 sm:group-hover/btn:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </button>
                        </div>
                      </Link>

                      <Link to="/create-post" onClick={() => play('click')}>
                        <button className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-5 md:py-6 border-2 border-accent text-accent text-base sm:text-lg md:text-xl font-bold rounded-xl hover:bg-accent hover:text-background transition-all duration-300">
                          {slide.cta}
                        </button>
                      </Link>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent-green animate-pulse" />
                        <span className="text-white/80 text-xs sm:text-sm md:text-base">{t('home.hero.stats.skins')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-white/80 text-xs sm:text-sm md:text-base">{t('home.hero.stats.currency')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent animate-pulse" />
                        <span className="text-white/80 text-xs sm:text-sm md:text-base">{t('home.hero.stats.boosting')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Games Section */}
      <section className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 pt-12 pb-8 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-16 -mt-1 bg-gradient-to-b from-background via-surface/30 to-background">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-2">
              {t('home.games.title')}
            </h2>
            <p className="text-text-secondary text-lg">{t('home.games.subtitle')}</p>
          </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {(games.length > 0 ? games : defaultGames).map((game, index) => (
            <Link
              key={game.id}
              to={`/posts?game_id=${game.id}`}
              className="group block animate-fade-in-up opacity-0"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              onMouseEnter={() => play('hover')}
              onClick={() => play('click')}
            >
              <div className="relative rounded-lg sm:rounded-xl overflow-hidden border border-border/50 hover:border-primary transition-all duration-300 bg-surface/50 hover:bg-surface transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20">
                {/* Game image */}
                <div className="aspect-[460/215] overflow-hidden bg-surface-hover">
                  <img
                    src={game.image || game.icon || `https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg`}
                    alt={game.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/460x215/1a1a1a/ff3366?text=' + encodeURIComponent(game.name)
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:from-black/70" />
                </div>

                {/* Game name */}
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                  <h3 className="font-bold text-white text-xs sm:text-sm md:text-base truncate drop-shadow-lg group-hover:text-primary transition-colors">
                    {game.name}
                  </h3>
                </div>

                {/* Glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Browse All Button */}
        <div className="text-center mt-6 sm:mt-8">
          <Link to="/posts">
            <Button
              size="lg"
              glow
              className="px-8 shadow-lg shadow-primary/30 hover:shadow-primary/50"
            >
              <span>{t('common.viewAll')}</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </Link>
        </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-8 sm:py-12 lg:py-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-surface to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />

        <div className="relative w-full px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="max-w-[1600px] mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">
              Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-lg sm:text-xl text-text-secondary">Everything you need for your gaming experience</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {[
              {
                icon: '🎮',
                title: 'Game Skins',
                description: 'Buy and sell rare skins from CS2, Dota 2, and other popular games',
                color: 'from-primary to-pink-500'
              },
              {
                icon: '💰',
                title: 'In-Game Currency',
                description: 'Get gold, credits, coins and other in-game currencies at the best rates',
                color: 'from-yellow-400 to-orange-500'
              },
              {
                icon: '🚀',
                title: 'Account Boosting',
                description: 'Level up your rank with our professional boosting services',
                color: 'from-accent to-blue-500'
              },
              {
                icon: '👤',
                title: 'Game Accounts',
                description: 'Buy verified accounts with rare items and high rankings',
                color: 'from-purple-500 to-primary'
              }
            ].map((service, index) => (
              <div
                key={index}
                className="relative group animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                onMouseEnter={() => play('hover')}
              >
                <div className="relative h-full p-6 bg-surface border border-border rounded-xl hover:border-primary transition-all duration-300 overflow-hidden">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Icon */}
                  <div className={`relative w-16 h-16 mb-4 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-3xl`}>
                    {service.icon}
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-surface/50 border-y border-border">
        <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-12 lg:py-16">
          <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary flex items-center gap-3">
                <span className="w-2 h-8 sm:h-10 bg-primary rounded-full glow-red" />
                {t('home.featured.title')}
              </h2>
              <p className="text-text-secondary mt-2 text-lg">{t('home.featured.subtitle')}</p>
            </div>
            <Link
              to="/posts"
              className="text-primary hover:text-primary-hover transition-colors flex items-center gap-2 group"
            >
              {t('common.viewAll')}
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" />
            </div>
          ) : featuredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
              {featuredPosts.map((post, index) => (
                <div
                  key={post._id}
                  className="animate-fade-in-up opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 glass rounded-2xl">
              <p className="text-text-secondary">{t('posts.noPostsFound')}</p>
            </div>
          )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden py-8 sm:py-12 lg:py-16">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {t('home.whyChoose.title')} <span className="text-primary text-glow">SkinTrader</span>?
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              {t('home.whyChoose.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: t('home.features.secure.title'),
                description: t('home.features.secure.description')
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: t('home.features.fast.title'),
                description: t('home.features.fast.description')
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: t('home.features.community.title'),
                description: t('home.features.community.description')
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group relative p-6 lg:p-8 rounded-2xl bg-surface border border-border hover:border-primary/50 transition-all duration-500 card-hover"
                onMouseEnter={() => play('hover')}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:glow-red">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20" />
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-6">
              {t('home.cta.title')} <span className="text-primary text-glow">{t('home.cta.trading')}</span>?
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              {t('home.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/posts">
                <Button size="xl" glow>
                  {t('home.cta.browse')}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="xl">
                  {t('home.cta.create')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
