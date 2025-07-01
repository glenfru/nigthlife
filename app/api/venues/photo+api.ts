export async function GET(request: Request) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 
                 process.env.GOOGLE_MAPS_API_KEY ||
                 'AIzaSyA-zz2Zut_ZwVmhLwgE8o7nn9aZ90LuMso'; // Fallback to your actual key

  if (!apiKey) {
    return Response.json({ 
      error: 'Google Maps API key not configured' 
    }, { status: 500 });
  }

  try {
    const url = new URL(request.url);
    const photoReference = url.searchParams.get('photoReference');
    const maxWidth = url.searchParams.get('maxWidth') || '400';
    
    if (!photoReference) {
      return Response.json({ 
        error: 'Photo reference is required' 
      }, { status: 400 });
    }

    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${apiKey}`;

    const googleResponse = await fetch(googleApiUrl);
    
    if (!googleResponse.ok) {
      return Response.json({
        error: "Google Places Photo API request failed",
        status: googleResponse.status
      }, { status: 502 });
    }

    // Return the image directly
    const imageBuffer = await googleResponse.arrayBuffer();
    const contentType = googleResponse.headers.get('content-type') || 'image/jpeg';
    
    return new Response(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });

  } catch (error: any) {
    console.error("[SERVER] Error in photo API:", error);
    return Response.json({ 
      error: 'Server error while fetching photo', 
      details: error.message 
    }, { status: 500 });
  }
}