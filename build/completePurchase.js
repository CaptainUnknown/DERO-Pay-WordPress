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
/*!**************************************!*\
  !*** ./frontend/completePurchase.js ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "completePurchase": () => (/* binding */ completePurchase)
/* harmony export */ });
const handleError = error => {
  console.warn(error);
  return new Response(JSON.stringify({
    code: error.data.status,
    message: error.data.message
  }));
};

const completePurchase = async (courseID, userID) => {
  let data = {
    "user_ids": [userID]
  };
  let packet = JSON.stringify(data);
  console.log(purchaseData.nonce);
  const response = await fetch(`https://templisaquaria.com/wp-json/ldlms/v1/sfwd-courses/${courseID}/users`, {
    body: packet,
    headers: {
      'Content-Type': "application/json",
      'X-WP-Nonce': purchaseData.nonce
    },
    method: "POST"
  }).catch(error => {
    handleError(error);
  });

  if (response.ok) {
    return response.json();
  } else {
    return Promise.reject(response);
  }
};
/******/ })()
;
//# sourceMappingURL=completePurchase.js.map