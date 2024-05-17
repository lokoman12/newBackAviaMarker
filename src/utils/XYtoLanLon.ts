import { Position } from "@turf/turf";

export function degreesLatPerMeter(latitude: number) {
  const latRad =
    latitude * 0.01745329251994329576923690768488612713442871888541;
  let meters =
    111132.954 -
    559.822 * Math.cos(2.0 * latRad) +
    1.175 * Math.cos(4.0 * latRad);
  return 1 / meters;
}

export function degreesLonPerMeter(latitude: number) {
  const A_EARTH = 6378137.0;
  const flattening = 1.0 / 298.257223563;
  const NAV_E2 = (2.0 - flattening) * flattening;
  const deg2rad = 0.01745329251994329576923690768488612713442871888541;
  const latRad = latitude * deg2rad;
  const meters =
    (Math.PI * A_EARTH * Math.cos(latRad)) /
    (180.0 * Math.sqrt(1.0 - NAV_E2 * Math.pow(Math.sin(latRad), 2.0)));
  return 1 / meters;
}

export function flatOffsetMeterToLongitudeLatitude(
  cta: Position,
  dbX: number,
  dbY: number
): Position {
  const lonPerMeter = degreesLonPerMeter(cta[1]);
  const latPerMeter = degreesLatPerMeter(cta[1]);
  const lon = cta[0] + dbX * lonPerMeter;
  const lat = cta[1] + dbY * latPerMeter;
  return [lat, lon];
}