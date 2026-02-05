export type CountryCapital = {
  country: string;
  capital: string;
};

import db from "@/lib/mocks/database.json"

export async function fetchCountriesAndCapitals(): Promise<CountryCapital[]> {
  const data = db.citiesDepart.map((city) => ({
    country: city.country,
    capital: city.label,
  }))

  return data.sort((a: CountryCapital, b: CountryCapital) =>
    a.capital.localeCompare(b.capital)
  )
}
