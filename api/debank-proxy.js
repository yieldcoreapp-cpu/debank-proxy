javascriptexport const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get('address') || '0x7ddca859d0a6f4d9b4a4a9209e97ac0c73e454ec';

    const response = await fetch(`https://debank.com/profile/${address}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const html = await response.text();
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/);

    if (!match) {
      return new Response(
        JSON.stringify({ error: 'Could not extract data from DeBank' }),
        { status: 500, headers }
      );
    }

    const data = JSON.parse(match[1]);
    const portfolio = data.props?.pageProps?.portfolio;

    if (!portfolio) {
      return new Response(
        JSON.stringify({ error: 'Portfolio not found' }),
        { status: 404, headers }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: portfolio,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers }
    );
  }
}
