/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/

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

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQztBQUNEO0FBQ0EsMERBQTBELHlDQUF5QztBQUNuRyxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zZGstdGVzdC8uL3NyYy9iYWNrZ3JvdW5kLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlxuY2hyb21lLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoKCkgPT4ge1xuICBjb25zb2xlLmxvZygnaW5zdGFsbGVkMTEnKVxuICBjaHJvbWUuY29udGV4dE1lbnVzLmNyZWF0ZSh7XG4gICAgaWQ6ICdyZW1hcmsnLFxuICAgIHRpdGxlOiAncmVtYXJrJyxcbiAgICBjb250ZXh0czogWydzZWxlY3Rpb24nLCAncGFnZSddLFxuICB9KVxufSlcbmNocm9tZS5jb250ZXh0TWVudXMub25DbGlja2VkLmFkZExpc3RlbmVyKGFzeW5jKGluZm8sIHRhYikgPT4ge1xuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwge3R5cGU6ICdyZW1hcmsnLCB3b3JkOiBpbmZvLnNlbGVjdGlvblRleHR9KTtcbn0pXG5jaHJvbWUuYWN0aW9uLm9uQ2xpY2tlZC5hZGRMaXN0ZW5lcihhc3luYyh0YWIpID0+IHtcbiAgY2hyb21lLnJ1bnRpbWUub3Blbk9wdGlvbnNQYWdlKClcbn0pXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=