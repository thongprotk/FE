// Background service worker for Chrome Extension
// Handles context menus, message passing, and API calls

// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'createFlashcard',
    title: 'Create Flashcard from "%s"',
    contexts: ['selection']
  })

  chrome.contextMenus.create({
    id: 'openPopup',
    title: 'Open FlashAI',
    contexts: ['all']
  })
})

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'createFlashcard') {
    // Send selected text to generate flashcards
    const selectedText = info.selectionText

    // Store in local storage temporarily
    chrome.storage.local.set({
      pendingText: selectedText,
      sourceUrl: tab?.url,
      sourceTitle: tab?.title
    })

    // Open popup or send notification
    chrome.action.openPopup()
  } else if (info.menuItemId === 'openPopup') {
    chrome.action.openPopup()
  }
})

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'TEXT_SELECTED') {
    // Store selected text
    chrome.storage.local.set({
      lastSelectedText: request.text,
      lastSelectedUrl: request.url,
      lastSelectedTitle: request.title,
      timestamp: Date.now()
    })

    // Show notification or badge
    chrome.action.setBadgeText({ text: '1' })
    chrome.action.setBadgeBackgroundColor({ color: '#3b82f6' })

    setTimeout(() => {
      chrome.action.setBadgeText({ text: '' })
    }, 3000)

    sendResponse({ success: true })
  } else if (request.type === 'GENERATE_FLASHCARDS') {
    // In production, this would call your AI API
    // For now, simulate the API call
    simulateAIGeneration(request.text).then(cards => {
      sendResponse({ success: true, cards })
    })
    return true // Will respond asynchronously
  } else if (request.type === 'SYNC_DATA') {
    // Sync data with backend
    syncWithBackend().then(result => {
      sendResponse({ success: true, result })
    })
    return true
  }

  return false
})

// Simulate AI flashcard generation
async function simulateAIGeneration(text) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Generate mock flashcards
  const cards = [
    {
      front: 'What is the main topic?',
      back: text.substring(0, 100) + '...',
      confidence: 0.95
    },
    {
      front: 'Key concept from text',
      back: 'Important information extracted from the content',
      confidence: 0.88
    }
  ]

  return cards
}

// Sync data with backend
async function syncWithBackend() {
  // In production, sync local data with your backend
  const data = await chrome.storage.local.get(null)

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  return { synced: true, count: Object.keys(data).length }
}

// Listen for badge click
chrome.action.onClicked.addListener((tab) => {
  // This only fires if no popup is set
  // Open the web app in a new tab
  chrome.tabs.create({ url: chrome.runtime.getURL('index.html') })
})

// Periodic sync (every 30 minutes)
setInterval(() => {
  syncWithBackend()
}, 30 * 60 * 1000)

console.log('FlashAI background service worker loaded')

