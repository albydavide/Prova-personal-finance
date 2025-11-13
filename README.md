# Finanza di Coppia 💰

App web completa per la gestione della finanza personale e di coppia, con tracciamento delle spese condivise e gestione degli investimenti diversificati.

## Funzionalità Principali

- **Gestione Entrate**: Tracciamento stipendi mensili per ogni partner (template: 2500€/mese)
- **Spese Personali e Condivise**: Split 50/50 con calcolo automatico del bilanciamento
- **Dashboard Finanziaria**: Visualizzazione completa dei saldi personali e di coppia
- **Investimenti Diversificati**: Allocazione automatica su ETF, PAC e materie prime (template: 350€/mese)
- **Dati di Mercato Live**: Integrazione API per prezzi ETF e oro in tempo reale
- **Grafici Interattivi**: Visualizzazione della diversificazione del portfolio

## Quick Start

```bash
# Installa dipendenze
npm install

# Avvia il server di sviluppo
npm run dev

# Apri http://localhost:3000 nel browser
```

## Configurazione (Opzionale)

Per abilitare i dati di mercato reali:

```bash
# Copia il file .env.example
cp .env.example .env

# Ottieni una chiave API gratuita da https://www.alphavantage.co/support/#api-key
# Modifica .env e inserisci la tua chiave
```

## Template Pre-configurato

- **Stipendio mensile**: 2500€ a testa
- **Split spese condivise**: 50/50
- **Investimento mensile**: 350€ a testa
- **Diversificazione**:
  - 40% ETF Vanguard FTSE All-World
  - 30% iShares Core MSCI World
  - 20% PAC iShares Core MSCI World
  - 10% Oro

## Tecnologie

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS
- SQLite Database
- Recharts per grafici
- Alpha Vantage API

## Documentazione Completa

Vedi [DOCUMENTAZIONE.md](./DOCUMENTAZIONE.md) per dettagli completi su:
- Struttura del database
- API endpoints
- Logica di bilanciamento
- Funzionalità avanzate

## Build per Produzione

```bash
npm run build
npm start
```

## Licenza

MIT
