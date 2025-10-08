# Tavole di Rutilio Benincasa

![Version](https://img.shields.io/badge/version-1.0.0-yellow.svg)
![License](https://img.shields.io/badge/license-MIT-yellow.svg)

Un'applicazione web per calcolare i numeri del Lotto utilizzando il metodo storico delle **19 Tavole di Rutilio Benincasa**, astronomo e matematico cosentino del XVI secolo.

## 🎯 Caratteristiche

- **Metodo Storico Autentico**: Implementazione fedele delle 19 tavole periodiche create da Rutilio Benincasa nel 1552
- **Calcolo Automatico**: Inserisci la data dell'estrazione e ottieni i 6 numeri calcolati secondo la formula originale
- **Calendario Giuliano**: Opzione per utilizzare il calendario giuliano originale con correzione automatica dei giorni
- **Design Vintage**: Interfaccia grafica che richiama l'estetica delle antiche tavole astrologiche
- **Responsive**: Ottimizzato per desktop, tablet e mobile

## 📖 Come Funziona

Il metodo di Benincasa si basa su cicli astrali di 19 anni. Per ogni anno esiste una tavola specifica con 6 numeri per ogni mese. Il calcolo prevede:

1. Identificazione della tavola corretta in base all'anno (ciclo di 19 anni)
2. Selezione dei 6 numeri del mese corrente
3. Aggiunta di 9 + giorno dell'estrazione a ciascun numero
4. Applicazione della regola "fuori 90" (sottrai 90 se il risultato supera 90)

## 🚀 Installazione

```bash
# Clona il repository
git clone https://github.com/taphost/rutbentabs.git

# Apri index.html nel browser
```

Nessuna dipendenza esterna richiesta. L'applicazione funziona completamente lato client.

## 📁 Struttura

```
├── index.html          # Pagina principale
├── styles.css          # Stili e layout responsive
├── js/
│   ├── tavole-data.js  # Dati delle 19 tavole storiche
│   ├── calculator.js   # Logica di calcolo
│   └── animation.js    # Animazioni delle icone
└── imgs/               # Immagini decorative
```

## 🎨 Design

L'interfaccia utilizza:
- Palette colori vintage ispirata alla carta antica
- Texture paper overlay per effetto invecchiato
- Icone astrologiche animate (sole, luna, mano, uomo)
- Typography in stile stampa antica
- Effetti noise e ombre per profondità

## 📱 Compatibilità

- ✅ Chrome/Edge (consigliato)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile (iOS/Android)

## 📄 Licenza

MIT License - Sentiti libero di usare e modificare per i tuoi progetti.

## ⚠️ Disclaimer

Questo è un progetto storico-culturale che implementa un metodo del 1552. Il gioco del Lotto è un gioco d'azzardo e nessun metodo può garantire vincite. Gioca sempre responsabilmente.

## 📜 Storia

**Rutilio Benincasa** (1555-1621) fu un astronomo, matematico e astrologo italiano. Le sue tavole periodiche divennero celebri per l'applicazione ai calcoli numerici e furono utilizzate per secoli.


