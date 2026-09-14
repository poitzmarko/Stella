export function googleMapsRouteUrl(lat: number, lon: number, label?: string) {
  const destination = `${lat},${lon}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}${label ? `&destination_place_id=${encodeURIComponent(label)}` : ''}`;
}
export function googleMapsSearchUrl(lat: number, lon: number, label: string) { return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${label} ${lat},${lon}`)}`; }
export function appleMapsRouteUrl(lat: number, lon: number) { return `https://maps.apple.com/?daddr=${lat},${lon}`; }
