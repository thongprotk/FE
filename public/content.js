// Content script for FlashAI Chrome extension
console.log('FlashAI content script loaded')

let highlightElement = null

function removeHighlight() {
  if (highlightElement) {
    highlightElement.remove()
    highlightElement = null
  }
}

function showHighlight() {
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return

  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()

  if (!highlightElement) {
    highlightElement = document.createElement('div')
    highlightElement.style.cssText = `
      position: fixed;
      pointer-events: none;
      z-index: 999999;
      border: 2px solid #3b82f6;
      border-radius: 4px;
      background: rgba(59, 130, 246, 0.08);
      transition: opacity 0.15s ease;
    `
    document.body.appendChild(highlightElement)
  }

  highlightElement.style.top = `${rect.top}px`
  highlightElement.style.left = `${rect.left}px`
  highlightElement.style.width = `${rect.width}px`
  highlightElement.style.height = `${rect.height}px`

  setTimeout(removeHighlight, 1200)
}

function notifySelection() {
  const selectedText = window.getSelection()?.toString().trim()
  if (!selectedText || selectedText.length < 5) return

  chrome.runtime.sendMessage({
    type: 'TEXT_SELECTED',
    text: selectedText,
    url: window.location.href,
    title: document.title,
  })
}

// Listen for text selection release
document.addEventListener('mouseup', () => {
  showHighlight()
  notifySelection()
})

// Respond to popup requests for the current selection
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'GET_SELECTED_TEXT') {
    const selectedText = window.getSelection()?.toString().trim() || ''
    sendResponse({ text: selectedText })
  }
  return true
})

