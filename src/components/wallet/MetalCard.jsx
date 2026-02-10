import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import SuccessModal from '../common/SuccessModal';

const MetalCard = ({ metalName, pricePerGram, currency = '₹', isLoading = false }) => {
  const [transactionType, setTransactionType] = useState('buy'); // 'buy' or 'sell'
  const [inputMode, setInputMode] = useState('rupees'); // 'rupees' or 'grams'
  const [amountInr, setAmountInr] = useState('');
  const [amountGrams, setAmountGrams] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Quick selection presets
  const gramPresets = [0.1, 1, 5, 10];

  // Calculate grams from INR
  const calculateGramsFromInr = (inr) => {
    if (!pricePerGram || !inr) return '';
    return (parseFloat(inr) / pricePerGram).toFixed(4);
  };

  // Calculate INR from grams
  const calculateInrFromGrams = (grams) => {
    if (!pricePerGram || !grams) return '';
    return (parseFloat(grams) * pricePerGram).toFixed(2);
  };

  // Handle INR input change
  const handleInrChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmountInr(value);
      setAmountGrams(calculateGramsFromInr(value));
    }
  };

  // Handle grams input change
  const handleGramsChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmountGrams(value);
      setAmountInr(calculateInrFromGrams(value));
    }
  };

  // Handle quick selection
  const handleQuickSelect = (grams) => {
    setAmountGrams(grams.toString());
    setAmountInr(calculateInrFromGrams(grams));
  };

  // Handle Buy/Sell transaction
  const handleTransaction = () => {
    if (!amountInr || !amountGrams) return;

    // Mock transaction (no API call or persistence)
    const message =
      transactionType === 'buy'
        ? `${metalName} was added securely to your wallet.`
        : `${metalName} was sold successfully and your wallet is updated.`;

    setSuccessMessage(message);
    setShowSuccessModal(true);

    // Clear inputs after transaction
    setAmountInr('');
    setAmountGrams('');
  };

  // Reset when transaction type changes
  useEffect(() => {
    setAmountInr('');
    setAmountGrams('');
  }, [transactionType]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-gray-900">
          {metalName}
        </h2>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Current Price</p>
          <p className="text-lg font-bold text-gray-900">
            {isLoading ? (
              <span className="text-gray-400">Loading...</span>
            ) : (
              `${currency}${pricePerGram ? pricePerGram.toFixed(2) : '—'}/g`
            )}
          </p>
        </div>
      </div>

      {/* Buy/Sell Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTransactionType('buy')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold uppercase tracking-wide text-sm transition-all duration-200 ${
            transactionType === 'buy'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          Buy
        </button>
        <button
          onClick={() => setTransactionType('sell')}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold uppercase tracking-wide text-sm transition-all duration-200 ${
            transactionType === 'sell'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <TrendingDown className="w-4 h-4 inline mr-2" />
          Sell
        </button>
      </div>

      {/* Input Mode Radio Buttons */}
      <div className="mb-6">
        <div className="flex flex-row gap-6 flex-wrap">
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              name={`inputMode-${metalName}`}
              value="rupees"
              checked={inputMode === 'rupees'}
              onChange={(e) => setInputMode(e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">
              {transactionType === 'buy' ? 'Buy' : 'Sell'} in Rupees
            </span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              name={`inputMode-${metalName}`}
              value="grams"
              checked={inputMode === 'grams'}
              onChange={(e) => setInputMode(e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-blue-600 transition">
              {transactionType === 'buy' ? 'Buy' : 'Sell'} in Grams
            </span>
          </label>
        </div>
      </div>

      {/* Input Section */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Amount in INR */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
              Amount in INR
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                {currency}
              </span>
              <input
                type="text"
                value={amountInr}
                onChange={handleInrChange}
                disabled={inputMode === 'grams'}
                placeholder="0.00"
                className={`w-full pl-8 pr-4 py-3 border-2 rounded-lg text-lg font-semibold transition-all duration-200 ${
                  inputMode === 'rupees'
                    ? 'border-blue-500 bg-white focus:ring-2 focus:ring-blue-200'
                    : 'border-gray-200 bg-gray-50 text-gray-500'
                } outline-none`}
              />
            </div>
          </div>

          {/* Amount in Grams */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
              Amount in Grams
            </label>
            <div className="relative">
              <input
                type="text"
                value={amountGrams}
                onChange={handleGramsChange}
                disabled={inputMode === 'rupees'}
                placeholder="0.0000"
                className={`w-full px-4 py-3 border-2 rounded-lg text-lg font-semibold transition-all duration-200 ${
                  inputMode === 'grams'
                    ? 'border-blue-500 bg-white focus:ring-2 focus:ring-blue-200'
                    : 'border-gray-200 bg-gray-50 text-gray-500'
                } outline-none`}
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
                g
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Selection Buttons */}
      <div className="mb-6">
        <p className="text-xs font-medium text-gray-600 mb-3 uppercase tracking-wide">
          Quick Select
        </p>
        <div className="grid grid-cols-4 gap-2">
          {gramPresets.map((grams) => (
            <button
              key={grams}
              onClick={() => handleQuickSelect(grams)}
              className="py-2 px-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-md active:scale-95"
            >
              {grams}g
            </button>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleTransaction}
        disabled={!amountInr || !amountGrams || isLoading}
        className={`w-full py-4 rounded-lg font-bold uppercase tracking-wide text-sm transition-all duration-200 ${
          transactionType === 'buy'
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg'
            : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md hover:shadow-lg'
        } disabled:opacity-50 disabled:cursor-not-allowed active:scale-98`}
      >
        {transactionType === 'buy' ? 'Buy' : 'Sell'} {metalName}
      </button>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
        autoCloseDuration={3000}
      />
    </div>
  );
};

export default MetalCard;
