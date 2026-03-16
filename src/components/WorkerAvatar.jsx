import './WorkerAvatar.css'

/**
 * Single rendering path for a worker's profile photo.
 *
 * Every circular avatar in the app — listing cards, profile page,
 * host row, similar-workers grid — must use this component so:
 *   1. The photo always comes from worker.image (single source of truth).
 *   2. If the worker hasn't uploaded a photo, we show their initials.
 *   3. Any future change (e.g. switching to a CDN URL) happens in one place.
 */
export default function WorkerAvatar({ worker, size = 68, className = '' }) {
  const initials = worker.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (worker.image) {
    return (
      <img
        src={worker.image}
        alt={worker.name}
        className={`worker-avatar ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className={`worker-avatar worker-avatar--placeholder ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  )
}
