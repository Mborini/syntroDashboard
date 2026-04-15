export function extractCoordinates(geojson: any) {
  const coords: any[] = [];

  if (!geojson?.features) return coords;

  for (const feature of geojson.features) {
    if (!feature.geometry) continue;

    const { type, coordinates } = feature.geometry;

    // LineString (route)
    if (type === "LineString") {
      coords.push(...coordinates);
    }

    // Point (bins)
    if (type === "Point") {
      coords.push(coordinates);
    }
  }

  return coords;
}