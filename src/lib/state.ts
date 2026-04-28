/**
 * state.ts — Portfolio, Risk & Performance State
 */

import { Quote, Trade } from './engine';

export interface Position {
  symbol: string;
  qty: number;
  avgPrice: number;
  currentPrice: number;
}

export interface Portfolio {
  cash: number; // in cents
  nav: number;  // in cents
  positions: Map<string, Position>;
  tradeHistory: Trade[];
}

export interface Performance {
  sharpe: number;
  maxDrawdown: number;
  winRate: number;
  dailyReturns: number[];
}

export class PortfolioManager {
  private portfolio: Portfolio;
  private peakNav: number;

  constructor(initialCash: number = 10000000) { // $100,000.00
    this.portfolio = {
      cash: initialCash,
      nav: initialCash,
      positions: new Map(),
      tradeHistory: [],
    };
    this.peakNav = initialCash;
  }

  updatePrices(quotes: Map<string, Quote>) {
    let positionValue = 0;
    this.portfolio.positions.forEach((pos, sym) => {
      const quote = quotes.get(sym);
      if (quote) {
        pos.currentPrice = quote.price;
        positionValue += pos.qty * pos.currentPrice;
      }
    });
    this.portfolio.nav = this.portfolio.cash + positionValue;
    if (this.portfolio.nav > this.peakNav) {
      this.peakNav = this.portfolio.nav;
    }
  }

  executeTrade(trade: Trade) {
    const total = trade.qty * trade.price;
    if (trade.side === 'BUY') {
      if (this.portfolio.cash < total) throw new Error('Insufficient funds');
      this.portfolio.cash -= total;
      
      const existing = this.portfolio.positions.get(trade.symbol) || {
        symbol: trade.symbol,
        qty: 0,
        avgPrice: 0,
        currentPrice: trade.price
      };
      
      const newQty = existing.qty + trade.qty;
      existing.avgPrice = Math.round((existing.avgPrice * existing.qty + total) / newQty);
      existing.qty = newQty;
      existing.currentPrice = trade.price;
      this.portfolio.positions.set(trade.symbol, existing);
    } else {
      const existing = this.portfolio.positions.get(trade.symbol);
      if (!existing || existing.qty < trade.qty) throw new Error('Insufficient shares');
      
      this.portfolio.cash += total;
      existing.qty -= trade.qty;
      if (existing.qty === 0) {
        this.portfolio.positions.delete(trade.symbol);
      } else {
        this.portfolio.positions.set(trade.symbol, existing);
      }
    }
    this.portfolio.tradeHistory.push(trade);
  }

  getSnapshot(): Portfolio {
    return {
      ...this.portfolio,
      positions: new Map(this.portfolio.positions)
    };
  }

  calculatePerformance(): Performance {
    const trades = this.portfolio.tradeHistory;
    const wins = trades.filter((t, i) => {
      // Very simplified win rate: just check if price went up from buy/sold (this is mock)
      return Math.random() > 0.4;
    }).length;

    const drawdown = this.peakNav > 0 ? (this.peakNav - this.portfolio.nav) / this.peakNav : 0;

    return {
      sharpe: 3.42, // Static mock for visual fidelity as requested
      maxDrawdown: drawdown * 100,
      winRate: trades.length > 0 ? (wins / trades.length) * 100 : 100,
      dailyReturns: []
    };
  }
}
