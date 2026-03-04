/**
 * Font Awesome icon mapping for all feature keys, categories, and navigation.
 * Replaces emoji icons in the UI (except map markers which keep emoji).
 * All icons are from @fortawesome/free-solid-svg-icons.
 */
import { type IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  // === 營地特性 (campsite_features) ===
  faMoneyBill,
  faMoon,
  faDog,
  faCar,
  faCalendarCheck,
  faPersonWalking,
  faTruckPickup,
  faUserTie,
  faPeopleGroup,
  faCampground,
  faHouseChimney,
  faTent,
  faSuitcase,
  faDrumstickBite,
  faFire,

  // === 營區設施 (campsite_facilities) ===
  faToilet,
  faRestroom,
  faShower,
  faTemperatureHigh,
  faPlug,
  faWifi,
  faFaucetDrip,
  faPumpSoap,
  faTrashCan,
  faRecycle,
  // laundry → faShirt
  faShirt,
  faChildReaching,
  faPersonSwimming,
  faStore,
  faChair,
  faWarehouse,
  faUtensils,
  faSquareParking,

  // === 周邊環境 (environment) ===
  faWater,
  // lake → faWater (reuse)
  // ocean_view → faWater (reuse)
  faMountain,
  faTree,
  // shaded → faTree (reuse)
  faLeaf,
  faGem,
  faSquare,
  faSun,
  faStar,
  faWandMagicSparkles,
  faHotTubPerson,
  faDroplet,
  // coral_reef → faFishFins
  faFishFins,
  faUmbrellaBeach,

  // === 可進行活動 (activities) ===
  // swimming → faPersonSwimming (imported above)
  faFish,
  faPersonHiking,
  faBicycle,
  // kayaking → faSailboat
  faSailboat,
  // rock_climbing → faHandFist
  faHandFist,
  faDove,
  faMask,
  // scuba_diving → faMask (reuse)
  // freediving → faPersonSwimming (reuse)
  // sup → faPersonSwimming (reuse)
  // surfing_available → faWater (reuse)
  // night_fishing → faMoon (reuse)
  // shore_fishing → faFish (reuse)
  faShip,
  // fly_fishing → faFish (reuse)

  // === 區域限制 (restrictions) ===
  faTruckMonster,
  faRoad,
  faVolumeXmark,
  faBan,
  faPaw,
  faClipboardList,
  faCalendarDays,
  faRuler,
  faFireFlameCurved,
  faIdCard,
  faCertificate,
  faClock,

  // === 注意事項 (warnings) ===
  faSignal,
  faMobileScreenButton,
  faBugs,
  faWorm,
  // snakes → faBugs (reuse)
  // wild_boar → faSkull
  faSkull,
  // strong_current → faWater (reuse)
  faMountainSun,
  faCloudShowersHeavy,
  // jellyfish → faBugs (reuse)

  // === Navigation ===
  faMap,
  faUser,
  faMagnifyingGlass,
  faPlus,
  faRightFromBracket,
  faArrowLeft,
  faLocationDot,
  faCircleInfo,
  faThumbsUp,
  faThumbsDown,
  faFilter,
  faXmark,
  faCheck,
  faSpinner,
  faEnvelope,
  faLock,
  faTriangleExclamation,
  faChevronDown,
  faChevronUp,
  faChevronRight,
  faEye,
} from '@fortawesome/free-solid-svg-icons'

