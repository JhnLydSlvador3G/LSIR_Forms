import { createServerFn } from "@tanstack/react-start";
import { getCookies } from "@tanstack/react-start/server";
import { authClient } from "./auth-client";

function serializeCookies(cookies: Record<string, string>): string {
    return Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')
}

export const checkAuthSession = createServerFn()
    .handler(async () => {
        const cookies = getCookies()
        const session = await authClient.getSession({
            fetchOptions: {
                headers: { cookie: serializeCookies(cookies) },
            },
        })

        const data = session.data
        return data
    })