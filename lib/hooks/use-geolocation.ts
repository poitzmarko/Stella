'use client';
export function useGeolocation() {
  async function requestLocation(): Promise<{ lat: number; lon: number } | null> {
    if (!navigator.geolocation) return null;
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
      });
      return { lat: position.coords.latitude, lon: position.coords.longitude };
    } catch { return null; }
  }
  return { requestLocation };
}
