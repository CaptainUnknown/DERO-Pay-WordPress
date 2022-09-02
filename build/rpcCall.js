/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
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
/*!*****************************!*\
  !*** ./frontend/rpcCall.js ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "rpcCall": () => (/* binding */ rpcCall)
/* harmony export */ });
const rpcCall = async options => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(new Error(`timeout`)), 5000);
    const {
      authenticator,
      method,
      params
    } = options;
    const url = 'http://localhost:10103';
    const headers = {
      "Content-Type": "application/json"
    };
    headers["Authorization"] = "Basic " + btoa(`${authenticator}`);
    const body = {
      "jsonrpc": "2.0",
      "id": "1",
      "method": method
    };

    if (params) {
      body["params"] = params;
    }

    const fetchUrl = new URL('json_rpc', url);
    const res = await fetch(fetchUrl, {
      method: "POST",
      mode: 'no-cors',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + btoa(`${authenticator}`)
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return {
        data
      };
    } else {
      return {
        err: res.statusText || "Error"
      };
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      return {
        err: `Timeout`
      };
    }

    return {
      err: err.message
    };
  }
};
/******/ })()
;
//# sourceMappingURL=rpcCall.js.map