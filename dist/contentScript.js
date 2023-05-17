/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/utils/getSelection.ts":
/*!***********************************!*\
  !*** ./src/utils/getSelection.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getParagraph": () => (/* binding */ getParagraph),
/* harmony export */   "getParagraphFromSelection": () => (/* binding */ getParagraphFromSelection),
/* harmony export */   "getSentence": () => (/* binding */ getSentence),
/* harmony export */   "getSentenceFromSelection": () => (/* binding */ getSentenceFromSelection),
/* harmony export */   "getText": () => (/* binding */ getText),
/* harmony export */   "getTextFromSelection": () => (/* binding */ getTextFromSelection)
/* harmony export */ });
/**
 * Returns the selected text
 */
function getTextFromSelection(selection, win = window) {
    // When called on an <iframe> that is not displayed (eg. where display: none is set)
    // Firefox will return null, whereas other browsers will return a Selection object
    // with Selection.type set to None.
    if (selection) {
        const text = selection.toString().trim();
        if (text) {
            return text;
        }
    }
    // Currently getSelection() doesn't work on the content of <input> elements in Firefox
    // Document.activeElement returns the focused element.
    const activeElement = win.document.activeElement;
    /* istanbul ignore else */
    if (activeElement) {
        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
            const el = activeElement;
            return el.value.slice(el.selectionStart || 0, el.selectionEnd || 0);
        }
    }
    return '';
}
/**
 * Returns the selected text
 */
function getText(win = window) {
    return getTextFromSelection(win.getSelection(), win);
}
/**
 * Returns the paragraph containing the selection text.
 */
function getParagraphFromSelection(selection) {
    if (!selection || selection.rangeCount <= 0) {
        return '';
    }
    const selectedText = selection.toString();
    if (!selectedText.trim()) {
        return '';
    }
    const range = selection.getRangeAt(0);
    // double sanity check, which is unlikely to happen due to the rangeCount check above
    /* istanbul ignore if */
    if (!range) {
        return '';
    }
    return (extractParagraphHead(range) + selectedText + extractParagraphTail(range))
        .replace(/\s+/g, ' ')
        .trim();
}
/**
 * Returns the paragraph containing the selection text.
 */
function getParagraph(win = window) {
    return getParagraphFromSelection(win.getSelection());
}
/**
 * Returns the sentence containing the selection text.
 */
function getSentenceFromSelection(selection) {
    if (!selection || selection.rangeCount <= 0) {
        return '';
    }
    const selectedText = selection.toString();
    if (!selectedText.trim()) {
        return '';
    }
    const range = selection.getRangeAt(0);
    // double sanity check, which is unlikely to happen due to the rangeCount check above
    /* istanbul ignore if */
    if (!range) {
        return '';
    }
    return (extractSentenceHead(extractParagraphHead(range)) +
        selectedText +
        extractSentenceTail(extractParagraphTail(range)))
        .replace(/\s+/g, ' ')
        .trim();
}
/**
 * Returns the sentence containing the selection text.
 */