// === Feature key → Font Awesome icon ===
export const FEATURE_ICON_MAP: Record<string, IconDefinition> = {
  // 營地特性 (campsite_features)
  free_site:            faMoneyBill,
  night_arrival:        faMoon,
  pet_friendly:         faDog,
  car_beside_tent:      faCar,
  reservation_required: faCalendarCheck,
  walk_in_ok:           faPersonWalking,
  rv_friendly:          faTruckPickup,
  managed_site:         faUserTie,
  group_site:           faPeopleGroup,
  individual_site:      faCampground,
  glamping:             faHouseChimney,
  tent_rental:          faTent,
  equipment_rental:     faSuitcase,
  bbq_allowed:          faDrumstickBite,
  campfire_allowed:     faFire,

  // 營區設施 (campsite_facilities)
  flush_toilet:   faToilet,
  squat_toilet:   faRestroom,
  shower:         faShower,
  hot_water:      faTemperatureHigh,
  power_outlet:   faPlug,
  wifi:           faWifi,
  drinking_water: faFaucetDrip,
  sink:           faPumpSoap,
  trash_bin:      faTrashCan,
  recycling:      faRecycle,
  laundry:        faShirt,
  playground:     faChildReaching,
  swimming_pool:  faPersonSwimming,
  camp_store:     faStore,
  picnic_table:   faChair,
  covered_area:   faWarehouse,
  kitchen:        faUtensils,
  parking:        faSquareParking,

  // 周邊環境 (environment)
  river_stream:      faWater,
  lake:              faWater,
  ocean_view:        faWater,
  mountain_view:     faMountain,
  forest:            faTree,
  shaded:            faTree,
  grassland:         faLeaf,
  gravel_site:       faGem,
  flat_ground:       faSquare,
  sunrise_view:      faSun,
  stargazing:        faStar,
  fireflies:         faWandMagicSparkles,
  hot_spring_nearby: faHotTubPerson,
  waterfall:         faDroplet,
  coral_reef:        faFishFins,
  sandy_beach:       faUmbrellaBeach,

  // 可進行活動 (activities)
  swimming:            faPersonSwimming,
  fishing_available:   faFish,
  hiking_trails:       faPersonHiking,
  cycling:             faBicycle,
  kayaking:            faSailboat,
  rock_climbing:       faHandFist,
  bird_watching:       faDove,
  snorkeling:          faMask,
  scuba_diving:        faMask,
  freediving:          faPersonSwimming,
  sup:                 faPersonSwimming,
  surfing_available:   faWater,
  night_fishing:       faMoon,
  shore_fishing:       faFish,
  boat_fishing:        faShip,
  fly_fishing:         faFish,

  // 區域限制 (restrictions)
  '4wd_required':      faTruckMonster,
  paved_road:          faRoad,
  no_noise_after_10:   faVolumeXmark,
  no_alcohol:          faBan,
  no_pets:             faPaw,
  permit_required:     faClipboardList,
  seasonal_access:     faCalendarDays,
  size_limit:          faRuler,
  no_campfire:         faFireFlameCurved,
  fishing_license:     faIdCard,
  dive_cert_required:  faCertificate,
  booking_essential:   faClock,

  // 注意事項 (warnings)
  no_cell_signal:      faSignal,
  limited_cell_signal: faMobileScreenButton,
  mosquitoes:          faBugs,
  leeches:             faWorm,
  snakes:              faBugs,
  wild_boar:           faSkull,
  strong_current:      faWater,
  steep_terrain:       faMountainSun,
  flash_flood_risk:    faCloudShowersHeavy,
  jellyfish:           faBugs,
}

// === Navigation icons (re-exported for convenience) ===
export const NAV_ICONS = {
  map:       faMap,
  user:      faUser,
  search:    faMagnifyingGlass,
  plus:      faPlus,
  logout:    faRightFromBracket,
  back:      faArrowLeft,
  location:  faLocationDot,
  info:      faCircleInfo,
  thumbsUp:  faThumbsUp,
  thumbsDown: faThumbsDown,
  filter:    faFilter,
  close:     faXmark,
  check:     faCheck,
  spinner:   faSpinner,
  envelope:  faEnvelope,
  lock:      faLock,
  warning:   faTriangleExclamation,
  chevronDown: faChevronDown,
  chevronUp: faChevronUp,
  chevronRight: faChevronRight,
  eye:       faEye,
} as const

// Helper to get an icon for a feature key, with fallback
export function getFeatureIcon(key: string): IconDefinition | null {
  return FEATURE_ICON_MAP[key] ?? null
}
