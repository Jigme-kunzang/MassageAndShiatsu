const PLACE_ID = import.meta.env.GOOGLE_PLACE_ID;
const API_KEY = import.meta.env.GOOGLE_PLACES_API_KEY;

// NOTE — l'ancien `mapSrc` (carte Google en iframe) a été retiré :
// il publiait API_KEY en clair dans le HTML de la page contact et
// déposait des traceurs Google sans consentement. La page affiche
// désormais une image locale et un simple lien vers Maps.
// API_KEY ne sert donc plus QUE côté serveur, ci-dessous, au moment
// de la construction du site : elle ne quitte jamais la machine de build.

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