"""
Daily Stock Analysis Tool
Analyzes stocks using technical and fundamental indicators
Run daily to track your watchlist and identify trading opportunities
"""

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import os

# Configuration
WATCHLIST = {
    'RELIANCE.NS': 'Reliance Industries',
    'TCS.NS': 'Tata Consultancy Services',
    'INFY.NS': 'Infosys',
    'WIPRO.NS': 'Wipro',
    'MARUTI.NS': 'Maruti Suzuki',
    'SBIN.NS': 'State Bank of India',
    'HDFC.NS': 'HDFC Bank',
    'ICICIBANK.NS': 'ICICI Bank',
    'LT.NS': 'Larsen & Toubro',
    'BAJAJFINSV.NS': 'Bajaj Finserv',
}

OUTPUT_DIR = 'stock_analysis_reports'

# Create output directory if not exists
os.makedirs(OUTPUT_DIR, exist_ok=True)


class StockAnalyzer:
    """Comprehensive stock analysis tool"""
    
    def __init__(self, ticker, period='1y'):
        """Initialize analyzer for a stock"""
        self.ticker = ticker
        self.period = period
        self.data = None
        self.info = None
        self.analysis = {}
        
    def fetch_data(self):
        """Fetch historical data and stock info"""
        try:
            stock = yf.Ticker(self.ticker)
            self.data = stock.history(period=self.period)
            self.info = stock.info
            return True
        except Exception as e:
            print(f"Error fetching {self.ticker}: {e}")
            return False
    
    def calculate_technical_indicators(self):
        """Calculate technical indicators"""
        if self.data is None or len(self.data) < 30:
            return {}
        
        df = self.data.copy()
        
        # Moving Averages
        df['SMA_20'] = df['Close'].rolling(window=20).mean()
        df['SMA_50'] = df['Close'].rolling(window=50).mean()
        df['SMA_200'] = df['Close'].rolling(window=200).mean()
        df['EMA_12'] = df['Close'].ewm(span=12).mean()
        df['EMA_26'] = df['Close'].ewm(span=26).mean()
        
        # RSI (Relative Strength Index)
        delta = df['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['RSI'] = 100 - (100 / (1 + rs))
        
        # MACD
        df['MACD'] = df['EMA_12'] - df['EMA_26']
        df['Signal_Line'] = df['MACD'].ewm(span=9).mean()
        df['MACD_Histogram'] = df['MACD'] - df['Signal_Line']
        
        # Bollinger Bands
        df['BB_Mid'] = df['Close'].rolling(window=20).mean()
        bb_std = df['Close'].rolling(window=20).std()
        df['BB_Upper'] = df['BB_Mid'] + (bb_std * 2)
        df['BB_Lower'] = df['BB_Mid'] - (bb_std * 2)
        
        # ATR (Average True Range)
        df['TR'] = np.maximum(
            df['High'] - df['Low'],
            np.maximum(
                abs(df['High'] - df['Close'].shift()),
                abs(df['Low'] - df['Close'].shift())
            )
        )
        df['ATR'] = df['TR'].rolling(window=14).mean()
        
        # Volume analysis
        df['Volume_SMA'] = df['Volume'].rolling(window=20).mean()
        
        return df
    
    def calculate_fundamental_metrics(self):
        """Extract fundamental metrics"""
        metrics = {}
        
        if not self.info:
            return metrics
        
        info = self.info
        
        # Valuation metrics
        metrics['P/E Ratio'] = info.get('trailingPE', 'N/A')
        metrics['P/B Ratio'] = info.get('priceToBook', 'N/A')
        metrics['P/S Ratio'] = info.get('priceToSalesTrailing12Months', 'N/A')
        metrics['EV/EBITDA'] = info.get('enterpriseToEbitda', 'N/A')
        
        # Growth metrics
        metrics['Revenue Growth'] = info.get('revenueGrowth', 'N/A')
        metrics['Earnings Growth'] = info.get('earningsGrowth', 'N/A')
        metrics['Profit Margin'] = info.get('profitMargins', 'N/A')
        
        # Financial health
        metrics['Debt to Equity'] = info.get('debtToEquity', 'N/A')
        metrics['Current Ratio'] = info.get('currentRatio', 'N/A')
        metrics['Return on Equity'] = info.get('returnOnEquity', 'N/A')
        
        # Dividend
        metrics['Dividend Yield'] = info.get('dividendYield', 'N/A')
        
        # Market cap
        metrics['Market Cap'] = info.get('marketCap', 'N/A')
        metrics['50 Day Avg'] = info.get('fiftyDayAverage', 'N/A')
        metrics['200 Day Avg'] = info.get('twoHundredDayAverage', 'N/A')
        
        return metrics
    
    def generate_signals(self, df):
        """Generate buy/sell signals"""
        signals = {
            'Technical': [],
            'Fundamental': [],
            'Overall': 'NEUTRAL'
        }
        
        if len(df) < 1:
            return signals
        
        current = df.iloc[-1]
        
        # Technical Signals
        if pd.notna(current['RSI']):
            if current['RSI'] < 30:
                signals['Technical'].append('📊 RSI Oversold (<30) - Potential BUY')
            elif current['RSI'] > 70:
                signals['Technical'].append('📊 RSI Overbought (>70) - Potential SELL')
        
        if pd.notna(current['MACD']) and pd.notna(current['Signal_Line']):
            if current['MACD'] > current['Signal_Line']:
                signals['Technical'].append('📈 MACD Bullish (above signal line)')
            else:
                signals['Technical'].append('📉 MACD Bearish (below signal line)')
        
        if pd.notna(current['SMA_50']) and pd.notna(current['SMA_200']):
            if current['SMA_50'] > current['SMA_200']:
                signals['Technical'].append('📈 Golden Cross (50>200 SMA) - Bullish')
            else:
                signals['Technical'].append('📉 Death Cross (50<200 SMA) - Bearish')
        
        if pd.notna(current['Close']):
            if pd.notna(current['BB_Upper']) and pd.notna(current['BB_Lower']):
                if current['Close'] > current['BB_Upper']:
                    signals['Technical'].append('⚠️ Price Above Upper Bollinger Band - Overbought')
                elif current['Close'] < current['BB_Lower']:
                    signals['Technical'].append('⚠️ Price Below Lower Bollinger Band - Oversold')
        
        # Fundamental Signals
        metrics = self.calculate_fundamental_metrics()
        
        pe = metrics.get('P/E Ratio', None)
        if isinstance(pe, (int, float)) and pe > 0:
            if pe < 15:
                signals['Fundamental'].append('💚 Low P/E Ratio (<15) - Value Stock')
            elif pe > 25:
                signals['Fundamental'].append('⚠️ High P/E Ratio (>25) - Growth/Expensive')
        
        de = metrics.get('Debt to Equity', None)
        if isinstance(de, (int, float)):
            if de < 1:
                signals['Fundamental'].append('💚 Low Debt/Equity - Financially Healthy')
            elif de > 2:
                signals['Fundamental'].append('⚠️ High Debt/Equity - High Leverage Risk')
        
        # Overall signal
        buy_signals = len([s for s in signals['Technical'] + signals['Fundamental'] if 'BUY' in s.upper() or '📈' in s])
        sell_signals = len([s for s in signals['Technical'] + signals['Fundamental'] if 'SELL' in s.upper() or '📉' in s])
        
        if buy_signals > sell_signals and buy_signals > 0:
            signals['Overall'] = '🟢 BUY'
        elif sell_signals > buy_signals and sell_signals > 0:
            signals['Overall'] = '🔴 SELL'
        else:
            signals['Overall'] = '🟡 NEUTRAL/HOLD'
        
        return signals
    
    def analyze(self):
        """Run complete analysis"""
        if not self.fetch_data():
            return None
        
        df = self.calculate_technical_indicators()
        metrics = self.calculate_fundamental_metrics()
        signals = self.generate_signals(df)
        
        self.analysis = {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'current_price': self.data['Close'].iloc[-1] if len(self.data) > 0 else 'N/A',
            'metrics': metrics,
            'technical': {
                'RSI': float(df['RSI'].iloc[-1]) if pd.notna(df['RSI'].iloc[-1]) else 'N/A',
                'MACD': float(df['MACD'].iloc[-1]) if pd.notna(df['MACD'].iloc[-1]) else 'N/A',
                'SMA_20': float(df['SMA_20'].iloc[-1]) if pd.notna(df['SMA_20'].iloc[-1]) else 'N/A',
                'SMA_50': float(df['SMA_50'].iloc[-1]) if pd.notna(df['SMA_50'].iloc[-1]) else 'N/A',
                'SMA_200': float(df['SMA_200'].iloc[-1]) if pd.notna(df['SMA_200'].iloc[-1]) else 'N/A',
            },
            'signals': signals
        }
        
        return self.analysis


def analyze_watchlist():
    """Analyze all stocks in watchlist"""
    results = []
    
    print(f"\n{'='*80}")
    print(f"📊 DAILY STOCK ANALYSIS REPORT")
    print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*80}\n")
    
    for ticker, name in WATCHLIST.items():
        print(f"Analyzing {name} ({ticker})...", end=' ')
        
        analyzer = StockAnalyzer(ticker)
        analysis = analyzer.analyze()
        
        if analysis:
            print("✅")
            results.append({
                'Ticker': ticker,
                'Name': name,
                'Analysis': analysis
            })
        else:
            print("❌")
    
    # Display results
    print(f"\n{'='*80}")
    print("ANALYSIS RESULTS")
    print(f"{'='*80}\n")
    
    for result in results:
        ticker = result['Ticker']
        name = result['Name']
        analysis = result['Analysis']
        
        print(f"\n{name} ({ticker})")
        print(f"Current Price: ₹{analysis['current_price']:.2f}")
        print(f"Signal: {analysis['signals']['Overall']}")
        
        print("\n📈 Technical Indicators:")
        print(f"  RSI: {analysis['technical']['RSI']}")
        print(f"  MACD: {analysis['technical']['MACD']}")
        print(f"  SMA(20/50/200): {analysis['technical']['SMA_20']:.2f} / {analysis['technical']['SMA_50']:.2f} / {analysis['technical']['SMA_200']:.2f}")
        
        print("\n📊 Fundamentals:")
        for key, value in analysis['metrics'].items():
            if value != 'N/A':
                print(f"  {key}: {value}")
        
        print("\n🎯 Signals:")
        for signal in analysis['signals']['Technical']:
            print(f"  {signal}")
        for signal in analysis['signals']['Fundamental']:
            print(f"  {signal}")
        
        print(f"\n{'-'*80}")
    
    # Save to file
    report_file = os.path.join(OUTPUT_DIR, f"analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
    with open(report_file, 'w') as f:
        json.dump(results, f, indent=2, default=str)
    
    print(f"\n✅ Report saved to: {report_file}")
    
    return results


def add_to_watchlist(ticker, name):
    """Add stock to watchlist"""
    global WATCHLIST
    WATCHLIST[ticker] = name
    print(f"✅ Added {name} ({ticker}) to watchlist")


def remove_from_watchlist(ticker):
    """Remove stock from watchlist"""
    global WATCHLIST
    if ticker in WATCHLIST:
        del WATCHLIST[ticker]
        print(f"✅ Removed {ticker} from watchlist")


def view_watchlist():
    """Display current watchlist"""
    print("\n📋 Current Watchlist:")
    print(f"{'Ticker':<15} {'Company Name':<30}")
    print(f"{'-'*45}")
    for ticker, name in WATCHLIST.items():
        print(f"{ticker:<15} {name:<30}")


if __name__ == "__main__":
    # Run analysis
    analyze_watchlist()
    
    # Optional: Customize watchlist
    # add_to_watchlist('HEROMOTOCO.NS', 'Hero MotoCorp')
    # remove_from_watchlist('MARUTI.NS')
    # view_watchlist()
