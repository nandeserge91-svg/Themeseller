import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma, isDatabaseAvailable } from './db'

type Role = 'CLIENT' | 'VENDOR' | 'ADMIN'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default-secret-change-in-production'
)

const COOKIE_NAME = 'auth-token'
const TOKEN_EXPIRY = '7d'

export interface UserPayload {
  id: string
  email: string
  role: Role
  firstName?: string
  lastName?: string
}

/**
 * Hash un mot de passe
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Vérifie un mot de passe
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * Crée un JWT token
 */
export async function createToken(payload: UserPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET)
}

/**
 * Vérifie et décode un JWT token
 */
export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as UserPayload
  } catch {
    return null
  }
}

/**
 * Récupère l'utilisateur courant depuis les cookies
 */
export async function getCurrentUser(): Promise<UserPayload | null> {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  return verifyToken(token)
}

/**
 * Définit le cookie d'authentification
 */
export async function setAuthCookie(token: string) {
  const cookieStore = cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/',
  })
}

/**
 * Supprime le cookie d'authentification
 */
export async function removeAuthCookie() {
  const cookieStore = cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * Inscription d'un nouvel utilisateur
 */
export async function registerUser(data: {
  email: string
  password: string
  firstName?: string
  lastName?: string
  role?: Role
}) {
  if (!isDatabaseAvailable || !prisma) {
    throw new Error('Base de données non configurée. Veuillez configurer DATABASE_URL dans .env.local')
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    throw new Error('Un compte existe déjà avec cette adresse email')
  }

  const hashedPassword = await hashPassword(data.password)

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || 'CLIENT',
    },
  })

  return user
}

/**
 * Connexion d'un utilisateur
 */
export async function loginUser(email: string, password: string) {
  if (!isDatabaseAvailable || !prisma) {
    throw new Error('Base de données non configurée. Veuillez configurer DATABASE_URL dans .env.local')
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { vendorProfile: true },
  })

  if (!user) {
    throw new Error('Email ou mot de passe incorrect')
  }

  const isValid = await verifyPassword(password, user.password)

  if (!isValid) {
    throw new Error('Email ou mot de passe incorrect')
  }

  const payload: UserPayload = {
    id: user.id,
    email: user.email,
    role: user.role as Role,
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
  }

  const token = await createToken(payload)
  await setAuthCookie(token)

  return { user, token }
}

/**
 * Déconnexion
 */
export async function logoutUser() {
  await removeAuthCookie()
}

/**
 * Vérifie si l'utilisateur a un rôle spécifique
 */
export function hasRole(user: UserPayload | null, roles: Role[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

/**
 * Middleware de protection des routes API
 */
export async function requireAuth(roles?: Role[]): Promise<UserPayload> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Non authentifié')
  }

  if (roles && !hasRole(user, roles)) {
    throw new Error('Accès non autorisé')
  }

  return user
}

