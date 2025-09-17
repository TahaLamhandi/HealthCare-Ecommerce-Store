import React from "react";
import { MessageCircle, X, Bot, User, Send } from "lucide-react";
import { useCart } from "../../contexts/CartContext.js";
import { useFavorites } from "../../contexts/FavoritesContext.js";
import { Button } from "../tools/button";
import { Input } from "../tools/input";
import '../../../css/app.css';


export default function Chatbot({
  isChatOpen,
  setIsChatOpen,
  messages,
  inputMessage,
  setInputMessage,
  isTyping,
  handleSendMessage,
  initializeChat
}) {
  return (
    <>
      {/* Chatbot Popup */}
      <div className="fixed bottom-9 right-6 z-[9999]">
        <div className="relative">
          <Button
            onClick={() => {
              setIsChatOpen(!isChatOpen);
              if (!isChatOpen) initializeChat();
            }}
            className={`w-18 h-18 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 ${
              isChatOpen ? "rotate-180" : ""
            }`}
          >
            {isChatOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
          </Button>
        </div>

        <div
          className={`absolute bottom-16 right-0 w-72 md:w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 transition-all duration-500 transform origin-bottom-right z-[9999] ${
            isChatOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-75 translate-y-4 pointer-events-none"
          }`}
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Assistant Bioekleel</h3>
                <p className="text-green-100 text-xs">En ligne • Répond instantanément</p>
              </div>
            </div>
          </div>

          <div className="h-64 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } animate-fade-in-up`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.sender === "user"
                        ? "bg-green-500"
                        : "bg-white border-2 border-green-200"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-green-500 text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-200"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === "user"
                          ? "text-green-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fade-in-up">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-white border-2 border-green-200 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Tapez votre message..."
                className="flex-1 border-gray-300 focus:border-green-400 focus:ring-green-400 rounded-xl"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 rounded-xl transition-all hover:scale-105"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Propulsé par IA • Réponses instantanées
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
