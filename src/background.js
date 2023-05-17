
chrome.runtime.onInstalled.addListener(() => {
  console.log('installed11')
  chrome.contextMenus.create({
    id: 'remark',
    title: 'remark',
    contexts: ['selection', 'page'],
  })
})
chrome.contextMenus.onClicked.addListener(async(info, tab) => {
  const response = await chrome.tabs.sendMessage(tab.id, {type: 'remark', word: info.selectionText});
})
chrome.action.onClicked.addListener(async(tab) => {
  chrome.runtime.openOptionsPage()
})
