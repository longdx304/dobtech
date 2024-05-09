import { medusaClient } from "@/lib/database/config";
import { Region } from '@medusajs/medusa';
// import { Region } from '@/types/medusa';
import { cache } from 'react';

const regionMap = new Map<string, Region>()
// Region actions
export const listRegions = cache(async function () {
  return medusaClient.regions
    .list()
    .then(({ regions }) => regions)
    .catch((err) => {
      console.log(err)
      return null
    })
})

export const getRegion = cache(async function (countryCode: string) {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }

    const regions = await listRegions()

    if (!regions) {
      return null
    }

    regions.forEach((region) => {
      region.countries.forEach((c) => {
        regionMap.set(c.iso_2, region)
      })
    })

    const region = countryCode
      ? regionMap.get(countryCode)
      : regionMap.get("us")

    return region
  } catch (e: any) {
    console.log(e.toString())
    return null
  }
})