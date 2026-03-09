// src/routes/api/users.ts
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/hello')({
    server: {
        handlers: {
            // GET /api/users
            GET: async () => {
                const users = [
                    { id: 1, name: 'Alice' },
                    { id: 2, name: 'Bob' },
                ]
                return new Response(JSON.stringify(users), {
                    headers: { 'Content-Type': 'application/json' },
                })
            },

            // POST /api/users
            POST: async ({ request }) => {
                const body = await request.json()
                // pretend we save it
                const savedUser = { id: Date.now(), ...body }

                return new Response(JSON.stringify(savedUser), {
                    headers: { 'Content-Type': 'application/json' },
                    status: 201,
                })
            },
        },
    },
})