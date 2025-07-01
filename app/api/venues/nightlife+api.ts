export async function POST(request: Request) {
  // Try multiple ways to access the API key for server-side compatibility
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 
                 process.env.GOOGLE_MAPS_API_KEY ||
                 'AIzaSyA-zz2Zut_ZwVmhLwgE8o7nn9aZ90LuMso'; // Fallback to your actual key

  if (!apiKey || apiKey === 'your_actual_google_maps_api_key_here' || apiKey === 'YOUR_ACTUAL_API_KEY_HERE') {
    console.error("SERVER ERROR: The Google Maps API key is not properly configured!");
    console.error("Please follow these steps:");
    console.error("1. Go to https://console.cloud.google.com/apis/credentials");
    console.error("2. Create or get your Google Maps API key");
    console.error("3. Enable Places API (New), Maps JavaScript API, and Places API (Legacy)");
    console.error("4. Add the API key to your .env file as both EXPO_PUBLIC_GOOGLE_MAPS_API_KEY and GOOGLE_MAPS_API_KEY");
    console.error("5. Restart your development server");
    
    return Response.json({ 
      error: 'Google Maps API key not configured', 
      details: 'Please check your .env file and configure the Google Maps API key',
      setup_instructions: {
        step1: 'Go to https://console.cloud.google.com/apis/credentials',
        step2: 'Create or get your Google Maps API key',
        step3: 'Enable Places API (New), Maps JavaScript API, and Places API (Legacy)',
        step4: 'Add the API key to your .env file as both EXPO_PUBLIC_GOOGLE_MAPS_API_KEY and GOOGLE_MAPS_API_KEY',
        step5: 'Restart your development server'
      }
    }, { status: 500 });
  }

  try {
    // Parse request body
    const { location, radius, type } = await request.json();
    
    // Validate required parameters
    if (!location || !location.lat || !location.lng) {
      return Response.json({ 
        error: 'Invalid location parameters', 
        details: 'Location with lat and lng is required' 
      }, { status: 400 });
    }

    const latitude = location.lat;
    const longitude = location.lng;
    const searchRadius = radius || 5000;
    const searchType = type || 'restaurant';

    // Construct the Google API URL
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${searchRadius}&type=${searchType}&key=${apiKey}`;

    console.log(`[SERVER] Searching for ${searchType} venues near ${latitude},${longitude} within ${searchRadius}m`);

    const googleResponse = await fetch(googleApiUrl);
    const contentType = googleResponse.headers.get('content-type') || '';

    // Check if we got an HTML error response (usually means API key issues)
    if (!contentType.includes('application/json')) {
      const errorContent = await googleResponse.text();
      
      console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.error("!!!         GOOGLE API CONFIGURATION ERROR              !!!");
      console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.error("--- STATUS:", googleResponse.status, googleResponse.statusText);
      console.error("--- CONTENT-TYPE:", contentType);
      console.error("--- This usually means your API key is invalid or not configured properly");
      console.error("--- Please check:");
      console.error("    1. Your API key in .env file is correct");
      console.error("    2. Places API is enabled in Google Cloud Console");
      console.error("    3. Billing is enabled for your Google Cloud project");
      console.error("    4. API key restrictions allow your application");
      console.error("--- HTML ERROR RESPONSE (first 500 chars):");
      console.error(errorContent.substring(0, 500));
      console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

      return Response.json({
        error: "Google Places API configuration error",
        details: "The API key appears to be invalid or not properly configured. Please check your Google Cloud Console settings.",
        troubleshooting: {
          step1: "Verify your API key in the .env file",
          step2: "Enable Places API in Google Cloud Console",
          step3: "Enable billing for your Google Cloud project",
          step4: "Check API key restrictions",
          step5: "Restart your development server after making changes"
        },
        google_status: googleResponse.status,
        received_content_type: contentType
      }, { status: 502 });
    }

    // Check if the response was successful
    if (!googleResponse.ok) {
      const errorData = await googleResponse.json();
      console.error("❌ Google Places API error:", errorData);
      
      return Response.json({
        error: "Google Places API request failed",
        details: errorData.error_message || "Unknown API error",
        status: errorData.status || "UNKNOWN_ERROR",
        google_status: googleResponse.status
      }, { status: 502 });
    }

    // Parse and return the successful response
    const data = await googleResponse.json();
    
    // Check for API-level errors in the response
    if (data.status && data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error("❌ Google Places API returned error status:", data.status);
      console.error("❌ Error message:", data.error_message);
      
      return Response.json({
        error: "Google Places API error",
        details: data.error_message || `API returned status: ${data.status}`,
        status: data.status,
        google_response: data
      }, { status: 502 });
    }

    console.log(`✅ Successfully fetched ${data.results?.length || 0} ${searchType} venues`);
    return Response.json(data);

  } catch (error: any) {
    console.error("[SERVER] Critical error in nightlife API:", error);
    return Response.json({ 
      error: 'Server error while fetching venues', 
      details: error.message,
      type: 'FETCH_ERROR'
    }, { status: 500 });
  }
}

// Handle OPTIONS requests for CORS
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