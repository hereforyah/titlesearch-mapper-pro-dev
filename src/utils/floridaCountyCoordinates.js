/**
 * Geographic coordinates for Florida counties
 * Each county has a center point (latitude, longitude) and a recommended zoom level
 * These coordinates are approximate centers of each county
 */

const floridaCountyCoordinates = {
  // County coordinates with [latitude, longitude, zoom level]
  alachua: { center: [29.7938, -82.4944], zoom: 10 },
  baker: { center: [30.3293, -82.3018], zoom: 10 },
  bay: { center: [30.2690, -85.6251], zoom: 10 },
  bradford: { center: [29.9724, -82.1697], zoom: 10 },
  brevard: { center: [28.2639, -80.7214], zoom: 9 },
  broward: { center: [26.1901, -80.3659], zoom: 10 },
  calhoun: { center: [30.4033, -85.1894], zoom: 10 },
  charlotte: { center: [26.9661, -82.0784], zoom: 10 },
  citrus: { center: [28.8849, -82.5186], zoom: 10 },
  clay: { center: [29.9944, -81.7787], zoom: 10 },
  collier: { center: [26.1124, -81.4051], zoom: 9 },
  columbia: { center: [30.2233, -82.6179], zoom: 10 },
  desoto: { center: [27.1888, -81.8273], zoom: 10 },
  dixie: { center: [29.6000, -83.1568], zoom: 10 },
  duval: { center: [30.3501, -81.6035], zoom: 10 },
  escambia: { center: [30.6389, -87.3414], zoom: 10 },
  flagler: { center: [29.4086, -81.2519], zoom: 10 },
  franklin: { center: [29.8336, -84.8568], zoom: 10 },
  gadsden: { center: [30.5563, -84.6479], zoom: 10 },
  gilchrist: { center: [29.7219, -82.7973], zoom: 10 },
  glades: { center: [26.9847, -81.1859], zoom: 10 },
  gulf: { center: [29.9324, -85.2427], zoom: 10 },
  hamilton: { center: [30.4913, -82.9479], zoom: 10 },
  hardee: { center: [27.4502, -81.8224], zoom: 10 },
  hendry: { center: [26.5537, -81.3765], zoom: 10 },
  hernando: { center: [28.5579, -82.4753], zoom: 10 },
  highlands: { center: [27.3400, -81.3400], zoom: 10 },
  hillsborough: { center: [27.9904, -82.3018], zoom: 10 },
  holmes: { center: [30.8741, -85.8077], zoom: 10 },
  indianriver: { center: [27.6948, -80.5438], zoom: 10 },
  jackson: { center: [30.7151, -85.2128], zoom: 10 },
  jefferson: { center: [30.4312, -83.8897], zoom: 10 },
  lafayette: { center: [30.0241, -83.2013], zoom: 10 },
  lake: { center: [28.7028, -81.7787], zoom: 10 },
  lee: { center: [26.5537, -81.8273], zoom: 10 },
  leon: { center: [30.4906, -84.1857], zoom: 10 },
  levy: { center: [29.3179, -82.7973], zoom: 10 },
  liberty: { center: [30.2339, -84.8824], zoom: 10 },
  madison: { center: [30.4680, -83.4701], zoom: 10 },
  manatee: { center: [27.4799, -82.3452], zoom: 10 },
  marion: { center: [29.2788, -82.1278], zoom: 10 },
  martin: { center: [27.0805, -80.4104], zoom: 10 },
  'miami-dade': { center: [25.5516, -80.6327], zoom: 9 },
  monroe: { center: [24.5557, -81.7826], zoom: 9 },
  nassau: { center: [30.6190, -81.7659], zoom: 10 },
  okaloosa: { center: [30.5773, -86.6611], zoom: 10 },
  okeechobee: { center: [27.3462, -80.8987], zoom: 10 },
  orange: { center: [28.4845, -81.2518], zoom: 10 },
  osceola: { center: [28.0619, -81.0818], zoom: 10 },
  palmbeach: { center: [26.6515, -80.2767], zoom: 9 },
  pasco: { center: [28.3232, -82.4319], zoom: 10 },
  pinellas: { center: [27.8764, -82.7779], zoom: 10 },
  polk: { center: [27.9661, -81.6900], zoom: 10 },
  putnam: { center: [29.6265, -81.7787], zoom: 10 },
  stjohns: { center: [29.9719, -81.4279], zoom: 10 },
  stlucie: { center: [27.3724, -80.4420], zoom: 10 },
  santarosa: { center: [30.7690, -86.9824], zoom: 10 },
  sarasota: { center: [27.1900, -82.3452], zoom: 10 },
  seminole: { center: [28.7132, -81.2078], zoom: 10 },
  sumter: { center: [28.7132, -82.0784], zoom: 10 },
  suwannee: { center: [30.1926, -82.9979], zoom: 10 },
  taylor: { center: [30.0993, -83.6774], zoom: 10 },
  union: { center: [30.0354, -82.3690], zoom: 10 },
  volusia: { center: [29.0280, -81.0755], zoom: 10 },
  wakulla: { center: [30.0993, -84.3866], zoom: 10 },
  walton: { center: [30.5644, -86.1893], zoom: 10 },
  washington: { center: [30.5773, -85.6613], zoom: 10 },
  // Default Florida center
  florida: { center: [27.6648, -81.5158], zoom: 7 }
};

export default floridaCountyCoordinates;
