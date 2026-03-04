'use client'

import type { GroupedFeatures } from '@/lib/features'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getFeatureIcon } from '@/lib/icons'

interface Props {
  groups: GroupedFeatures[]
  compact?: boolean
}

/**
 * Compact feature icons display (for spot card / popup).
 * Shows only confirmed features as colored Font Awesome icons.
 */
export default function FeatureIcons({ groups, compact = true }: Props) {
  const confirmedFeatures: { key: string; icon: string; color: string; name: string }[] = []
  const pendingCount = { count: 0 }

  for (const group of groups) {
    for (const f of group.features) {
      if (f.status === 'confirmed') {
        confirmedFeatures.push({ key: f.key, icon: f.icon, color: group.color, name: f.name_zh })
      } else if (f.status === 'pending') {
        pendingCount.count++
      }
    }
  }

  if (confirmedFeatures.length === 0 && pendingCount.count === 0) {
    return <p className="text-xs text-text-secondary/60">尚無特性資料</p>
  }

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1">
        {confirmedFeatures.map((f, i) => {
          const faIcon = getFeatureIcon(f.key)
          return (
            <span
              key={i}
              title={f.name}
              className="inline-flex items-center justify-center w-6 h-6 rounded-full text-sm cursor-default"
              style={{ backgroundColor: f.color + '20', color: f.color }}
            >
              {faIcon ? (
                <FontAwesomeIcon icon={faIcon} className="text-[10px]" />
              ) : (
                f.icon
              )}
            </span>
          )
        })}
        {pendingCount.count > 0 && (
          <span className="inline-flex items-center justify-center px-1.5 h-6 rounded-full text-xs bg-surface-alt text-text-secondary/60">
            +{pendingCount.count}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {confirmedFeatures.map((f, i) => {
        const faIcon = getFeatureIcon(f.key)
        return (
          <span
            key={i}
            title={f.name}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: f.color + '15', color: f.color, border: `1px solid ${f.color}40` }}
          >
            {faIcon ? (
              <FontAwesomeIcon icon={faIcon} className="text-[10px]" />
            ) : (
              f.icon
            )}
            {f.name}
          </span>
        )
      })}
    </div>
  )
}
