/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/await-to-js/dist/await-to-js.es5.js":
/*!**********************************************************!*\
  !*** ./node_modules/await-to-js/dist/await-to-js.es5.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "to": () => (/* binding */ to)
/* harmony export */ });
/**
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise }
 */
function to(promise, errorExt) {
    return promise
        .then(function (data) { return [null, data]; })
        .catch(function (err) {
        if (errorExt) {
            Object.assign(err, errorExt);
        }
        return [err, undefined];
    });
}


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (to);
//# sourceMappingURL=await-to-js.es5.js.map


/***/ }),

/***/ "./frontend/bridgeAPI.js":
/*!*******************************!*\
  !*** ./frontend/bridgeAPI.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DeroBridgeApi)
/* harmony export */ });
/* harmony import */ var nanoid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nanoid */ "./node_modules/nanoid/index.browser.js");

class DeroBridgeApi {
  constructor() {
    this.channel = new MessageChannel();
    this.initialized = false;
    this.resolves = new Map();
  }

  call(cmd) {
    if (!this.initialized) return Promise.reject(new Error(`Not initialized.`));
    const id = (0,nanoid__WEBPACK_IMPORTED_MODULE_0__.nanoid)();
    const msg = {
      id,
      cmd
    };
    const promise = new Promise((resolve, reject) => {
      this.channel.port1.addEventListener('message', event => {
        if (event.data.id === id) {
          const {
            err,
            data
          } = event.data;
          if (data) resolve(data);else if (err) reject(err);else reject(new Error(`Empty event.`));
        }

        if (event.data === 'disconnected') {
          this.initialized = false;
          reject(event);
        }
      }, {
        once: true
      });
      this.channel.port1.start();
    });
    this.channel.port1.postMessage(msg);
    return promise;
  }

  daemon(action, args) {
    return this.call({
      entity: 'daemon',
      action,
      args
    });
  }

  wallet(action, args) {
    return this.call({
      entity: 'wallet',
      action,
      args
    });
  }

  init() {
    if (this.initialized) return Promise.reject(new Error(`Already initialized.`));
    return new Promise((resolve, reject) => {
      let timeoutId = setTimeout(() => {
        if (!this.initialized) reject(new Error(`Can't initialized.`));
      }, 1000);
      this.channel.port1.addEventListener('message', event => {
        if (event.data === 'initialized') {
          this.initialized = true;
          resolve();
        } else {
          clearTimeout(timeoutId);
          reject(new Error(`Can't initialized.`));
        }
      }, {
        once: true
      });
      this.channel.port1.start();
      window.postMessage('init-dero-bridge', '*', [this.channel.port2]);
    });
  }

}

/***/ }),

/***/ "./frontend/completePurchase.js":
/*!**************************************!*\
  !*** ./frontend/completePurchase.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
  const response = await fetch(`http://templisaquaria.com/wp-json/ldlms/v1/sfwd-courses/${courseID}/users`, {
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

/***/ }),

/***/ "./frontend/payment-gateway-ui.scss":
/*!******************************************!*\
  !*** ./frontend/payment-gateway-ui.scss ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "./node_modules/nanoid/index.browser.js":
/*!**********************************************!*\
  !*** ./node_modules/nanoid/index.browser.js ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "customAlphabet": () => (/* binding */ customAlphabet),
/* harmony export */   "customRandom": () => (/* binding */ customRandom),
/* harmony export */   "nanoid": () => (/* binding */ nanoid),
/* harmony export */   "random": () => (/* binding */ random),
/* harmony export */   "urlAlphabet": () => (/* reexport safe */ _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__.urlAlphabet)
/* harmony export */ });
/* harmony import */ var _url_alphabet_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./url-alphabet/index.js */ "./node_modules/nanoid/url-alphabet/index.js");

let random = bytes => crypto.getRandomValues(new Uint8Array(bytes))
let customRandom = (alphabet, defaultSize, getRandom) => {
  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1
  let step = -~((1.6 * mask * defaultSize) / alphabet.length)
  return (size = defaultSize) => {
    let id = ''
    while (true) {
      let bytes = getRandom(step)
      let j = step
      while (j--) {
        id += alphabet[bytes[j] & mask] || ''
        if (id.length === size) return id
      }
    }
  }
}
let customAlphabet = (alphabet, size = 21) =>
  customRandom(alphabet, size, random)
let nanoid = (size = 21) =>
  crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
    byte &= 63
    if (byte < 36) {
      id += byte.toString(36)
    } else if (byte < 62) {
      id += (byte - 26).toString(36).toUpperCase()
    } else if (byte > 62) {
      id += '-'
    } else {
      id += '_'
    }
    return id
  }, '')


/***/ }),

/***/ "./node_modules/nanoid/url-alphabet/index.js":
/*!***************************************************!*\
  !*** ./node_modules/nanoid/url-alphabet/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "urlAlphabet": () => (/* binding */ urlAlphabet)
