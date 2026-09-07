import './ChatMessage.css'

function ChatMessage({ message }) {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatContent = (content) => {
    return content
      .split('\n')
      .map((line, idx) => (
        <p key={idx}>{line}</p>
      ))
  }

  return (
    <div className={`message ${message.role}`}>
      <div className="message-avatar">
        {message.role === 'assistant' ? '🤖' : '👤'}
      </div>
      <div className="message-content-wrapper">
        <div className="message-header">
          <span className="message-role">
            {message.role === 'assistant' ? 'JARVIS' : 'You'}
          </span>
          <span className="message-time">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className="message-body">
          {formatContent(message.content)}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage