import { useState, useRef, useEffect } from 'react'
import './App.css'
import ChatMessage from './components/ChatMessage'

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m JARVIS, your AI assistant. How can I help you today?',
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessageToAI = async (userMessage) => {
    try {
      const response = await fetch('http://127.0.0.1:8080/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'Qwen2.5-1.5B-Instruct-Q4_K_M',
          messages: [
            { role: 'system', content: 'You are JARVIS, a highly advanced AI assistant.' },
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('Server Error:', error)
      return 'Error connecting to backend. Make sure your AI server is running on http://127.0.0.1:8080'
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Get AI response
    const aiResponse = await sendMessageToAI(inputValue)

    const assistantMessage = {
      id: messages.length + 2,
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsLoading(false)
    inputRef.current?.focus()
  }

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear all messages?')) {
      setMessages([
        {
          id: 1,
          role: 'assistant',
          content: 'Hello! I\'m JARVIS, your AI assistant. How can I help you today?',
          timestamp: new Date(),
        }
      ])
    }
  }

  return (
    <div className="app-container">
      <div className="chat-header">
        <div className="header-content">
          <h1>🤖 JARVIS</h1>
          <p>AI-Addin Chat Interface</p>
        </div>
        <button className="clear-btn" onClick={handleClearChat} title="Clear chat history">
          🗑️ Clear
        </button>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && (
          <div className="loading-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p>JARVIS is thinking...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-area" onSubmit={handleSendMessage}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message here..."
          disabled={isLoading}
          className="message-input"
        />
        <button 
          type="submit" 
          disabled={isLoading || !inputValue.trim()}
          className="send-btn"
          title="Send message (Enter or Click)"
        >
          📤 Send
        </button>
      </form>
    </div>
  )
}

export default App