/* harmony export */ });
const urlAlphabet =
  'useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict'


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
/*!****************************************!*\
  !*** ./frontend/payment-gateway-ui.js ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _payment_gateway_ui_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./payment-gateway-ui.scss */ "./frontend/payment-gateway-ui.scss");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-dom */ "react-dom");
/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var await_to_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! await-to-js */ "./node_modules/await-to-js/dist/await-to-js.es5.js");
/* harmony import */ var _completePurchase__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./completePurchase */ "./frontend/completePurchase.js");
/* harmony import */ var _bridgeAPI__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./bridgeAPI */ "./frontend/bridgeAPI.js");







var attributes;
document.addEventListener("DOMContentLoaded", event => {
  const allAttributes = document.querySelectorAll(".attributes");
  allAttributes.forEach(attributeElement => {
    attributes = JSON.parse(attributeElement.innerText);
    const currentBlockName = attributes.name;
    const currentBlock = document.querySelectorAll('.replace-' + currentBlockName)[0];
    react_dom__WEBPACK_IMPORTED_MODULE_3___default().render((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(Gateway, attributes), currentBlock);
    currentBlock.classList.remove("replace-" + currentBlockName);
  });
});

const Gateway = props => {
  const [size, setSize] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  console.log(attributes.user_id);
  let isCustom = new Boolean(false);

  if (attributes.DSCID == '') {
    isCustom = true;
  } else if (attributes.TSCID == '') {
    isCustom = false;
  } else if (attributes.DSCID == '' && attributes.TSCID == '' && attributes.isDirectTransfer == 'on') {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "payBlock"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "\u274C Missing Smart Contract ID, Gateway needs a contract to function, if direct transfer is disabled.")));
  }

  if (attributes.isDirectTransfer == 'on' && attributes.USDamount == undefined) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "payBlock"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "\u274C Missing USD Price, USD Price needs to be greater than 0 if Direct transfer is enabled.")));
  }

  if (attributes.courseID == undefined) {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "payBlock"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "\u274C Missing Course ID, Needs a course ID for the user to purchase.")));
  } //Validates whether the course with provided courseID exists or not


  let isCourseIDValid = new Boolean(true);

  const checkCourseID = async () => {
    await fetch(`https://templisaquaria.com/wp-json/ldlms/v1/sfwd-courses/${attributes.courseID}`).then(response => response.json()).then(data => {
      console.log(data);

      if (data.date == undefined) {
        isCourseIDValid = false;
      } else if (data.date) {
        isCourseIDValid = true;
      }
    }).catch(error => {
      console.log(error);
      isCourseIDValid = false;
    });
    console.log('Is Course ID Valid: ' + isCourseIDValid);

    if (!isCourseIDValid) {
      alert('⚠️ Invalid Course ID, Please enter a valid course ID.');
    }
  };

  checkCourseID();

  if (attributes.destinationWalletAddress == undefined && attributes.isDirectTransfer == 'on') {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "payBlock"
    }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "\u274C Missing Destination Wallet Address, Destination Wallet is required when Direct Transfer is on.")));
  }

  let isAPIKeyValid = new Boolean(true);
  fetch('https://api.livecoinwatch.com/coins/single', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-api-key': attributes.APIKey
    },
    body: JSON.stringify({
      "currency": "USD",
      "code": "DERO"
    })
  }).then(res => {
    res.json();

    if (res.error.code == 401) {
      isAPIKeyValid = false;
    }
  }).catch(error => {
    isAPIKeyValid = false;
  });

  if (!isAPIKeyValid) {
    attributes.APIKey = undefined;
    console.log('API Key is invalid, Chaning it to Default key');
  }

  console.log('Bridging...');
  const deroBridgeApiRef = react__WEBPACK_IMPORTED_MODULE_2___default().useRef();
  const [bridgeInitText, setBridgeInitText] = react__WEBPACK_IMPORTED_MODULE_2___default().useState('');
  react__WEBPACK_IMPORTED_MODULE_2___default().useEffect(() => {
    const load = async () => {
      deroBridgeApiRef.current = new _bridgeAPI__WEBPACK_IMPORTED_MODULE_6__["default"]();
      const deroBridgeApi = deroBridgeApiRef.current;
      const [err] = await (0,await_to_js__WEBPACK_IMPORTED_MODULE_4__["default"])(deroBridgeApi.init());

      if (err) {
        setBridgeInitText('Failed to connect to the extension ❌');
      } else {
        setBridgeInitText('Connected to extension ✅');
      }
    };

    window.addEventListener('load', load);
    return () => window.removeEventListener('load', load);
  }, []);
  const getWalletBalance = react__WEBPACK_IMPORTED_MODULE_2___default().useCallback(async () => {
    const deroBridgeApi = deroBridgeApiRef.current;
    const [err, res] = await (0,await_to_js__WEBPACK_IMPORTED_MODULE_4__["default"])(deroBridgeApi.wallet('get-balance'));
    if (err) alert(err.message);else {
      alert('Wallet Balance 📇: ' + res.data.result.balance);
    }
  }, []);
  const getWalletTokenBalance = react__WEBPACK_IMPORTED_MODULE_2___default().useCallback(async () => {
    const deroBridgeApi = deroBridgeApiRef.current;
    const [err, res] = await (0,await_to_js__WEBPACK_IMPORTED_MODULE_4__["default"])(deroBridgeApi.wallet('get-balance', {
      SCID: props.TSCID
    }));
    if (err) alert(err.message);else alert('Wallet Token Balance 🪙: ' + res.result.balance);
  }, []);
  const transfer = react__WEBPACK_IMPORTED_MODULE_2___default().useCallback(async () => {
    if (isCustom && attributes.isDirectTransfer == 'on') {
      const deroBridgeApi = deroBridgeApiRef.current;
      const [err, res] = await (0,await_to_js__WEBPACK_IMPORTED_MODULE_4__["default"])(deroBridgeApi.wallet('start-transfer', {
        //Token custom smart contract
        scid: attributes.TSCID,
        destination: attributes.destinationWalletAddress,
        amount: attributes.token
      }));
      console.log(err);
      console.log(res);
      (0,_completePurchase__WEBPACK_IMPORTED_MODULE_5__.completePurchase)(attributes.courseID, attributes.user_id).then(response => {
        console.log(response);
      }).catch(error => {
        alert(error);
      });
    } else if (!isCustom && attributes.isDirectTransfer == 'on') {
      const deroBridgeApi = deroBridgeApiRef.current;
      const [err, res] = await (0,await_to_js__WEBPACK_IMPORTED_MODULE_4__["default"])(deroBridgeApi.wallet('start-transfer', {
        //DERO custom smart contract
        scid: attributes.DSCID,
        destination: attributes.destinationWalletAddress,
        amount: USDtoDERO()
      }));
      console.log(err);
      console.log(res);
      (0,_completePurchase__WEBPACK_IMPORTED_MODULE_5__.completePurchase)(attributes.courseID, attributes.user_id).then(response => {
        console.log(response);
      }).catch(error => {
        alert(error);
      });
    } else {
      const deroBridgeApi = deroBridgeApiRef.current;
      const [err, res] = await (0,await_to_js__WEBPACK_IMPORTED_MODULE_4__["default"])(deroBridgeApi.wallet('start-transfer', {
        scid: '0000000000000000000000000000000000000000000000000000000000000000',
        //Default dero token
        destination: attributes.destinationWalletAddress,
        amount: USDtoDERO()
      }));
      console.log(err);
      console.log(res);
      (0,_completePurchase__WEBPACK_IMPORTED_MODULE_5__.completePurchase)(attributes.courseID, attributes.user_id).then(response => {
        console.log(response);
      }).catch(error => {
        alert(error);
      });
    }
  }, []);

  const USDtoDERO = async () => {
    const packet = {
      "currency": "USD",
      "code": "DERO"
    };
    let myAPIKey;

    if (attributes.APIKey == undefined || attributes.APIKey == '') {
      //Default API Key
      myAPIKey = 'c8573f42-e797-43e9-811d-07effb255ad8';
    } else {
      myAPIKey = attributes.APIKey;
    }

    const rawResponse = await fetch('https://api.livecoinwatch.com/coins/single', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': myAPIKey
      },
      body: JSON.stringify(packet)
    }).catch(error => {
      alert('Something went wrong, :( Please try again later.');
    });
    const content = await rawResponse.json();
    let currentRate = content.rate;
    let DEROamount = attributes.USDamount * (1 / currentRate); //   Converts USD Amount to DERO Amount based upon current rate

    DEROamount = DEROamount.toFixed(5); //    Uses 5 Atomic Unit Precision for DERO Amount

    DEROamount = parseFloat(DEROamount);
    console.log(myAPIKey);
    console.log(content.rate);
    console.log(content);
    console.log(DEROamount);
    return DEROamount;
  };

  let test = USDtoDERO();
  console.log(test);
  console.log('Is Direct Transfer: ' + attributes.isDirectTransfer);
  console.log(attributes.isDirectTransfer == 'on');
  console.log(attributes.isDirectTransfer);
  let currency = 'DERO';

  if (isCustom) {
    currency = 'Tokens';
  }

  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "payBlock"
  }, (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("h3", null, " Pay with DERO \uD83D\uDD0F\uD83E\uDE99"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: transfer
  }, "Purchase"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: getWalletBalance
  }, "Check My Wallet Balance"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    onClick: getWalletTokenBalance
  }, "Check My Token Balance"), (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Price: ", props.USDamount, " ", currency));
};
})();

/******/ })()
;
//# sourceMappingURL=payment-gateway-ui.js.map