import GameIcon from './GameIcon'

export default function GameCard({ game, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(game.id)}
      className={`
        p-4 rounded-xl border text-left transition-colors
        ${selected
          ? 'bg-primary/10 border-primary'
          : 'bg-surface border-border hover:border-primary/50'
        }
      `}
    >
      <div className="flex items-center gap-3">
        <GameIcon game={game} className="w-12 h-12 rounded-lg" textClass="text-xl" />
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
