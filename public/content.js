// Content script for Chrome Extension
console.log('FlashAI content script loaded')

}
  }, 1000)
    }
      highlightElement = null
      highlightElement.remove()
    if (highlightElement) {
  setTimeout(() => {

  highlightElement.style.height = rect.height + 'px'
  highlightElement.style.width = rect.width + 'px'
  highlightElement.style.top = rect.top + 'px'
  highlightElement.style.left = rect.left + 'px'

  }
    document.body.appendChild(highlightElement)
    `
      background: rgba(59, 130, 246, 0.1);
      border-radius: 4px;
      border: 2px solid #3b82f6;
      z-index: 999999;
      pointer-events: none;
      position: fixed;
    highlightElement.style.cssText = `
    highlightElement = document.createElement('div')
  if (!highlightElement) {

  const rect = range.getBoundingClientRect()
  const range = selection.getRangeAt(0)

  if (!selection || selection.rangeCount === 0) return
  const selection = window.getSelection()
function showHighlight() {

let highlightElement: HTMLDivElement | null = null
// Add context menu highlight indicator

})
  return true
  }
    sendResponse({ text: selectedText || '' })
    const selectedText = window.getSelection()?.toString().trim()
  if (request.type === 'GET_SELECTED_TEXT') {
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
// Listen for messages from popup

})
  }
    })
      title: document.title
      url: window.location.href,
      text: selectedText,
      type: 'TEXT_SELECTED',
    chrome.runtime.sendMessage({
    // Send selected text to background script
  if (selectedText && selectedText.length > 20) {

  const selectedText = window.getSelection()?.toString().trim()
document.addEventListener('mouseup', () => {
// Listen for text selection

// This script runs on all web pages and enables text selection capture

