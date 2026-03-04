'use client'

import { useState, useEffect, useMemo } from 'react'
import { supabase, type FeatureDefinition, type FeatureGroup, FEATURE_GROUP_CONFIG } from '@/lib/supabase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { NAV_ICONS, getFeatureIcon } from '@/lib/icons'

interface Props {
  selectedFeatures: string[]
  onFeaturesChange: (ids: string[]) => void
}

export default function FeatureFilter({ selectedFeatures, onFeaturesChange }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [features, setFeatures] = useState<FeatureDefinition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeatures() {
      const { data, error } = await supabase
        .from('feature_definitions')
        .select('*')
        .order('sort_order', { ascending: true })
      if (!error && data) {
        setFeatures(data as FeatureDefinition[])
      }
      setLoading(false)
    }
    fetchFeatures()
  }, [])

  const grouped = useMemo(() => {
    const map = new globalThis.Map<FeatureGroup, FeatureDefinition[]>()
    for (const f of features) {
      const group = f.group_key
      if (!map.has(group)) map.set(group, [])
      map.get(group)!.push(f)
    }
    return map
  }, [features])

  function toggle(featureId: string) {
    if (selectedFeatures.includes(featureId)) {
      onFeaturesChange(selectedFeatures.filter(id => id !== featureId))
    } else {
      onFeaturesChange([...selectedFeatures, featureId])
    }
  }

  function clearAll() {
    onFeaturesChange([])
  }

  if (loading) return null

  return (
    <div className="absolute top-[6.5rem] left-0 right-0 z-10">
      {/* Toggle button */}
      <div className="px-3 pb-1">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors"
        >
          <FontAwesomeIcon
            icon={expanded ? NAV_ICONS.chevronDown : NAV_ICONS.chevronRight}
            className="text-xs"
          />
          <FontAwesomeIcon icon={NAV_ICONS.filter} className="text-xs" />
          <span>特性篩選</span>
          {selectedFeatures.length > 0 && (
            <span className="bg-primary text-text-on-primary text-xs rounded-full px-1.5 py-0.5 ml-1">
              {selectedFeatures.length}
            </span>
          )}
        </button>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="mx-2 bg-surface/95 backdrop-blur-sm rounded-xl shadow-lg border border-border max-h-[50vh] overflow-y-auto">
          {/* Header with clear button */}
          {selectedFeatures.length > 0 && (
            <div className="flex justify-end px-3 pt-2">
              <button
                onClick={clearAll}
                className="text-xs text-error hover:text-error/80"
              >
                清除全部
              </button>
            </div>
          )}

          {/* Feature groups */}
          <div className="p-3 space-y-3">
            {Array.from(grouped.entries()).map(([groupKey, groupFeatures]) => {
              const groupConfig = FEATURE_GROUP_CONFIG[groupKey]
              return (
                <div key={groupKey}>
                  <h4
                    className="text-xs font-semibold mb-1.5 flex items-center gap-1"
                    style={{ color: groupConfig?.color || '#666' }}
                  >
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{ backgroundColor: groupConfig?.color || '#666' }}
                    />
                    {groupConfig?.name || groupKey}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {groupFeatures.map(f => {
                      const isSelected = selectedFeatures.includes(f.id)
                      const faIcon = getFeatureIcon(f.key)
                      return (
                        <button
                          key={f.id}
                          onClick={() => toggle(f.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs border transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-primary-light/20 border-primary text-primary-dark'
                              : 'bg-surface-alt border-border text-text-secondary hover:border-primary-light'
                          }`}
                        >
                          {faIcon ? (
                            <FontAwesomeIcon icon={faIcon} className="text-[10px]" />
                          ) : (
                            <span>{f.icon}</span>
                          )}
                          <span>{f.name_zh}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
