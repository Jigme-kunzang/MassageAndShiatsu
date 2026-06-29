const PLACE_ID = import.meta.env.GOOGLE_PLACE_ID;
const API_KEY  = import.meta.env.GOOGLE_PLACES_API_KEY;

export async function getGoogleReviews() {
  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=fr`,
      {
        headers: {
          "X-Goog-Api-Key": API_KEY,
          "X-Goog-FieldMask":
            "displayName,rating,userRatingCount,googleMapsUri,reviews",
        },
      }
    );
    if (!res.ok) throw new Error(`Google API ${res.status}`);
    const data = await res.json();
    return {
      reviews: data.reviews ?? [],
      rating:  data.rating ?? null,
      total:   data.userRatingCount ?? 0,
      mapsUri: data.googleMapsUri ?? "#",
      errorMsg: null,
    };
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : String(e);
    return { reviews: [], rating: null, total: 0, mapsUri: "#", errorMsg };  
  }
}

export function stars(n: number = 0) {
  const full = Math.round(n);
  return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
}