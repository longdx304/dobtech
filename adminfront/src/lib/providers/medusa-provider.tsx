"use client"
import { MedusaProvider as Provider, useMedusa } from "medusa-react"
import { PropsWithChildren, useRef } from "react"
import { BACKEND_URL } from "../constants/medusa-backend-url"
import { queryClient } from "../constants/query-client"

// Sets the JWT token on the Medusa axios client before children render
function TokenSetter({ token }: { token?: string }) {
  const { client } = useMedusa()
  const initialized = useRef(false)

  if (!initialized.current && token) {
    ;(client.client as any).axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    initialized.current = true
  }

  return null
}

export const MedusaProvider = ({ children, token }: PropsWithChildren<{ token?: string }>) => {
  return (
    <Provider
      queryClientProviderProps={{
        client: queryClient,
      }}
      baseUrl={BACKEND_URL}
    >
      <TokenSetter token={token} />
      {children}
    </Provider>
  )
}
