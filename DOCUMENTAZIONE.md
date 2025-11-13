# App Finanza di Coppia

Applicazione web per la gestione della finanza personale e di coppia, con tracciamento delle spese condivise e gestione degli investimenti.

## Caratteristiche Principali

### 1. Gestione Entrate
- Aggiunta stipendi mensili per ciascun partner
- Tracciamento storico delle entrate
- Template configurato: **2500€/mese a testa**

### 2. Gestione Spese
- Spese personali individuali
- Spese condivise con split **50/50**
- Calcolo automatico di chi deve dare soldi all'altro
- Categorizzazione delle spese (Alimentari, Affitto, Bollette, ecc.)
- Tracciamento di chi ha effettivamente pagato

### 3. Bilanciamento di Coppia
- **Dashboard finanziaria completa**
- Saldo individuale per ogni partner
- Saldo totale di coppia
- Calcolo automatico del bilanciamento delle spese condivise
- Visualizzazione chiara di chi deve dare e quanto

### 4. Investimenti
- Template configurato: **350€/mese a testa**
- **Diversificazione automatica** con allocazione percentuale:
  - 40% ETF Vanguard FTSE All-World (VWCE.DE)
  - 30% iShares Core MSCI World (SWDA.MI)
  - 20% PAC iShares Core MSCI World (IWDA.AS)
  - 10% Oro (GOLD)
- Visualizzazione grafica della diversificazione (Pie Chart)
- Calcolo automatico delle allocazioni mensili
- Tracciamento storico degli investimenti

### 5. Dati di Mercato in Tempo Reale
- Integrazione con **Alpha Vantage API**
- Prezzi aggiornati per ETF e materie prime
- Visualizzazione delle variazioni percentuali
- Funzionalità fallback con dati mock se API non configurata

## Tecnologie Utilizzate

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (better-sqlite3)
- **Grafici**: Recharts
- **Icone**: Lucide React
- **API Finanziarie**: Alpha Vantage

## Installazione

1. Installa le dipendenze:
```bash
npm install
```

2. (Opzionale) Configura la chiave API per dati di mercato reali:
```bash
cp .env.example .env
# Modifica .env e inserisci la tua chiave Alpha Vantage
```

3. Avvia il server di sviluppo:
```bash
npm run dev
```

4. Apri [http://localhost:3000](http://localhost:3000) nel browser

## Struttura del Database

### Tabella `partners`
- `id`: ID univoco
- `name`: Nome del partner
- `color`: Colore per la visualizzazione

### Tabella `income`
- `id`: ID univoco
- `partner_id`: Riferimento al partner
- `amount`: Importo dell'entrata
- `date`: Data dell'entrata
- `description`: Descrizione

### Tabella `expenses`
- `id`: ID univoco
- `partner_id`: Partner a cui appartiene la spesa
- `paid_by`: Partner che ha effettivamente pagato
- `amount`: Importo della spesa
- `date`: Data della spesa
- `category`: Categoria della spesa
- `description`: Descrizione
- `is_shared`: Flag per spese condivise (0 o 1)

### Tabella `investments`
- `id`: ID univoco
- `partner_id`: Riferimento al partner
- `amount`: Importo investito
- `date`: Data dell'investimento
- `type`: Tipo (ETF, PAC, Commodity)
- `symbol`: Simbolo del titolo
- `description`: Descrizione

### Tabella `investment_allocations`
- `id`: ID univoco
- `type`: Tipo di investimento
- `percentage`: Percentuale di allocazione
- `symbol`: Simbolo del titolo
- `name`: Nome dell'investimento
- `color`: Colore per la visualizzazione

## API Endpoints

### GET /api/partners
Restituisce la lista dei partner

### GET /api/income
Restituisce tutte le entrate

### POST /api/income
Aggiunge una nuova entrata

### DELETE /api/income?id={id}
Elimina un'entrata

### GET /api/expenses
Restituisce tutte le spese

### POST /api/expenses
Aggiunge una nuova spesa

### DELETE /api/expenses?id={id}
Elimina una spesa

### GET /api/investments
Restituisce tutti gli investimenti

### POST /api/investments
Aggiunge un nuovo investimento

### DELETE /api/investments?id={id}
Elimina un investimento

### GET /api/balance
Calcola e restituisce il bilanciamento completo

### GET /api/allocations
Restituisce le allocazioni di investimento

### GET /api/market?symbol={symbol}
Restituisce i dati di mercato per un simbolo

## Logica di Bilanciamento

### Spese Condivise (Split 50/50)
1. Ogni partner può pagare spese condivise
2. Il sistema traccia chi ha pagato effettivamente
3. Alla fine, calcola quanto ciascuno dovrebbe pagare (50% del totale)
4. Determina chi deve dare soldi all'altro per equilibrare

**Esempio:**
- Spese condivise totali: 1000€
- Partner 1 ha pagato: 700€
- Partner 2 ha pagato: 300€
- Ciascuno dovrebbe pagare: 500€
- **Risultato**: Partner 2 deve dare 200€ a Partner 1

### Calcolo del Saldo Personale
```
Saldo = Entrate - Spese Personali - (Spese Condivise / 2) - Investimenti
```

### Calcolo del Saldo di Coppia
```
Saldo Coppia = Entrate Totali - Spese Totali - Investimenti Totali
```

## Configurazione Template

L'applicazione è pre-configurata con i seguenti parametri:

- **Stipendio mensile per partner**: 2500€
- **Tipo di split**: 50/50 (non proporzionale)
- **Investimento mensile per partner**: 350€
- **Diversificazione investimenti**:
  - 40% ETF globale
  - 30% ETF mondiale
  - 20% PAC
  - 10% Oro

Questi valori possono essere modificati direttamente dall'interfaccia utente.

## Funzionalità Future

- Export dei dati in CSV/Excel
- Grafici storici di entrate/uscite
- Budget mensile con alert
- Notifiche per scadenze pagamenti
- Report mensili automatici
- Integrazione con conti bancari (Open Banking)
- App mobile (React Native)

## Sicurezza

- Database locale SQLite (non esposto pubblicamente)
- Nessun dato sensibile in chiaro
- API routes protette
- Input validation su tutti i form

## Licenza

MIT

## Supporto

Per domande o problemi, apri un issue su GitHub.
