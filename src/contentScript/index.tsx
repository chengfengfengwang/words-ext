import { addStorageWord } from "../utils/setting";
import { getSentenceFromSelection } from "../utils/getSelection";
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === 'remark') {      
      addStorageWord({
        word: request.word,
        context: getSentenceFromSelection(window.getSelection())
      })
    }
  }
);