import Medusa from "@medusajs/medusa-js"

// Defaults to standard port for Medusa server
let BACKEND_URL = "http://13.213.42.237:9000"

if (process.env.NEXT_PUBLIC_BACKEND_URL) {
  BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
}

export const medusaClient = new Medusa({
  baseUrl: BACKEND_URL,
  maxRetries: 3,
})
