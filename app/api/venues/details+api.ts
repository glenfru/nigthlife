export async function POST(request: Request) {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 
                 process.env.GOOGLE_MAPS_API_KEY ||
                 'AIzaSyA-zz2Zut_ZwVmhLwgE8o7nn9aZ90LuMso'; // Fallback to your actual key

  if (!apiKey) {
    return Response.json({ 
      error: 'Google Maps API key not configured' 
    }, { status: 500 });
  }

  try {
    const { placeId } = await request.json();
    
    if (!placeId) {
      return Response.json({ 
        error: 'Place ID is required' 
      }, { status: 400 });
    }

    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`;

    const googleResponse = await fetch(googleApiUrl);
    
    if (!googleResponse.ok) {
      return Response.json({
        error: "Google Places API request failed",
        status: googleResponse.status
      }, { status: 502 });
    }

    const data = await googleResponse.json();
    
    if (data.status !== 'OK') {
      return Response.json({
        error: "Google Places API error",
        details: data.error_message || `API returned status: ${data.status}`,
        status: data.status
      }, { status: 502 });
    }

    return Response.json(data);

  } catch (error: any) {
    console.error("[SERVER] Error in details API:", error);
    return Response.json({ 
      error: 'Server error while fetching place details', 
      details: error.message 
    }, { status: 500 });
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}