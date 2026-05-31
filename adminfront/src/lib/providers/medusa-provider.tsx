"use client"
import { message } from "antd"
import { MedusaProvider as Provider, useMedusa } from "medusa-react"
import { PropsWithChildren, useEffect } from "react"
import { ADMIN_ACCESS_PROFILE_REFRESH_EVENT } from "../access-control"
import { BACKEND_URL } from "../constants/medusa-backend-url"
import { queryClient } from "../constants/query-client"

// Keeps the shared Medusa client authenticated and refreshes access UI after 403s.
function TokenSetter({ token }: { token?: string }) {
  const { client } = useMedusa()
  const axiosClient = (client.client as any).axiosClient

  if (token) {
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  useEffect(() => {
    const interceptor = axiosClient.interceptors.response.use(undefined, (error: any) => {
      const url = error?.config?.url ?? ''
      if (
        error?.response?.status === 403 &&
        url.startsWith('/admin/') &&
        url !== '/admin/me/access'
      ) {
        message.error('Quyền truy cập của bạn đã thay đổi. Vui lòng thử lại.')
        window.dispatchEvent(new Event(ADMIN_ACCESS_PROFILE_REFRESH_EVENT))
      }
      return Promise.reject(error)
    })

    return () => axiosClient.interceptors.response.eject(interceptor)
  }, [axiosClient])

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
