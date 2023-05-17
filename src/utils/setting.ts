
export const getSettings = async () => {
  const res = await chrome.storage.sync.get()
  return res
}
export const setSettings = async (values: Record<string, any>) => {
  return chrome.storage.sync.set(values)
}
export const getStorageWordArr = async () => {
  const res = await chrome.storage.sync.get({'wordArr': []})  
  return res['wordArr']
}
export const addStorageWord = async ({word, context}: {word: string, context: string}) => {
  const newWord = { word, context, date: new Date().getTime()}
  const arr = await getStorageWordArr()
  if (Array.isArray(arr)) {
    return chrome.storage.sync.set({ wordArr: [...arr, newWord] })
  } else {
    return chrome.storage.sync.set({ wordArr: [newWord] })
  }
}
export const removeStorageWord = async (word: string) => {
  const wordArr = await getStorageWordArr()
  const newWordArr = wordArr.filter((item: any) => item.word !== word)
  return chrome.storage.sync.set({ wordArr: newWordArr })
}