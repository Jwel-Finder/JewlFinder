import { MessageCircle, Circle } from 'lucide-react';

const GlobalMessagingPanel = ({ onSelectConversation }) => {
  // Mock conversation data
  const conversations = [
    {
      id: 1,
      storeName: 'Golden Elegance Boutique',
      storeImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100',
      lastMessage: 'Thank you for your inquiry about our diamond collection!',
      timestamp: '2 min ago',
      unread: 2,
      isActive: true,
    },
    {
      id: 2,
      storeName: 'Royal Jewels & Co',
      storeImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100',
      lastMessage: 'Your custom design is ready for review',
      timestamp: '1 hour ago',
      unread: 0,
      isActive: true,
    },
    {
      id: 3,
      storeName: 'Heritage Gold House',
      storeImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=100',
      lastMessage: "We'll have those earrings available next week",
      timestamp: 'Yesterday',
      unread: 0,
      isActive: false,
    },
    {
      id: 4,
      storeName: 'Pristine Diamonds',
      storeImage: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=100',
      lastMessage: 'The repair work has been completed',
      timestamp: '3 days ago',
      unread: 1,
      isActive: false,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-serif font-semibold text-charcoal mb-1">Messages</h3>
        <p className="text-sm text-gray-500 font-sans">
          {conversations.filter((c) => c.unread > 0).length} unread conversations
        </p>
      </div>

      {/* Search */}
      <div className="px-6 py-3 border-b border-gray-100">
        <input
          type="text"
          placeholder="Search conversations..."
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-sans focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation?.(conversation)}
                className="w-full px-6 py-4 hover:bg-gray-50 transition-colors text-left group"
              >
                <div className="flex items-start gap-3">
                  {/* Store Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-100 to-gold-50 overflow-hidden">
                      <img
                        src={conversation.storeImage}
                        alt={conversation.storeName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {conversation.isActive && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Conversation Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-serif font-semibold text-charcoal group-hover:text-gold-dark transition-colors truncate">
                        {conversation.storeName}
                      </h4>
                      <span className="text-xs text-gray-400 font-sans flex-shrink-0 ml-2">
                        {conversation.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 font-sans truncate pr-2">
                        {conversation.lastMessage}
                      </p>
                      {conversation.unread > 0 && (
                        <span className="flex-shrink-0 w-5 h-5 bg-gold rounded-full flex items-center justify-center text-white text-xs font-sans font-bold">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-serif font-semibold text-charcoal mb-2">No Messages Yet</h3>
            <p className="text-sm text-gray-500 font-sans max-w-xs">
              Start a conversation with a boutique to see your messages here
            </p>
          </div>
        )}
      </div>

      {/* Footer Tip */}
      <div className="px-6 py-4 bg-gradient-to-r from-gold/5 to-gold-dark/5 border-t border-gold/10">
        <p className="text-xs text-gray-600 font-sans text-center">
          💡 Tip: Click on any boutique to start messaging
        </p>
      </div>
    </div>
  );
};

export default GlobalMessagingPanel;
