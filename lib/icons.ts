/**
 * Font Awesome icon mapping for all feature keys, categories, and navigation.
 * Replaces emoji icons in the UI (except map markers which keep emoji).
 * All icons are from @fortawesome/free-solid-svg-icons.
 * Updated for 106-feature 6-category final definition (2026-03-05).
 */
import { type IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  // === 營地特性 (camp_traits) ===
  faMoneyBill,          // free_site
  faCalendarCheck,      // reservation_required
  faMoon,               // night_arrival
  faFire,               // campfire_allowed
  faHouseChimney,       // accommodation
  faSuitcase,           // equipment_rental
  faCartShopping,       // food_delivery
  faCampground,         // glamping
  faPeopleGroup,        // small_group_area
  faWarehouse,          // covered_area
  faCar,                // car_beside_tent / car_ok
  faPlug,               // power_outlet
  faUserTie,            // managed_site
  faBan,                // no_smoking / no_alcohol
  faVolumeXmark,        // no_loud_equipment
  faBaby,               // child_friendly
  faWheelchair,         // disability_friendly
  faDog,                // pet_friendly
  faWifi,               // wifi
  faMobileScreenButton, // mobile_signal

  // === 設施與服務 (facilities) ===
  faFaucetDrip,         // tap_water
  faDroplet,            // water_dispenser / waterfall
  faTemperatureHigh,    // hot_water
  faToilet,             // flush_toilet
  faRestroom,           // squat_toilet
  faShower,             // shower
  faBath,               // private_bathroom
  faHotTubPerson,       // hot_spring / wild_hot_spring
  faWind,               // hair_dryer
  faShirt,              // washing_machine
  faRotate,             // spin_dryer
  faPumpSoap,           // sink
  faIcicles,            // refrigerator
  faUtensils,           // shared_kitchen
  faConciergeBell,      // food_service
  faStore,              // convenience_store
  faChair,              // outdoor_seating
  faTrashCan,           // trash_bin
  faChildReaching,      // playground
  faBasketball,         // basketball_court
  faUmbrellaBeach,      // sandbox / sandy_beach
  faPersonSwimming,     // swimming_pool / swimming

  // === 周邊環境 (environment) ===
  faTree,               // shaded / forest / national_park
  faLeaf,               // grassland / nature_reserve / autumn_leaves
  faWater,              // river_stream / lake / ocean_view / river_tracing
  faMountain,           // mountain_view / high_mountain / gravel_ground
  faCloud,              // sea_of_clouds
  faBinoculars,         // panoramic_view
  faSun,                // sunrise_view
  faCity,               // night_view
  faStar,               // stargazing
  faWandMagicSparkles,  // fireflies
  faPaw,                // wildlife
  faDove,               // bird_watching
  faSeedling,           // seasonal_flowers

  // === 可進行活動 (activities) ===
  faPersonHiking,       // hiking_trails
  faBicycle,            // cycling
  faHandFist,           // rock_climbing / high_ropes
  faPersonSkiing,       // grass_sledding
  faSailboat,           // water_sports
  faFish,               // fishing
  faBullseye,           // paintball
  faLightbulb,          // sky_lantern
  faScissors,           // craft_workshop
  faMicroscope,         // ecology_tour / science_experience
  faWheatAwn,           // farm_experience
  faCow,                // ranch_experience
  faMasksTheater,       // cultural_experience
  faDrum,               // indigenous_activity

  // === 區域與限制 (restrictions) ===
  faMap,                // indigenous_area
  faClipboardList,      // permit_required
  faCalendarDays,       // seasonal_access
  faBus,                // public_transit
  faMotorcycle,         // motorcycle_ok
  faTruckPickup,        // rv_ok / trailer_ok
  faTruckMonster,       // 4wd_required
  faRoad,               // unpaved_road
  faTent,               // tent_allowed

  // === 注意事項 (warnings) ===
  faTriangleExclamation, // near_highway
  faCloudShowersHeavy,   // poor_drainage
  faMountainSun,         // steep_terrain
  faBugs,                // biting_midges / mosquitoes / snakes / bees_wasps
  faWorm,                // leeches
  faSkull,               // venomous_creatures / wild_boar

  // === Navigation ===
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
  faChevronDown,
  faChevronUp,
  faChevronRight,
  faEye,
  faList,
  faMapLocationDot,
  faHeart as faHeartSolid,
  faStar as faStarSolid,
  faCamera,
  faImage,
  faTrash,
  faCommentDots,
  faPaperPlane,
  faPenToSquare,
  faDiamondTurnRight,
  faReply,
  faFlag,
} from '@fortawesome/free-solid-svg-icons'

import {
  faHeart as faHeartRegular,
  faStar as faStarRegular,
} from '@fortawesome/free-regular-svg-icons'