function getSentence(win = window) {
    return getSentenceFromSelection(win.getSelection());
}
function extractParagraphHead(range) {
    let startNode = range.startContainer;
    let leadingText = '';
    switch (startNode.nodeType) {
        case Node.TEXT_NODE: {
            const textContent = startNode.textContent;
            if (textContent) {
                leadingText = textContent.slice(0, range.startOffset);
            }
            break;
        }
        case Node.COMMENT_NODE:
        case Node.CDATA_SECTION_NODE:
            break;
        default:
            startNode = startNode.childNodes[range.startOffset];
    }
    // parent prev siblings
    for (let node = startNode; isInlineNode(node); node = node.parentElement) {
        for (let sibl = node.previousSibling; isInlineNode(sibl); sibl = sibl.previousSibling) {
            leadingText = getTextFromNode(sibl) + leadingText;
        }
    }
    return leadingText;
}
function extractParagraphTail(range) {
    let endNode = range.endContainer;
    let tailingText = '';
    switch (endNode.nodeType) {
        case Node.TEXT_NODE: {
            const textContent = endNode.textContent;
            if (textContent) {
                tailingText = textContent.slice(range.endOffset);
            }
            break;
        }
        case Node.COMMENT_NODE:
        case Node.CDATA_SECTION_NODE:
            break;
        default:
            endNode = endNode.childNodes[range.endOffset - 1];
    }
    // parent next siblings
    for (let node = endNode; isInlineNode(node); node = node.parentElement) {
        for (let sibl = node.nextSibling; isInlineNode(sibl); sibl = sibl.nextSibling) {
            tailingText += getTextFromNode(sibl);
        }
    }
    return tailingText;
}
function extractSentenceHead(leadingText) {
    // split regexp to prevent backtracking
    if (leadingText) {
        const puncTester = /[.?!。？！…]/;
        /** meaningful char after dot "." */
        const charTester = /[^\s.?!。？！…]/;
        for (let i = leadingText.length - 1; i >= 0; i--) {
            const c = leadingText[i];
            if (puncTester.test(c)) {
                if (c === '.' && charTester.test(leadingText[i + 1])) {
                    // a.b is allowed
                    continue;
                }
                return leadingText.slice(i + 1);
            }
        }
    }
    return leadingText;
}
function extractSentenceTail(tailingText) {
    // match tail                                                       for "..."
    const tailMatch = /^((\.(?![\s.?!。？！…]))|[^.?!。？！…])*([.?!。？！…]){0,3}/.exec(tailingText);
    // the regexp will match empty string so it is unlikely to have null result
    return tailMatch ? tailMatch[0] : /* istanbul ignore next */ '';
}
function getTextFromNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        return node.nodeValue || /* istanbul ignore next */ '';
    }
    else if (node.nodeType === Node.ELEMENT_NODE) {
        return node.innerText || /* istanbul ignore next: SVG? */ '';
    }
    return '';
}
function isInlineNode(node) {
    if (!node) {
        return false;
    }
    switch (node.nodeType) {
        case Node.TEXT_NODE:
        case Node.COMMENT_NODE:
        case Node.CDATA_SECTION_NODE:
            return true;
        case Node.ELEMENT_NODE: {
            switch (node.tagName) {
                case 'A':
                case 'ABBR':
                case 'B':
                case 'BDI':
                case 'BDO':
                case 'BR':
                case 'CITE':
                case 'CODE':
                case 'DATA':
                case 'DFN':
                case 'EM':
                case 'I':
                case 'KBD':
                case 'MARK':
                case 'Q':
                case 'RP':
                case 'RT':
                case 'RTC':
                case 'RUBY':
                case 'S':
                case 'SAMP':
                case 'SMALL':
                case 'SPAN':
                case 'STRONG':
                case 'SUB':
                case 'SUP':
                case 'TIME':
                case 'U':
                case 'VAR':
                case 'WBR':
                    return true;
            }
        }
    }
    return false;
}


/***/ }),

/***/ "./src/utils/setting.ts":
/*!******************************!*\
  !*** ./src/utils/setting.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addStorageWord": () => (/* binding */ addStorageWord),
/* harmony export */   "getSettings": () => (/* binding */ getSettings),
/* harmony export */   "getStorageWordArr": () => (/* binding */ getStorageWordArr),
/* harmony export */   "removeStorageWord": () => (/* binding */ removeStorageWord),
/* harmony export */   "setSettings": () => (/* binding */ setSettings)
/* harmony export */ });
const getSettings = async () => {
    const res = await chrome.storage.sync.get();
    return res;
};
const setSettings = async (values) => {
    return chrome.storage.sync.set(values);
};
const getStorageWordArr = async () => {
    const res = await chrome.storage.sync.get({ 'wordArr': [] });
    return res['wordArr'];
};
const addStorageWord = async ({ word, context }) => {
    const newWord = { word, context, date: new Date().getTime() };
    const arr = await getStorageWordArr();
    if (Array.isArray(arr)) {
        return chrome.storage.sync.set({ wordArr: [...arr, newWord] });
    }
    else {
        return chrome.storage.sync.set({ wordArr: [newWord] });
    }
};
const removeStorageWord = async (word) => {
    const wordArr = await getStorageWordArr();
    const newWordArr = wordArr.filter((item) => item.word !== word);
    return chrome.storage.sync.set({ wordArr: newWordArr });
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*************************************!*\
  !*** ./src/contentScript/index.tsx ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_setting__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/setting */ "./src/utils/setting.ts");
