# NEXUS ORACLE: Sovereign Trading Node v4.0

A high-performance, cryptographically verified trading dashboard built for sovereign asset management.

## 🚀 Core Features

- **Sovereign Identity**: Local-only Ed25519 key generation via `indexedDB`. Every trade is cryptographically signed and stored in a tamper-proof Global Ledger.
- **Lattice Trading Engine**: Event-driven order execution supporting Market, Limit, and Stop orders with sub-millisecond propagation.
- **Risk Oracle**: Real-time VaR (Value at Risk) calculation, exposure limits, and pre-trade simulation to prevent liquidation events.
- **Harmonic Synchronization**: System heartbeat synchronized at 671.6 Hz for deterministic state updates and audit consistency.
- **High-Fidelity Analytics**: Dynamic performance metrics including Sharpe Ratio, Alpha, and Max Drawdown visualization using Recharts.
- **Persistent State**: Automatic session recovery via `localStorage` and `indexedDB` for portfolio snapshots and identity verification.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Cryptography**: Web Crypto API (Ed25519, SHA-256)
- **Animation**: Motion (motion/react)
- **Icons**: Lucide React
- **Data Flow**: Custom event-driven Trade Engine with Portfolios and Risk Management layers.

## 🛡 Security & Privacy

This node is designed with a **privacy-first** architecture. All sensitive data (Private Keys, Trade Proofs, Portfolio History) is stored locally in your browser's secure sandbox. No data is ever transmitted to a central server.

---
*Build by Nexus Oracle Group • 2026*