// === Feature key → Font Awesome icon ===
export const FEATURE_ICON_MAP: Record<string, IconDefinition> = {
  // 1. 營地特性 (camp_traits)
  free_site:            faMoneyBill,
  reservation_required: faCalendarCheck,
  night_arrival:        faMoon,
  campfire_allowed:     faFire,
  accommodation:        faHouseChimney,
  equipment_rental:     faSuitcase,
  food_delivery:        faCartShopping,
  glamping:             faCampground,
  small_group_area:     faPeopleGroup,
  covered_area:         faWarehouse,
  car_beside_tent:      faCar,
  power_outlet:         faPlug,
  managed_site:         faUserTie,
  no_smoking:           faBan,
  no_loud_equipment:    faVolumeXmark,
  no_alcohol:           faBan,
  child_friendly:       faBaby,
  disability_friendly:  faWheelchair,
  pet_friendly:         faDog,
  wifi:                 faWifi,
  mobile_signal:        faMobileScreenButton,

  // 2. 設施與服務 (facilities)
  tap_water:          faFaucetDrip,
  water_dispenser:    faDroplet,
  hot_water:          faTemperatureHigh,
  flush_toilet:       faToilet,
  squat_toilet:       faRestroom,
  shower:             faShower,
  private_bathroom:   faBath,
  hot_spring:         faHotTubPerson,
  hair_dryer:         faWind,
  washing_machine:    faShirt,
  spin_dryer:         faRotate,
  sink:               faPumpSoap,
  refrigerator:       faIcicles,
  shared_kitchen:     faUtensils,
  food_service:       faConciergeBell,
  convenience_store:  faStore,
  outdoor_seating:    faChair,
  trash_bin:          faTrashCan,
  playground:         faChildReaching,
  basketball_court:   faBasketball,
  sandbox:            faUmbrellaBeach,
  swimming_pool:      faPersonSwimming,

  // 3. 周邊環境 (environment)
  shaded:           faTree,
  grassland:        faLeaf,
  forest:           faTree,
  river_stream:     faWater,
  lake:             faWater,
  sandy_beach:      faUmbrellaBeach,
  waterfall:        faDroplet,
  wild_hot_spring:  faHotTubPerson,
  mountain_view:    faMountain,
  ocean_view:       faWater,
  sea_of_clouds:    faCloud,
  panoramic_view:   faBinoculars,
  sunrise_view:     faSun,
  night_view:       faCity,
  stargazing:       faStar,
  fireflies:        faWandMagicSparkles,
  wildlife:         faPaw,
  bird_watching:    faDove,
  seasonal_flowers: faSeedling,
  autumn_leaves:    faLeaf,

  // 4. 可進行活動 (activities)
  hiking_trails:       faPersonHiking,
  cycling:             faBicycle,
  rock_climbing:       faHandFist,
  high_ropes:          faHandFist,
  grass_sledding:      faPersonSkiing,
  swimming:            faPersonSwimming,
  river_tracing:       faWater,
  water_sports:        faSailboat,
  fishing:             faFish,
  paintball:           faBullseye,
  sky_lantern:         faLightbulb,
  craft_workshop:      faScissors,
  ecology_tour:        faMicroscope,
  farm_experience:     faWheatAwn,
  ranch_experience:    faCow,
  science_experience:  faMicroscope,
  cultural_experience: faMasksTheater,
  indigenous_activity: faDrum,

  // 5. 區域與限制 (restrictions)
  indigenous_area:  faMap,
  high_mountain:    faMountain,
  national_park:    faTree,
  nature_reserve:   faLeaf,
  permit_required:  faClipboardList,
  seasonal_access:  faCalendarDays,
  public_transit:   faBus,
  motorcycle_ok:    faMotorcycle,
  car_ok:           faCar,
  rv_ok:            faTruckPickup,
  trailer_ok:       faTruckPickup,
  '4wd_required':   faTruckMonster,
  unpaved_road:     faRoad,
  tent_allowed:     faTent,

  // 6. 注意事項 (warnings)
  near_highway:        faTriangleExclamation,
  poor_drainage:       faCloudShowersHeavy,
  steep_terrain:       faMountainSun,
  gravel_ground:       faMountain,
  biting_midges:       faBugs,
  mosquitoes:          faBugs,
  leeches:             faWorm,
  snakes:              faBugs,
  bees_wasps:          faBugs,
  venomous_creatures:  faSkull,
  wild_boar:           faSkull,
}

// === Navigation icons (re-exported for convenience) ===
export const NAV_ICONS = {
  map:         faMap,
  user:        faUser,
  search:      faMagnifyingGlass,
  plus:        faPlus,
  logout:      faRightFromBracket,
  back:        faArrowLeft,
  location:    faLocationDot,
  info:        faCircleInfo,
  thumbsUp:    faThumbsUp,
  thumbsDown:  faThumbsDown,
  filter:      faFilter,
  close:       faXmark,
  check:       faCheck,
  spinner:     faSpinner,
  envelope:    faEnvelope,
  lock:        faLock,
  warning:     faTriangleExclamation,
  chevronDown: faChevronDown,
  chevronUp:   faChevronUp,
  chevronRight: faChevronRight,
  eye:         faEye,
  list:        faList,
  mapView:     faMapLocationDot,
  heartSolid:  faHeartSolid,
  heartRegular: faHeartRegular,
  starSolid:   faStarSolid,
  starRegular: faStarRegular,
  camera:      faCamera,
  image:       faImage,
  trash:       faTrash,
  commentDots: faCommentDots,
  send:        faPaperPlane,
  edit:        faPenToSquare,
  navigate:    faDiamondTurnRight,
  reply:       faReply,
  calendar:    faCalendarDays,
  flag:        faFlag,
} as const

// Helper to get an icon for a feature key, with fallback
export function getFeatureIcon(key: string): IconDefinition | null {
  return FEATURE_ICON_MAP[key] ?? null
}
