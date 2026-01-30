import { Link } from 'react-router-dom'
import Badge from '../common/Badge'
import { useLanguage } from '../../hooks/useLanguage'
import useSound from '../../hooks/useSound'
import { formatPrice, formatDate } from '../../utils/formatters'
import { getImageUrl } from '../../config/api'

export default function PostCard({ post }) {
  const { t } = useLanguage()
  const { play } = useSound()
  const typeVariants = {
    skin: 'primary',
    account: 'warning',
    item: 'success'
  }
  return (
    <Link
      to={`/posts/${post._id}`}
      className="group block relative bg-surface border border-border rounded-2xl overflow-hidden card-hover"
      onMouseEnter={() => play('hover')}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
      {/* Laser line on hover */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {/* Image Container */}
      <div className="aspect-[4/3] relative overflow-hidden">
        {post.images?.[0] ? (
          <>
            <img
              src={getImageUrl(post.images[0].thumbnailPath || post.images[0].originalPath)}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = getImageUrl(post.images[0].originalPath)
              }}
            />
            {/* Shimmer overlay */}
            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-surface-hover to-surface flex items-center justify-center">
            <svg className="w-16 h-16 text-text-secondary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        {/* Type Badge */}
        <div className="absolute top-3 left-3 z-20">
          <Badge variant={typeVariants[post.type] || 'default'} size="sm" className="backdrop-blur-sm">
            {t(`post.types.${post.type}`)}
          </Badge>
        </div>
        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 z-20">
          <div className="px-3 py-1.5 rounded-lg bg-primary shadow-lg shadow-primary/30">
            <span className="text-lg font-bold text-white">
              {formatPrice(post.price, post.currency)}
            </span>
          </div>
        </div>
        {/* View overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <span className="px-5 py-2.5 bg-white text-primary rounded-xl font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
            {t('card.viewDetails')}
          </span>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-text-primary line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-300">
          {post.title}
        </h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {post.game?.icon ? (
              <img
                src={post.game.icon}
                alt={post.game.name}
                className="w-5 h-5 rounded object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded bg-surface-hover flex items-center justify-center">
                <span className="text-xs font-bold text-text-secondary">
                  {post.game?.name?.[0]}
                </span>
              </div>
            )}
            <span className="text-sm text-text-secondary truncate max-w-[100px]">
              {post.game?.name}
            </span>
          </div>
          <span className="text-xs text-text-secondary">
            {formatDate(post.createdAt)}
          </span>
        </div>
      </div>
      {/* Bottom border glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
  )
}
