import { NextResponse } from 'next/server';

export async function GET() {
  const pageId = process.env.FB_PAGE_ID;
  const systemUserToken = process.env.FB_PAGE_ACCESS_TOKEN;

  if (!pageId || !systemUserToken) {
    return NextResponse.json(
      { error: 'Facebook Page ID or Access Token is missing in environment variables.' },
      { status: 500 }
    );
  }

  try {
    // 1. Obtenir le Page Access Token
    const pageTokenRes = await fetch(
      `https://graph.facebook.com/v19.0/${pageId}?fields=access_token&access_token=${systemUserToken}`
    );
    const pageTokenData = await pageTokenRes.json();

    if (!pageTokenRes.ok || !pageTokenData.access_token) {
      return NextResponse.json(
        { error: 'Failed to retrieve Page Access Token from Meta', details: pageTokenData },
        { status: pageTokenRes.status }
      );
    }

    const pageAccessToken = pageTokenData.access_token;

    // 2. Récupérer les posts avec attachments{media} inclus
    const postsUrl = `https://graph.facebook.com/v19.0/${pageId}/posts?fields=id,message,created_time,full_picture,permalink_url,attachments{media}&limit=10&access_token=${pageAccessToken}`;

    const res = await fetch(postsUrl, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errorDetails = await res.json();
      return NextResponse.json(
        { error: 'Failed to fetch posts from Meta Graph API', details: errorDetails },
        { status: res.status }
      );
    }

    const rawData = await res.json();

    // 3. Normaliser les images et filtrer les posts complètement vides
    const formattedPosts = (rawData.data || [])
      .map((post: any) => {
        // Si full_picture est absent, chercher dans attachments
        const attachmentImg = post.attachments?.data?.[0]?.media?.image?.src;
        const imageUrl = post.full_picture || attachmentImg || null;

        return {
          id: post.id,
          message: post.message || null,
          created_time: post.created_time,
          full_picture: imageUrl,
          permalink_url: post.permalink_url,
        };
      })
      // Filtrer les posts qui n'ont ni texte ni image
      .filter((post: any) => post.message !== null || post.full_picture !== null)
      .slice(0, 6); // Conserver les 6 plus récents et valides

    return NextResponse.json({ data: formattedPosts });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error', details: (error as Error).message },
      { status: 500 }
    );
  }
}