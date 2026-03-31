import { createServerFn } from "@tanstack/react-start";
import { getCookies } from "@tanstack/react-start/server";
import { authClient } from "./auth-client";

const DEV_AUTH_COOKIE = 'dev_auth_bypass'
const isAuthBypassEnabled = process.env.VITE_AUTH_BYPASS === 'true'

function serializeCookies(cookies: Record<string, string>): string {
    return Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')
}

export const checkAuthSession = createServerFn()
    .handler(async () => {
        const cookies = getCookies()

        if (isAuthBypassEnabled && cookies[DEV_AUTH_COOKIE] === '1') {
            return {
                user: {
                    id: 'dev-bypass-user',
                    email: process.env.VITE_DEV_LOGIN_USER || 'admin',
                    name: 'Dev Bypass User',
                },
                session: {
                    id: 'dev-bypass-session',
                },
            }
        }

        try {
            const session = await authClient.getSession({
                fetchOptions: {
                    headers: { cookie: serializeCookies(cookies) },
                },
            })

            const data = session.data
            return data
        } catch (error) {
            console.error('Failed to fetch auth session', error)
            return null
        }
    })
