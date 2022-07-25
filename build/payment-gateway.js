/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./backend/payment-gateway.scss":
/*!**************************************!*\
  !*** ./backend/payment-gateway.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/*!************************************!*\
  !*** ./backend/payment-gateway.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _payment_gateway_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./payment-gateway.scss */ "./backend/payment-gateway.scss");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__);




const EditComponent = props => {
  const updateTSCID = event => {
    props.setAttributes({
      TSCID: event.target.value
    });
  };

  const updateTokenAmount = event => {
    props.setAttributes({
      tokenAmount: event.target.value
    });
  };

  const updateDSCID = event => {
    props.setAttributes({
      DSCID: event.target.value
    });
  };

  const updateAmount = event => {
    props.setAttributes({
      USDamount: event.target.value
    });
  };

  const updateAPIKey = event => {
    props.setAttributes({
      APIKey: event.target.value
    });
  };

  const updateIsDirectTransfer = event => {
    props.setAttributes({
      isDirectTransfer: event.target.value
    });
  };

  const updateCourseID = event => {
    props.setAttributes({
      courseID: event.target.value
    });
  };

  const updateDestinationWalletAddress = event => {
    props.setAttributes({
      destinationWalletAddress: event.target.value
    });
  };

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "configurationBlock"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, "\uD83D\uDD0F DERO Payment Gateway Configuration \uD83D\uDD27"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Token \uD83E\uDE99 Payment Smart Contract \uD83C\uDD94 \uD83D\uDCC3: ", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    id: "TSCID",
    value: props.attributes.TSCID,
    placeholder: "Token SCID",
    onChange: updateTSCID
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Custom Token Price \uD83E\uDE99: ", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "number",
    id: "tokenAmount",
    value: props.attributes.tokenAmount,
    placeholder: "100 MTK",
    onChange: updateTokenAmount
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "DERO \uD83D\uDCB1 Payment Smart Contract \uD83C\uDD94 \uD83D\uDCC3: ", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    id: "DSCID",
    value: props.attributes.DSCID,
    placeholder: "DERO SCID",
    onChange: updateDSCID
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("label", null, "Is Direct Transfer: ", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "checkbox",
    id: "isDirectTransfer",
    onChange: updateIsDirectTransfer
  })), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "USD Price \uD83D\uDCB2: ", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "number",
    id: "amount",
    value: props.attributes.USDamount,
    placeholder: "$100",
    onChange: updateAmount
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Course ID \uD83D\uDD22: ", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "number",
    id: "courseID",
    value: props.attributes.courseID,
    placeholder: "1234",
    onChange: updateCourseID
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Livecoinwatch.com \uD83E\uDE99 API Key \uD83D\uDDDD\uFE0F (Optional): ", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    id: "APIKey",
    value: props.attributes.APIKey,
    placeholder: "XXXX-XXXX",
    onChange: updateAPIKey
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null)), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Destination Wallet Address \uD83D\uDCC7: ", (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("input", {
    type: "text",
    id: "destinationWalletAddress",
    value: props.attributes.destinationWalletAddress,
    placeholder: "deroqyXXXX",
    onChange: updateDestinationWalletAddress
  }), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null)));
};

(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_2__.registerBlockType)("dero/payment-gateway", {
  title: 'DERO Payment Gateway',
  icon: 'money-alt',
  category: "common",
  attributes: {
    TSCID: {
      type: 'string'
    },
    tokenAmount: {
      type: 'integer'
    },
    DSCID: {
      type: 'string'
    },
    USDamount: {
      type: 'integer'
    },
    courseID: {
      type: 'integer'
    },
    APIKey: {
      type: 'string'
    },
    isDirectTransfer: {
      type: 'boolean'
    },
    destinationWalletAddress: {
      type: 'string'
    }
  },
  edit: EditComponent,
  save: function () {
    return null;
  }
});
})();

/******/ })()
;
//# sourceMappingURL=payment-gateway.js.map