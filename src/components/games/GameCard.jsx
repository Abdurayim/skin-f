export default function GameCard({ game, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(game._id)}
      className={`
        p-4 rounded-xl border text-left transition-colors
        ${selected
          ? 'bg-primary/10 border-primary'
          : 'bg-surface border-border hover:border-primary/50'
        }
      `}
    >
      <div className="flex items-center gap-3">
        {game.icon ? (
          <img
            src={getImageUrl(game.icon)}
            alt={game.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-surface-hover flex items-center justify-center">
            <span className="text-xl font-bold text-text-secondary">
              {game.name[0]}
            </span>
          </div>
        )}
        <div>
          <h3 className="font-medium text-text-primary">{game.name}</h3>
          {game.postsCount !== undefined && (
            <p className="text-sm text-text-secondary">
              {game.postsCount} listings
            </p>
          )}
        </div>
      </div>
    </button>
  )
}
