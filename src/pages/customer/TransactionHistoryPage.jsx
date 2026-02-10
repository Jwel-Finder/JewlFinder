import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, ArrowLeft, TrendingUp, TrendingDown, Filter, Download } from 'lucide-react';

const TransactionHistoryPage = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState('all'); // 'all', 'buy', 'sell'
  const [filterMetal, setFilterMetal] = useState('all'); // 'all', 'gold', 'silver'

  // Dummy transaction data - Replace with actual API call
  const allTransactions = [
    {
      id: 'TXN001',
      type: 'buy',
      metal: 'gold',
      amount: 5000,
      grams: 1.2,
      pricePerGram: 4166.67,
      date: '2024-02-10T14:30:00',
      status: 'completed',
    },
    {
      id: 'TXN002',
      type: 'sell',
      metal: 'silver',
      amount: 2500,
      grams: 50,
      pricePerGram: 50.0,
      date: '2024-02-09T10:15:00',
      status: 'completed',
    },
    {
      id: 'TXN003',
      type: 'buy',
      metal: 'gold',
      amount: 10000,
      grams: 2.4,
      pricePerGram: 4166.67,
      date: '2024-02-08T16:45:00',
      status: 'completed',
    },
    {
      id: 'TXN004',
      type: 'buy',
      metal: 'silver',
      amount: 1000,
      grams: 20,
      pricePerGram: 50.0,
      date: '2024-02-07T11:20:00',
      status: 'completed',
    },
    {
      id: 'TXN005',
      type: 'sell',
      metal: 'gold',
      amount: 8000,
      grams: 1.92,
      pricePerGram: 4166.67,
      date: '2024-02-06T09:30:00',
      status: 'completed',
    },
  ];

  // Filter transactions
  const filteredTransactions = allTransactions.filter((txn) => {
    const typeMatch = filterType === 'all' || txn.type === filterType;
    const metalMatch = filterMetal === 'all' || txn.metal === filterMetal;
    return typeMatch && metalMatch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                <History className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight">
                  Transaction History
                </h1>
                <p className="text-sm text-gray-600 mt-1 font-sans">
                  View all your buy and sell transactions
                </p>
              </div>
            </div>

            {/* Export Button */}
            <button className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Transaction Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition ${
                    filterType === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('buy')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition ${
                    filterType === 'buy'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setFilterType('sell')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition ${
                    filterType === 'sell'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>

            {/* Metal Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Metal Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterMetal('all')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition ${
                    filterMetal === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterMetal('gold')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition ${
                    filterMetal === 'gold'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Gold
                </button>
                <button
                  onClick={() => setFilterMetal('silver')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition ${
                    filterMetal === 'silver'
                      ? 'bg-gray-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Silver
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
              <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600">
                No transactions match your current filters. Try adjusting the filters above.
              </p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left Side */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        transaction.type === 'buy'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {transaction.type === 'buy' ? (
                        <TrendingUp className="w-6 h-6" />
                      ) : (
                        <TrendingDown className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          {transaction.type} {transaction.metal}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === 'buy'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {transaction.type.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Transaction ID: {transaction.id} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Amount</p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Quantity</p>
                      <p className="text-lg font-bold text-gray-900">{transaction.grams}g</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Price/g</p>
                      <p className="text-sm font-medium text-gray-700">
                        {formatCurrency(transaction.pricePerGram)}
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          transaction.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Card */}
        {filteredTransactions.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6 shadow-sm">
            <h3 className="text-lg font-serif font-bold text-gray-900 mb-4">Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(
                    filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0)
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Grams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredTransactions.reduce((sum, txn) => sum + txn.grams, 0).toFixed(2)}g
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