/* harmony import */ var _utils_getSelection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/getSelection */ "./src/utils/getSelection.ts");


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'remark') {
        (0,_utils_setting__WEBPACK_IMPORTED_MODULE_0__.addStorageWord)({
            word: request.word,
            context: (0,_utils_getSelection__WEBPACK_IMPORTED_MODULE_1__.getSentenceFromSelection)(window.getSelection())
        });
    }
});

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFNBQVM7QUFDVDtBQUNBLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zZGstdGVzdC8uL3NyYy91dGlscy9nZXRTZWxlY3Rpb24udHMiLCJ3ZWJwYWNrOi8vc2RrLXRlc3QvLi9zcmMvdXRpbHMvc2V0dGluZy50cyIsIndlYnBhY2s6Ly9zZGstdGVzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zZGstdGVzdC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vc2RrLXRlc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9zZGstdGVzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3Nkay10ZXN0Ly4vc3JjL2NvbnRlbnRTY3JpcHQvaW5kZXgudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUmV0dXJucyB0aGUgc2VsZWN0ZWQgdGV4dFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGV4dEZyb21TZWxlY3Rpb24oc2VsZWN0aW9uLCB3aW4gPSB3aW5kb3cpIHtcbiAgICAvLyBXaGVuIGNhbGxlZCBvbiBhbiA8aWZyYW1lPiB0aGF0IGlzIG5vdCBkaXNwbGF5ZWQgKGVnLiB3aGVyZSBkaXNwbGF5OiBub25lIGlzIHNldClcbiAgICAvLyBGaXJlZm94IHdpbGwgcmV0dXJuIG51bGwsIHdoZXJlYXMgb3RoZXIgYnJvd3NlcnMgd2lsbCByZXR1cm4gYSBTZWxlY3Rpb24gb2JqZWN0XG4gICAgLy8gd2l0aCBTZWxlY3Rpb24udHlwZSBzZXQgdG8gTm9uZS5cbiAgICBpZiAoc2VsZWN0aW9uKSB7XG4gICAgICAgIGNvbnN0IHRleHQgPSBzZWxlY3Rpb24udG9TdHJpbmcoKS50cmltKCk7XG4gICAgICAgIGlmICh0ZXh0KSB7XG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBDdXJyZW50bHkgZ2V0U2VsZWN0aW9uKCkgZG9lc24ndCB3b3JrIG9uIHRoZSBjb250ZW50IG9mIDxpbnB1dD4gZWxlbWVudHMgaW4gRmlyZWZveFxuICAgIC8vIERvY3VtZW50LmFjdGl2ZUVsZW1lbnQgcmV0dXJucyB0aGUgZm9jdXNlZCBlbGVtZW50LlxuICAgIGNvbnN0IGFjdGl2ZUVsZW1lbnQgPSB3aW4uZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgIGlmIChhY3RpdmVFbGVtZW50KSB7XG4gICAgICAgIGlmIChhY3RpdmVFbGVtZW50LnRhZ05hbWUgPT09ICdJTlBVVCcgfHwgYWN0aXZlRWxlbWVudC50YWdOYW1lID09PSAnVEVYVEFSRUEnKSB7XG4gICAgICAgICAgICBjb25zdCBlbCA9IGFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgICAgICByZXR1cm4gZWwudmFsdWUuc2xpY2UoZWwuc2VsZWN0aW9uU3RhcnQgfHwgMCwgZWwuc2VsZWN0aW9uRW5kIHx8IDApO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiAnJztcbn1cbi8qKlxuICogUmV0dXJucyB0aGUgc2VsZWN0ZWQgdGV4dFxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGV4dCh3aW4gPSB3aW5kb3cpIHtcbiAgICByZXR1cm4gZ2V0VGV4dEZyb21TZWxlY3Rpb24od2luLmdldFNlbGVjdGlvbigpLCB3aW4pO1xufVxuLyoqXG4gKiBSZXR1cm5zIHRoZSBwYXJhZ3JhcGggY29udGFpbmluZyB0aGUgc2VsZWN0aW9uIHRleHQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYXJhZ3JhcGhGcm9tU2VsZWN0aW9uKHNlbGVjdGlvbikge1xuICAgIGlmICghc2VsZWN0aW9uIHx8IHNlbGVjdGlvbi5yYW5nZUNvdW50IDw9IDApIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBjb25zdCBzZWxlY3RlZFRleHQgPSBzZWxlY3Rpb24udG9TdHJpbmcoKTtcbiAgICBpZiAoIXNlbGVjdGVkVGV4dC50cmltKCkpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBjb25zdCByYW5nZSA9IHNlbGVjdGlvbi5nZXRSYW5nZUF0KDApO1xuICAgIC8vIGRvdWJsZSBzYW5pdHkgY2hlY2ssIHdoaWNoIGlzIHVubGlrZWx5IHRvIGhhcHBlbiBkdWUgdG8gdGhlIHJhbmdlQ291bnQgY2hlY2sgYWJvdmVcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIXJhbmdlKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIChleHRyYWN0UGFyYWdyYXBoSGVhZChyYW5nZSkgKyBzZWxlY3RlZFRleHQgKyBleHRyYWN0UGFyYWdyYXBoVGFpbChyYW5nZSkpXG4gICAgICAgIC5yZXBsYWNlKC9cXHMrL2csICcgJylcbiAgICAgICAgLnRyaW0oKTtcbn1cbi8qKlxuICogUmV0dXJucyB0aGUgcGFyYWdyYXBoIGNvbnRhaW5pbmcgdGhlIHNlbGVjdGlvbiB0ZXh0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFyYWdyYXBoKHdpbiA9IHdpbmRvdykge1xuICAgIHJldHVybiBnZXRQYXJhZ3JhcGhGcm9tU2VsZWN0aW9uKHdpbi5nZXRTZWxlY3Rpb24oKSk7XG59XG4vKipcbiAqIFJldHVybnMgdGhlIHNlbnRlbmNlIGNvbnRhaW5pbmcgdGhlIHNlbGVjdGlvbiB0ZXh0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2VudGVuY2VGcm9tU2VsZWN0aW9uKHNlbGVjdGlvbikge1xuICAgIGlmICghc2VsZWN0aW9uIHx8IHNlbGVjdGlvbi5yYW5nZUNvdW50IDw9IDApIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBjb25zdCBzZWxlY3RlZFRleHQgPSBzZWxlY3Rpb24udG9TdHJpbmcoKTtcbiAgICBpZiAoIXNlbGVjdGVkVGV4dC50cmltKCkpIHtcbiAgICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBjb25zdCByYW5nZSA9IHNlbGVjdGlvbi5nZXRSYW5nZUF0KDApO1xuICAgIC8vIGRvdWJsZSBzYW5pdHkgY2hlY2ssIHdoaWNoIGlzIHVubGlrZWx5IHRvIGhhcHBlbiBkdWUgdG8gdGhlIHJhbmdlQ291bnQgY2hlY2sgYWJvdmVcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIXJhbmdlKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgcmV0dXJuIChleHRyYWN0U2VudGVuY2VIZWFkKGV4dHJhY3RQYXJhZ3JhcGhIZWFkKHJhbmdlKSkgK1xuICAgICAgICBzZWxlY3RlZFRleHQgK1xuICAgICAgICBleHRyYWN0U2VudGVuY2VUYWlsKGV4dHJhY3RQYXJhZ3JhcGhUYWlsKHJhbmdlKSkpXG4gICAgICAgIC5yZXBsYWNlKC9cXHMrL2csICcgJylcbiAgICAgICAgLnRyaW0oKTtcbn1cbi8qKlxuICogUmV0dXJucyB0aGUgc2VudGVuY2UgY29udGFpbmluZyB0aGUgc2VsZWN0aW9uIHRleHQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRTZW50ZW5jZSh3aW4gPSB3aW5kb3cpIHtcbiAgICByZXR1cm4gZ2V0U2VudGVuY2VGcm9tU2VsZWN0aW9uKHdpbi5nZXRTZWxlY3Rpb24oKSk7XG59XG5mdW5jdGlvbiBleHRyYWN0UGFyYWdyYXBoSGVhZChyYW5nZSkge1xuICAgIGxldCBzdGFydE5vZGUgPSByYW5nZS5zdGFydENvbnRhaW5lcjtcbiAgICBsZXQgbGVhZGluZ1RleHQgPSAnJztcbiAgICBzd2l0Y2ggKHN0YXJ0Tm9kZS5ub2RlVHlwZSkge1xuICAgICAgICBjYXNlIE5vZGUuVEVYVF9OT0RFOiB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0Q29udGVudCA9IHN0YXJ0Tm9kZS50ZXh0Q29udGVudDtcbiAgICAgICAgICAgIGlmICh0ZXh0Q29udGVudCkge1xuICAgICAgICAgICAgICAgIGxlYWRpbmdUZXh0ID0gdGV4dENvbnRlbnQuc2xpY2UoMCwgcmFuZ2Uuc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBOb2RlLkNPTU1FTlRfTk9ERTpcbiAgICAgICAgY2FzZSBOb2RlLkNEQVRBX1NFQ1RJT05fTk9ERTpcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgc3RhcnROb2RlID0gc3RhcnROb2RlLmNoaWxkTm9kZXNbcmFuZ2Uuc3RhcnRPZmZzZXRdO1xuICAgIH1cbiAgICAvLyBwYXJlbnQgcHJldiBzaWJsaW5nc1xuICAgIGZvciAobGV0IG5vZGUgPSBzdGFydE5vZGU7IGlzSW5saW5lTm9kZShub2RlKTsgbm9kZSA9IG5vZGUucGFyZW50RWxlbWVudCkge1xuICAgICAgICBmb3IgKGxldCBzaWJsID0gbm9kZS5wcmV2aW91c1NpYmxpbmc7IGlzSW5saW5lTm9kZShzaWJsKTsgc2libCA9IHNpYmwucHJldmlvdXNTaWJsaW5nKSB7XG4gICAgICAgICAgICBsZWFkaW5nVGV4dCA9IGdldFRleHRGcm9tTm9kZShzaWJsKSArIGxlYWRpbmdUZXh0O1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBsZWFkaW5nVGV4dDtcbn1cbmZ1bmN0aW9uIGV4dHJhY3RQYXJhZ3JhcGhUYWlsKHJhbmdlKSB7XG4gICAgbGV0IGVuZE5vZGUgPSByYW5nZS5lbmRDb250YWluZXI7XG4gICAgbGV0IHRhaWxpbmdUZXh0ID0gJyc7XG4gICAgc3dpdGNoIChlbmROb2RlLm5vZGVUeXBlKSB7XG4gICAgICAgIGNhc2UgTm9kZS5URVhUX05PREU6IHtcbiAgICAgICAgICAgIGNvbnN0IHRleHRDb250ZW50ID0gZW5kTm9kZS50ZXh0Q29udGVudDtcbiAgICAgICAgICAgIGlmICh0ZXh0Q29udGVudCkge1xuICAgICAgICAgICAgICAgIHRhaWxpbmdUZXh0ID0gdGV4dENvbnRlbnQuc2xpY2UocmFuZ2UuZW5kT2Zmc2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgTm9kZS5DT01NRU5UX05PREU6XG4gICAgICAgIGNhc2UgTm9kZS5DREFUQV9TRUNUSU9OX05PREU6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGVuZE5vZGUgPSBlbmROb2RlLmNoaWxkTm9kZXNbcmFuZ2UuZW5kT2Zmc2V0IC0gMV07XG4gICAgfVxuICAgIC8vIHBhcmVudCBuZXh0IHNpYmxpbmdzXG4gICAgZm9yIChsZXQgbm9kZSA9IGVuZE5vZGU7IGlzSW5saW5lTm9kZShub2RlKTsgbm9kZSA9IG5vZGUucGFyZW50RWxlbWVudCkge1xuICAgICAgICBmb3IgKGxldCBzaWJsID0gbm9kZS5uZXh0U2libGluZzsgaXNJbmxpbmVOb2RlKHNpYmwpOyBzaWJsID0gc2libC5uZXh0U2libGluZykge1xuICAgICAgICAgICAgdGFpbGluZ1RleHQgKz0gZ2V0VGV4dEZyb21Ob2RlKHNpYmwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YWlsaW5nVGV4dDtcbn1cbmZ1bmN0aW9uIGV4dHJhY3RTZW50ZW5jZUhlYWQobGVhZGluZ1RleHQpIHtcbiAgICAvLyBzcGxpdCByZWdleHAgdG8gcHJldmVudCBiYWNrdHJhY2tpbmdcbiAgICBpZiAobGVhZGluZ1RleHQpIHtcbiAgICAgICAgY29uc3QgcHVuY1Rlc3RlciA9IC9bLj8h44CC77yf77yB4oCmXS87XG4gICAgICAgIC8qKiBtZWFuaW5nZnVsIGNoYXIgYWZ0ZXIgZG90IFwiLlwiICovXG4gICAgICAgIGNvbnN0IGNoYXJUZXN0ZXIgPSAvW15cXHMuPyHjgILvvJ/vvIHigKZdLztcbiAgICAgICAgZm9yIChsZXQgaSA9IGxlYWRpbmdUZXh0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgICBjb25zdCBjID0gbGVhZGluZ1RleHRbaV07XG4gICAgICAgICAgICBpZiAocHVuY1Rlc3Rlci50ZXN0KGMpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGMgPT09ICcuJyAmJiBjaGFyVGVzdGVyLnRlc3QobGVhZGluZ1RleHRbaSArIDFdKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBhLmIgaXMgYWxsb3dlZFxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlYWRpbmdUZXh0LnNsaWNlKGkgKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbGVhZGluZ1RleHQ7XG59XG5mdW5jdGlvbiBleHRyYWN0U2VudGVuY2VUYWlsKHRhaWxpbmdUZXh0KSB7XG4gICAgLy8gbWF0Y2ggdGFpbCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgXCIuLi5cIlxuICAgIGNvbnN0IHRhaWxNYXRjaCA9IC9eKChcXC4oPyFbXFxzLj8h44CC77yf77yB4oCmXSkpfFteLj8h44CC77yf77yB4oCmXSkqKFsuPyHjgILvvJ/vvIHigKZdKXswLDN9Ly5leGVjKHRhaWxpbmdUZXh0KTtcbiAgICAvLyB0aGUgcmVnZXhwIHdpbGwgbWF0Y2ggZW1wdHkgc3RyaW5nIHNvIGl0IGlzIHVubGlrZWx5IHRvIGhhdmUgbnVsbCByZXN1bHRcbiAgICByZXR1cm4gdGFpbE1hdGNoID8gdGFpbE1hdGNoWzBdIDogLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gJyc7XG59XG5mdW5jdGlvbiBnZXRUZXh0RnJvbU5vZGUobm9kZSkge1xuICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBOb2RlLlRFWFRfTk9ERSkge1xuICAgICAgICByZXR1cm4gbm9kZS5ub2RlVmFsdWUgfHwgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi8gJyc7XG4gICAgfVxuICAgIGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgIHJldHVybiBub2RlLmlubmVyVGV4dCB8fCAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogU1ZHPyAqLyAnJztcbiAgICB9XG4gICAgcmV0dXJuICcnO1xufVxuZnVuY3Rpb24gaXNJbmxpbmVOb2RlKG5vZGUpIHtcbiAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBzd2l0Y2ggKG5vZGUubm9kZVR5cGUpIHtcbiAgICAgICAgY2FzZSBOb2RlLlRFWFRfTk9ERTpcbiAgICAgICAgY2FzZSBOb2RlLkNPTU1FTlRfTk9ERTpcbiAgICAgICAgY2FzZSBOb2RlLkNEQVRBX1NFQ1RJT05fTk9ERTpcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICBjYXNlIE5vZGUuRUxFTUVOVF9OT0RFOiB7XG4gICAgICAgICAgICBzd2l0Y2ggKG5vZGUudGFnTmFtZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ0EnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0FCQlInOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0InOlxuICAgICAgICAgICAgICAgIGNhc2UgJ0JESSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnQkRPJzpcbiAgICAgICAgICAgICAgICBjYXNlICdCUic6XG4gICAgICAgICAgICAgICAgY2FzZSAnQ0lURSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnQ09ERSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnREFUQSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnREZOJzpcbiAgICAgICAgICAgICAgICBjYXNlICdFTSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnSSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnS0JEJzpcbiAgICAgICAgICAgICAgICBjYXNlICdNQVJLJzpcbiAgICAgICAgICAgICAgICBjYXNlICdRJzpcbiAgICAgICAgICAgICAgICBjYXNlICdSUCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnUlQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ1JUQyc6XG4gICAgICAgICAgICAgICAgY2FzZSAnUlVCWSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnUyc6XG4gICAgICAgICAgICAgICAgY2FzZSAnU0FNUCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnU01BTEwnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ1NQQU4nOlxuICAgICAgICAgICAgICAgIGNhc2UgJ1NUUk9ORyc6XG4gICAgICAgICAgICAgICAgY2FzZSAnU1VCJzpcbiAgICAgICAgICAgICAgICBjYXNlICdTVVAnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ1RJTUUnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ1UnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ1ZBUic6XG4gICAgICAgICAgICAgICAgY2FzZSAnV0JSJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuIiwiZXhwb3J0IGNvbnN0IGdldFNldHRpbmdzID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KCk7XG4gICAgcmV0dXJuIHJlcztcbn07XG5leHBvcnQgY29uc3Qgc2V0U2V0dGluZ3MgPSBhc3luYyAodmFsdWVzKSA9PiB7XG4gICAgcmV0dXJuIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHZhbHVlcyk7XG59O1xuZXhwb3J0IGNvbnN0IGdldFN0b3JhZ2VXb3JkQXJyID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJlcyA9IGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMuZ2V0KHsgJ3dvcmRBcnInOiBbXSB9KTtcbiAgICByZXR1cm4gcmVzWyd3b3JkQXJyJ107XG59O1xuZXhwb3J0IGNvbnN0IGFkZFN0b3JhZ2VXb3JkID0gYXN5bmMgKHsgd29yZCwgY29udGV4dCB9KSA9PiB7XG4gICAgY29uc3QgbmV3V29yZCA9IHsgd29yZCwgY29udGV4dCwgZGF0ZTogbmV3IERhdGUoKS5nZXRUaW1lKCkgfTtcbiAgICBjb25zdCBhcnIgPSBhd2FpdCBnZXRTdG9yYWdlV29yZEFycigpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICAgICAgcmV0dXJuIGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHsgd29yZEFycjogWy4uLmFyciwgbmV3V29yZF0gfSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gY2hyb21lLnN0b3JhZ2Uuc3luYy5zZXQoeyB3b3JkQXJyOiBbbmV3V29yZF0gfSk7XG4gICAgfVxufTtcbmV4cG9ydCBjb25zdCByZW1vdmVTdG9yYWdlV29yZCA9IGFzeW5jICh3b3JkKSA9PiB7XG4gICAgY29uc3Qgd29yZEFyciA9IGF3YWl0IGdldFN0b3JhZ2VXb3JkQXJyKCk7XG4gICAgY29uc3QgbmV3V29yZEFyciA9IHdvcmRBcnIuZmlsdGVyKChpdGVtKSA9PiBpdGVtLndvcmQgIT09IHdvcmQpO1xuICAgIHJldHVybiBjaHJvbWUuc3RvcmFnZS5zeW5jLnNldCh7IHdvcmRBcnI6IG5ld1dvcmRBcnIgfSk7XG59O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBhZGRTdG9yYWdlV29yZCB9IGZyb20gXCIuLi91dGlscy9zZXR0aW5nXCI7XG5pbXBvcnQgeyBnZXRTZW50ZW5jZUZyb21TZWxlY3Rpb24gfSBmcm9tIFwiLi4vdXRpbHMvZ2V0U2VsZWN0aW9uXCI7XG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoZnVuY3Rpb24gKHJlcXVlc3QsIHNlbmRlciwgc2VuZFJlc3BvbnNlKSB7XG4gICAgaWYgKHJlcXVlc3QudHlwZSA9PT0gJ3JlbWFyaycpIHtcbiAgICAgICAgYWRkU3RvcmFnZVdvcmQoe1xuICAgICAgICAgICAgd29yZDogcmVxdWVzdC53b3JkLFxuICAgICAgICAgICAgY29udGV4dDogZ2V0U2VudGVuY2VGcm9tU2VsZWN0aW9uKHdpbmRvdy5nZXRTZWxlY3Rpb24oKSlcbiAgICAgICAgfSk7XG4gICAgfVxufSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=