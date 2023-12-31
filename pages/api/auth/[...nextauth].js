import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const adminEmails = [
	process.env.EMAIL,
	'adilovdarin1@gmail.com',
	'nazarovabbas2@gmail.com',
	'diasqazaqbro@mail.ru',
	'nic1130.me@gmail.com',
	'krutoyBaha@bk.ru'
]

export const authOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_ID,
			clientSecret: process.env.GOOGLE_SECRET,
		}),
	],
	adapter: MongoDBAdapter(clientPromise),
	callbacks: {
		session: ({ session, token, user }) => {
			if (adminEmails.includes(session?.user?.email)) {
				return session
			} else {
				return false
			}
		},
	},
}
export default NextAuth(authOptions)

export async function isAdminRequest(req, res) {
	const session = await getServerSession(req, res, authOptions)
	if (!adminEmails.includes(session?.user?.email)) {
		res.status(401)
		res.end()
		throw 'not an admin'
	}
}
