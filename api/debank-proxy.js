export const config = {
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
        JSON.stringify({ error: 'Could not extract DeBank data' }),
        { status: 500, headers }
      );
    }

    const data = JSON.parse(match[1]);
    const portfolio = data.props?.pageProps?.portfolio;

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
```

3. Click **"Commit changes"**

---

**Option B: Via Vercel Dashboard (Faster)**

1. Go to https://vercel.com/new
2. Click **"Deploy"** (you can deploy without a repo first)
3. Skip for now - we'll use Option A with GitHub

---

### **Step 3: Deploy to Vercel**

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your `debank-proxy` repo
4. Click **"Deploy"**

✅ **That's it! Vercel will deploy automatically.**

Wait 30-60 seconds...

---

### **Step 4: Get Your API URL**

After deployment finishes:

1. You'll see: **"Congratulations! Your project has been deployed"**
2. Copy the URL, it looks like: `https://debank-proxy-xyz123.vercel.app`
3. Your API endpoint is: `https://debank-proxy-xyz123.vercel.app/api/debank-proxy`

---

### **Step 5: Test It**

Open this URL in your browser (replace with YOUR URL):
```
https://debank-proxy-xyz123.vercel.app/api/debank-proxy?address=0x7ddca859d0a6f4d9b4a4a9209e97ac0c73e454ec
```

You should see JSON with your portfolio data! 🎉

---

## 🎯 **Now Give This to Lovable**

Once your backend is working, give Lovable this simple prompt:
```
Create a DeFi portfolio dashboard that fetches data from my backend API.

API ENDPOINT: https://YOUR-VERCEL-URL.vercel.app/api/debank-proxy?address=0x7ddca859d0a6f4d9b4a4a9209e97ac0c73e454ec

The API returns:
{
  "success": true,
  "data": {
    "total_usd_value": 1898.64,
    "project_list": [
      {
        "name": "PancakeSwap V3",
        "chain": "bsc",
        "logo_url": "...",
        "portfolio_item_list": [
          {
            "name": "Liquidity Pool",
            "stats": {
              "net_usd_value": 821.89
            },
            "detail": {
              "supply_token_list": [
                {
                  "symbol": "WBNB",
                  "amount": 0.5,
                  "price": 600,
                  "logo_url": "..."
                }
              ],
              "reward_token_list": [...]
            }
          }
        ]
      }
    ]
  }
}

DASHBOARD REQUIREMENTS:

1. Fetch data from the API endpoint on load
2. Show summary cards:
   - Total Portfolio Value: data.total_usd_value
   - Number of Protocols: data.project_list.length
   - Calculate total positions from all portfolio_item_list arrays

3. For each protocol in project_list:
   - Show protocol name, logo, and chain
   - For each position in portfolio_item_list:
     - Display net_usd_value prominently
     - Show all tokens from supply_token_list with amounts and USD values
     - Show rewards from reward_token_list if present

4. Design:
   - Dark background: #0a0e27
   - Card background: #141b2d
   - Gold accent: #f59e0b
   - Green for positive: #10b981
   - Responsive grid layout (1-3 columns)

5. Features:
   - Loading skeleton while fetching
   - Error state with retry button
   - Refresh button to reload data
   - Export to CSV button

That's it! Build this dashboard using the API endpoint provided.
