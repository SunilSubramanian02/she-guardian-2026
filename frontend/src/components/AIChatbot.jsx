import React, { useState, useEffect, useRef } from 'react';

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'ai', text: 'Hello, I am Nova, your Guardian AI. How can I help you stay safe today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const getAIResponse = (userMsg) => {
        const lowerMsg = userMsg.toLowerCase();
        let response = "I'm here to support you. If you are in immediate danger, please use the SOS button or call emergency services right away.";

        if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
            response = "Hello! I'm monitoring the safety network. Do you need any specific guidance or route planning?";
        } else if (lowerMsg.includes('safe route') || lowerMsg.includes('direction')) {
            response = "You can use the 'Safe Zone Heatmap' to analyze the safest routes based on real-time crowd sourced data. Would you like me to ping your location to it?";
        } else if (lowerMsg.includes('help') || lowerMsg.includes('danger')) {
            response = "CRITICAL ALERT: If you are in immediate danger, hit the giant SOS button to dispatch police and notify your guardians. I'm prioritizing your network connection now.";
        } else if (lowerMsg.includes('defense') || lowerMsg.includes('fight')) {
            response = "The Empowerment Hub has great tips! Remember: your goal is escape, not to fight. Strike vulnerable areas like eyes, nose, or instep and run towards crowded areas.";
        } else if (lowerMsg.includes('law') || lowerMsg.includes('police')) {
            response = "In India, you have the right to file a 'Zero FIR' at ANY police station, regardless of where the incident happened. Never let them turn you away.";
        }

        return response;
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMsg = { id: Date.now(), sender: 'user', text: input };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI thinking and typing delay
        setTimeout(() => {
            const aiResponse = { id: Date.now() + 1, sender: 'ai', text: getAIResponse(newMsg.text) };
            setMessages(prev => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1000 + Math.random() * 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* Chatbot Window */}
            {isOpen && (
                <div className="glass-card w-[320px] sm:w-[350px] max-h-[500px] h-[60vh] flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300 transform origin-bottom-right shadow-2xl dark:shadow-[0_0_30px_rgba(0,240,255,0.15)] border-blue-200 dark:border-neon-blue/30 relative bg-white/90 dark:bg-[#0a0a0f]/90">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-50/90 to-blue-100/90 dark:from-[#0f111a] dark:to-blue-900/40 p-4 border-b border-gray-200 dark:border-white/10 flex justify-between items-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-300/30 dark:bg-neon-blue/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center border border-blue-300 dark:border-neon-blue/50 shadow-sm dark:shadow-[0_0_10px_rgba(0,240,255,0.3)] relative">
                                <i className="fa-solid fa-robot text-blue-600 dark:text-neon-blue line-height-none"></i>
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 dark:bg-green-400 rounded-full border-2 border-white dark:border-[#0f111a]"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white tracking-wide">Nova AI</h3>
                                <p className="text-xs text-blue-600 dark:text-blue-400">Guardian Assistant Active</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-full bg-gray-200/50 dark:bg-white/5 hover:bg-gray-300/50 dark:hover:bg-white/20 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors z-10"
                        >
                            <i className="fa-solid fa-minus"></i>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar bg-gray-50/50 dark:bg-black/20">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                                {msg.sender === 'ai' && (
                                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-neon-blue/30 flex items-center justify-center mr-2 shrink-0 mt-1">
                                        <i className="fa-solid fa-robot text-[10px] text-blue-600 dark:text-neon-blue"></i>
                                    </div>
                                )}
                                <div className={`px-4 py-2.5 rounded-2xl ${msg.sender === 'user'
                                    ? 'bg-blue-500 dark:bg-blue-600/60 border border-blue-600/50 dark:border-blue-500/50 text-white rounded-tr-none shadow-sm dark:shadow-[0_2px_10px_rgba(37,99,235,0.2)] ml-2'
                                    : 'bg-white dark:bg-white/10 border border-gray-100 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-tl-none shadow-sm dark:shadow-none backdrop-blur-md'
                                    }`}>
                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex max-w-[85%] self-start p-3 px-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-tl-none shadow-sm dark:shadow-none">
                                <div className="flex items-center gap-1.5 opacity-70">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-neon-blue animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-neon-blue animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-neon-blue animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-3 bg-gray-50 dark:bg-black/40 border-t border-gray-200 dark:border-white/10 flex gap-2">
                        <input
                            type="text"
                            placeholder="Ask Nova for safety advice..."
                            className="flex-1 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-full px-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-neon-blue transition-colors shadow-sm dark:shadow-none"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim()}
                            className="w-10 h-10 rounded-full bg-blue-100 dark:bg-neon-blue/20 text-blue-600 dark:text-neon-blue flex items-center justify-center border border-blue-200 dark:border-neon-blue/30 hover:bg-blue-600 hover:text-white dark:hover:bg-neon-blue dark:hover:text-black hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-blue-100 disabled:hover:text-blue-600 dark:disabled:hover:bg-neon-blue/20 transition-all shrink-0"
                        >
                            <i className="fa-solid fa-paper-plane -ml-0.5"></i>
                        </button>
                    </form>
                </div>
            )}

            {/* Chatbot Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg dark:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-transform duration-300 hover:scale-110 z-50
                    ${isOpen ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 scale-90 text-gray-600 dark:text-gray-400' : 'bg-gradient-to-br from-blue-500 to-indigo-600 border border-blue-400 text-white'}`}
            >
                {/* Glow ring */}
                {!isOpen && (
                    <div className="absolute inset-0 rounded-full border border-blue-400 dark:border-neon-blue/50 animate-ping opacity-50"></div>
                )}

                <i className={`fa-solid ${isOpen ? 'fa-xmark text-xl' : 'fa-comment-dots text-2xl'}`}></i>
            </button>
        </div>
    );
};

export default AIChatbot;
