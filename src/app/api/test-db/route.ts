import { NextResponse } from 'next/server'
import { prisma, isDatabaseAvailable } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const dbUrl = process.env.DATABASE_URL || ''
    
    // Check 1: Is DATABASE_URL set?
    const hasDbUrl = !!dbUrl
    
    // Debug: Show first 30 chars of the URL (hiding the password)
    const urlStart = dbUrl.substring(0, 30)
    const startsWithPostgres = dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')
    
    // Check 2: Is database available according to our check?
    const dbAvailable = isDatabaseAvailable
    
    // Check 3: Can we actually connect?
    let canConnect = false
    let userCount = 0
    let errorMessage = null
    
    if (dbAvailable && prisma) {
      try {
        userCount = await prisma.user.count()
        canConnect = true
      } catch (e) {
        errorMessage = e instanceof Error ? e.message : 'Unknown error'
      }
    }
    
    return NextResponse.json({
      status: 'ok',
      checks: {
        hasDbUrl,
        dbAvailable,
        canConnect,
        userCount,
        errorMessage,
      },
      debug: {
        urlStart,
        urlLength: dbUrl.length,
        startsWithPostgres,
        firstCharCode: dbUrl.charCodeAt(0),
      },
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasJwtSecret: !!process.env.JWT_SECRET,
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}


