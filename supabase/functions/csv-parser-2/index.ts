// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.


console.log("Hello from CSV PARSER!")

/**
 * CORS headers for cross-origin requests
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  const requestMethod = req.method;
  const requestUrl = new URL(req.url);
  console.log(`Received ${requestMethod} request to ${requestUrl}`);


  // Handle CORS preflight requests
  if (requestMethod === 'OPTIONS') {
    console.log('Handling CORS preflight request')
    return new Response('ok', { headers: corsHeaders })
  }

  // Only allow POST requests
  if (requestMethod !== 'POST') {
    console.log(`Method ${requestMethod} not allowed`)
    return new Response(
      JSON.stringify({
        error: 'Method not allowed. Use POST to submit CSV data.'
      }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/csv-parser-2' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
