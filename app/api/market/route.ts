import { NextRequest, NextResponse } from 'next/server';

// API per ottenere dati di mercato
// Nota: Per usare Alpha Vantage, imposta la variabile d'ambiente ALPHA_VANTAGE_API_KEY
// Puoi ottenere una chiave gratuita su https://www.alphavantage.co/support/#api-key

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol required' }, { status: 400 });
    }

    const apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

    // Per gli ETF europei, potremmo dover adattare il simbolo
    // Alpha Vantage usa simboli americani principalmente
    let alphaSymbol = symbol;

    // Mappa alcuni simboli europei comuni
    const symbolMap: { [key: string]: string } = {
      'VWCE.DE': 'VT', // Vanguard Total World
      'SWDA.MI': 'URTH', // iShares MSCI World
      'IWDA.AS': 'URTH', // iShares MSCI World
      'GOLD': 'GLD', // Gold ETF
    };

    if (symbolMap[symbol]) {
      alphaSymbol = symbolMap[symbol];
    }

    // Ottieni quote giornaliera
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${alphaSymbol}&apikey=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data['Global Quote']) {
      const quote = data['Global Quote'];
      return NextResponse.json({
        symbol: symbol,
        name: symbol,
        price: parseFloat(quote['05. price'] || '0'),
        change: parseFloat(quote['09. change'] || '0'),
        changePercent: parseFloat((quote['10. change percent'] || '0').replace('%', '')),
      });
    }

    // Se Alpha Vantage non funziona o è demo, ritorna dati mock
    return NextResponse.json({
      symbol: symbol,
      name: symbol,
      price: 100 + Math.random() * 50,
      change: (Math.random() - 0.5) * 5,
      changePercent: (Math.random() - 0.5) * 3,
    });
  } catch (error) {
    console.error('Market data error:', error);
    // Ritorna dati mock in caso di errore
    const symbol = new URL(request.url).searchParams.get('symbol') || 'UNKNOWN';
    return NextResponse.json({
      symbol: symbol,
      name: symbol,
      price: 100 + Math.random() * 50,
      change: (Math.random() - 0.5) * 5,
      changePercent: (Math.random() - 0.5) * 3,
    });
  }
}
