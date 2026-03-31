
import { checkAuthSession } from "../auth-fn"


export const userQueryOptions = () => ({
    queryKey: ['user'],
    queryFn: async () => {
        const data = await checkAuthSession()
        console.log(data)
        return data?.user ?? null
    }
})