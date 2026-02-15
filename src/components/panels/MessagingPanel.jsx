import { useState, useRef, useEffect } from 'react';
import { Send, Mic, X, Circle, MessageCircle } from 'lucide-react';

const MessagingPanel = ({ store, mode: initialMode = 'text', onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'store',
      text: `Hello! Welcome to ${store?.name}. How can we assist you today?`,
      timestamp: '10:30 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [currentMode, setCurrentMode] = useState(initialMode); // 'text' or 'voice'
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'user',
        text: inputText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setInputText('');

      // Simulate store reply after 2 seconds
      setTimeout(() => {
        const replyMessage = {
          id: messages.length + 2,
          sender: 'store',
          text: "Thank you for your message! We'll get back to you shortly.",
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, replyMessage]);
      }, 2000);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const sendVoiceMessage = () => {
    stopRecording();
    const newMessage = {
      id: messages.length + 1,
      sender: 'user',
      type: 'voice',
      duration: recordingTime,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, newMessage]);
    setRecordingTime(0);
  };

  const cancelRecording = () => {
    stopRecording();
    setRecordingTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Store Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-100 to-gold-50 flex items-center justify-center overflow-hidden">
              {store?.image ? (
                <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gold-dark font-serif font-bold text-lg">
                  {store?.name?.[0] || 'S'}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-serif font-semibold text-charcoal">{store?.name}</h3>
              <p className="text-xs text-gray-500 font-sans flex items-center gap-1">
                <Circle className="w-2 h-2 fill-current text-green-500" />
                Active now
              </p>
            </div>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setCurrentMode('text')}
            className={`flex-1 px-4 py-2 rounded-full text-xs font-sans font-semibold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
              currentMode === 'text'
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-gray-500 hover:text-charcoal'
            }`}
          >
            <MessageCircle className="w-3 h-3" />
            Text
          </button>
          <button
            onClick={() => setCurrentMode('voice')}
            className={`flex-1 px-4 py-2 rounded-full text-xs font-sans font-semibold uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
              currentMode === 'voice'
                ? 'bg-white text-charcoal shadow-sm'
                : 'text-gray-500 hover:text-charcoal'
            }`}
          >
            <Mic className="w-3 h-3" />
            Voice
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] ${
                message.sender === 'user'
                  ? 'bg-gradient-gold text-white rounded-l-2xl rounded-tr-2xl'
                  : 'bg-white text-charcoal rounded-r-2xl rounded-tl-2xl border border-gray-200'
              } px-4 py-3 shadow-sm`}
            >
              {message.type === 'voice' ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-0 animate-pulse"></div>
                      </div>
                    </div>
                    <p className="text-xs opacity-80">{formatTime(message.duration)}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm font-sans leading-relaxed">{message.text}</p>
              )}
              <p
                className={`text-[10px] mt-1 ${
                  message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                } font-sans`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Sticky at bottom */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
        {currentMode === 'voice' && isRecording ? (
          /* Voice Recording UI */
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 py-4">
              <div className="relative">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-mono font-bold text-charcoal">{formatTime(recordingTime)}</p>
                <p className="text-xs text-gray-500 font-sans mt-1">Recording...</p>
              </div>
            </div>

            {/* Waveform Visualization */}
            <div className="flex items-center justify-center gap-1 h-12">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gold rounded-full transition-all"
                  style={{
                    height: `${Math.random() * 100}%`,
                    animation: `pulse ${0.5 + Math.random() * 0.5}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>

            {/* Recording Controls */}
            <div className="flex gap-3">
              <button
                onClick={cancelRecording}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-full text-gray-700 font-sans font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={sendVoiceMessage}
                className="flex-1 px-6 py-3 bg-gradient-gold text-white rounded-full font-sans font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        ) : currentMode === 'voice' && !isRecording ? (
          /* Voice Message Start Button */
          <div className="space-y-3">
            <div className="text-center py-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gold-100 to-gold-50 rounded-full flex items-center justify-center mb-3">
                <Mic className="w-10 h-10 text-gold-dark" />
              </div>
              <p className="text-sm text-gray-600 font-sans mb-1">Ready to record</p>
              <p className="text-xs text-gray-400 font-sans">Tap the button below to start</p>
            </div>
            <button
              onClick={startRecording}
              className="w-full px-6 py-4 bg-gradient-gold text-white rounded-full font-sans font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-3"
            >
              <Mic className="w-5 h-5" />
              Start Recording
            </button>
          </div>
        ) : (
          /* Text Message Input */
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none font-sans text-sm transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-12 h-12 bg-gradient-gold border border-gray-200 rounded-full flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MessagingPanel;
