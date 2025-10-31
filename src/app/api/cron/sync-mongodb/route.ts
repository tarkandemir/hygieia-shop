import { NextRequest, NextResponse } from 'next/server';

/**
 * MongoDB Sync Cron Job
 * 
 * Bu endpoint Vercel Cron tarafından çağrılır.
 * Ancak Vercel'de dosya sistemi read-only olduğu için,
 * bu endpoint sadece GitHub Actions workflow'unu tetikler.
 * 
 * Vercel cron.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/sync-mongodb",
 *     "schedule": "0 3 * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Cron secret key kontrolü
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // GitHub Actions workflow'unu tetikle
    const githubToken = process.env.GITHUB_TOKEN;
    const githubRepo = process.env.GITHUB_REPO || 'tarkandemir/hygieia-shop';

    if (!githubToken) {
      return NextResponse.json(
        { error: 'GitHub token bulunamadı' },
        { status: 500 }
      );
    }

    // GitHub Actions workflow dispatch
    const response = await fetch(
      `https://api.github.com/repos/${githubRepo}/actions/workflows/sync-mongodb.yml/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: 'main',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('GitHub Actions tetikleme hatası:', error);
      return NextResponse.json(
        { error: 'Workflow tetiklenemedi', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'MongoDB sync workflow tetiklendi',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Cron job hatası:', error);
    return NextResponse.json(
      { error: 'Bir hata oluştu', details: (error as Error).message },
      { status: 500 }
    );
  }
}

