
import { checkAuthSession } from "../auth-fn"


export const userQueryOptions = () => ({
    queryKey: ['user'],
    queryFn: async () => {
        const data = await checkAuthSession()
        return data?.user ?? null
    }
})