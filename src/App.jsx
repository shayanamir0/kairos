
import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [wage, setWage] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [wageType, setWageType] = useState('hourly');
  const [isWorking, setIsWorking] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [moneyEarned, setMoneyEarned] = useState(0);
  const [showSetup, setShowSetup] = useState(true);
  const [mode, setMode] = useState('procrastinating'); // 'procrastinating' or 'working'
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const intervalRef = useRef(null);
  const quoteIntervalRef = useRef(null);

  // Stoic quotes for each mode
  const procrastinatingQuotes = [
    "The cost of inaction is far greater than the cost of a mistake.",
    "It is not that we have a short time to live, but that we waste a lot of it.",
    "We suffer more often in imagination than in reality.",
    "He is a fool who looks to the past or the future for his happiness.",
    "You could leave life right now. Let that determine what you do and say and think.",
    "A man who suffers before it is necessary suffers more than is necessary."
  ];

  const workingQuotes = [
    "Don't explain your philosophy. Embody it.",
    "Circumstances don't make the man, they only reveal him to himself.",
    "You are investing in your future. Every moment counts.",
    "The impediment to action advances action. What stands in the way becomes the way.",
    "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    "A gem cannot be polished without friction, nor a man perfected without trials.",
    "Work out your own salvation. Do not depend on others."
  ];

  // Calculate money per second based on wage type
  const calculateMoneyPerSecond = () => {
    if (wageType === 'hourly') {
      return wage / 3600; // Convert hourly wage to per second
    } else {
      return wage / (30 * 24 * 3600); // Convert monthly wage to per second
    }
  };

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format money with currency
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Start/stop timer
  useEffect(() => {
    if (isWorking && !showSetup) {
      intervalRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
        setMoneyEarned(prev => prev + calculateMoneyPerSecond());
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isWorking, showSetup, wage, wageType, currency]);

  // Rotate quotes every 5 minutes (300 seconds)
  useEffect(() => {
    if (!showSetup) {
      quoteIntervalRef.current = setInterval(() => {
        setCurrentQuoteIndex(prev => (prev + 1) % (mode === 'working' ? workingQuotes.length : procrastinatingQuotes.length));
      }, 300000); // 5 minutes in milliseconds
    }

    return () => clearInterval(quoteIntervalRef.current);
  }, [showSetup, mode]);

  // Handle setup submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (wage && currency) {
      setShowSetup(false);
      setTimeElapsed(0);
      setMoneyEarned(0);
      setCurrentQuoteIndex(0);
    }
  };

  // Reset everything
  const handleReset = () => {
    setShowSetup(true);
    setWage('');
    setTimeElapsed(0);
    setMoneyEarned(0);
    setIsWorking(false);
    setMode('procrastinating');
    setCurrentQuoteIndex(0);
    clearInterval(quoteIntervalRef.current);
  };

  // Restart timer (reset only time and money)
  const handleRestart = () => {
    setTimeElapsed(0);
    setMoneyEarned(0);
  };

  // Toggle between modes
  const toggleMode = () => {
    const newMode = mode === 'procrastinating' ? 'working' : 'procrastinating';
    setMode(newMode);
    setCurrentQuoteIndex(0);
  };

  // Get current quote based on mode
  const getCurrentQuote = () => {
    if (mode === 'working') {
      return workingQuotes[currentQuoteIndex];
    } else {
      return procrastinatingQuotes[currentQuoteIndex];
    }
  };

  // Play/Pause button component
  const PlayPauseButton = () => (
    <button
      onClick={() => setIsWorking(!isWorking)}
      className="w-16 h-16 rounded-full bg-light-brown-500 text-white hover:bg-light-brown-600 transition-colors flex items-center justify-center"
    >
      {isWorking ? (
        // Pause icon
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        // Play icon
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      )}
    </button>
  );

  // Check if wage is effectively zero
  const isZeroWage = parseFloat(wage) === 0 || wage === '';

  return (
    <div className="min-h-screen bg-milky flex flex-col items-center justify-center p-4 font-mono">
      {showSetup ? (
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-8 border border-light-brown-200">
          <h1 className="text-3xl font-bold text-center mb-8 text-light-brown-500">Kairos Timer</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-light-brown-500 mb-2">
                Your Wage
              </label>
              <input
                type="number"
                value={wage}
                onChange={(e) => setWage(e.target.value)}
                placeholder="Enter amount"
                className="w-full px-4 py-3 border border-light-brown-200 rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown-300 text-light-brown-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-light-brown-500 mb-2">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-light-brown-200 rounded-md focus:outline-none focus:ring-2 focus:ring-light-brown-300 text-light-brown-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-light-brown-500 mb-2">
                Wage Type
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setWageType('hourly')}
                  className={`flex-1 py-3 rounded-md transition-colors ${
                    wageType === 'hourly'
                      ? 'bg-light-brown-200 text-light-brown-500'
                      : 'bg-white border border-light-brown-200 text-light-brown-500'
                  }`}
                >
                  Hourly
                </button>
                <button
                  type="button"
                  onClick={() => setWageType('monthly')}
                  className={`flex-1 py-3 rounded-md transition-colors ${
                    wageType === 'monthly'
                      ? 'bg-light-brown-200 text-light-brown-500'
                      : 'bg-white border border-light-brown-200 text-light-brown-500'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full py-3 bg-light-brown-200 text-light-brown-500 rounded-md hover:bg-light-brown-300 transition-colors font-medium"
            >
              Start Tracking
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full max-w-2xl">
          <div className="flex justify-between w-full mb-12">
            <button
              onClick={handleReset}
              className="text-light-brown-400 hover:text-light-brown-500 transition-colors"
            >
              Reset
            </button>
            <h1 className="text-2xl font-bold text-light-brown-500">Kairos Timer</h1>
            <button
              onClick={handleRestart}
              className="text-light-brown-400 hover:text-light-brown-500 transition-colors"
            >
              Restart
            </button>
          </div>
          
          <div className="flex flex-col items-center mb-12">
            <div className="text-6xl md:text-7xl font-bold text-light-brown-500 mb-2">
              {formatTime(timeElapsed)}
            </div>
            <div className="text-lg text-light-brown-400">Time Elapsed</div>
          </div>
          
          <div className="flex flex-col items-center mb-16">
            <div className="text-5xl md:text-6xl font-bold text-light-brown-500 mb-2">
              {isZeroWage ? (
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block">
                    <path d="M12 12c2.5-2 5.5-2 8 0M12 12c-2.5 2-5.5 2-8 0M12 12c2.5 2 5.5 2 8 0M12 12c-2.5-2-5.5-2-8 0"/>
                  </svg>
                </div>
              ) : (
                formatMoney(moneyEarned)
              )}
            </div>
            <div className="text-lg text-light-brown-400">Value of Time</div>
          </div>
          
          {isZeroWage && (
            <div className="text-center max-w-md mb-12">
              <p className="text-light-brown-400 italic text-lg">
                Your time is all yours. A finite resource meant for action, not passive contemplation.
              </p>
            </div>
          )}
          
          <div className="flex flex-col items-center mb-12">
            <PlayPauseButton />
          </div>
          
          <div className="text-center max-w-md mt-8">
            <p className="text-light-brown-400 italic text-lg mb-4">
              "{getCurrentQuote()}"
            </p>
            <button 
              onClick={toggleMode}
              className="text-light-brown-400 hover:text-light-brown-500 transition-colors"
            >
              Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}