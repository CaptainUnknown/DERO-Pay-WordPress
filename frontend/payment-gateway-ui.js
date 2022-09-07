import "./payment-gateway-ui.scss"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import to from 'await-to-js'

import { completePurchase } from "./completePurchase"
import DeroBridgeApi from './bridgeAPI'

var attributes;
document.addEventListener("DOMContentLoaded", (event) => {
  const allAttributes = document.querySelectorAll(".attributes");
  allAttributes.forEach(attributeElement => {
    attributes = JSON.parse(attributeElement.innerText);
    const currentBlockName = attributes.name;
    const currentBlock = document.querySelectorAll('.replace-' + currentBlockName)[0];
    ReactDOM.render(<Gateway {...attributes} />, currentBlock);
    currentBlock.classList.remove("replace-" + currentBlockName);
  });
});

var isShopify = new Boolean(false);
var isLearnDash = new Boolean(false);
var isCustomEP = new Boolean(false);
var walletBalance = '0' + ' DERO';
var tokenBalance = '0' + ' Tokens';
var isCustom = new Boolean(false);
var isDirectTransfer = new Boolean(false);
var currency;
var DEROPrice;
var txid = '';
var completePurchaseOptions;

const Gateway = (props) => {
  const [txidVisibility, setTxidVisibility] = useState(false);
  const [confirmTxVisibility, setConfirmTxVisibility] = useState(false);
  const [balanceInfoVisibility, setBalanceInfoVisibility] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);

  const deroBridgeApiRef = React.useRef()
  const [bridgeInitText, setBridgeInitText] = React.useState('')

  console.log('Current User ID:' + attributes.user_id);

  if (attributes.transferMethod == 'ctsc') {
    isCustom = true;
  } else if (attributes.transferMethod == 'cdsc') {
    isCustom = false;
  } else if (attributes.transferMethod == 'dt') {
    isDirectTransfer = true;
    isCustom = false;
  } else {
    return <div className="payBlock"> <p> ❌  Missing Transfer Method, Please select one of the payment methods. </p> </div>
  }

  if (isCustom == true) {
    if (attributes.tokenName == undefined) {
      return <div className="payBlock"> <p> ❌  Missing Token Name, Please provide a token name to let your users know. </p> </div>
    }
    if (attributes.TSCID == undefined) {
      return <div className="payBlock"> <p> ❌  Missing Token Smart Contract ID, Gateway needs a valid Smart Contract. </p> </div>
    }
    if (attributes.tokenAmount == undefined) {
      return <div className="payBlock"> <p> ❌  Missing Token Price, Gateway needs a valid Token Price. </p> </div>
    }
    if (attributes.SCRPC == undefined) {
      return <div className="payBlock"> <p> ❌  Missing Smart Contract RPC Parameters. </p> </div>
    }
  } else {
    if (attributes.DSCID == undefined) {
      return <div className="payBlock"> <p> ❌  Missing DERO Smart Contract ID, Gateway needs a valid Smart Contract. </p> </div>
    }
    if (attributes.USDamount == undefined) {
      return <div className="payBlock"> <p> ❌  Missing USD Price, USD Price needs to be greater than 0. </p> </div>
    }
    if (attributes.SCRPC == undefined) {
      return <div className="payBlock"> <p> ❌  Missing Smart Contract RPC Parameters. </p> </div>
    }
  }

  if (isDirectTransfer == true) {
    if (attributes.destinationWalletAddress == undefined) {
      return <div className="payBlock"> <p> ❌  Missing Destination Wallet Address, Please enter a valid wallet address to recieve your revenue in. </p> </div>
    }
    if (attributes.USDamount == undefined) {
      return <div className="payBlock"> <p> ❌  Missing USD Price, USD Price needs to be greater than 0. </p> </div>
    }
  }

  //Comment out this block if you are using custom script as completePurchase.js
  if (attributes.actionPreset == 'shopify') {
    isShopify = true;
  } else if (attributes.actionPreset == 'learnDash') {
    isLearnDash = true;
  } else if (attributes.actionPreset == 'customEP') {
    isCustomEP = true;
  } else {
    return <div className="payBlock"> <p> ❌  Missing Action Preset, Please select atleast of the actions to be executed after a successful purchase. </p> </div>
  }

  if (isShopify == true) {
    if (attributes.shopifyStoreName == undefined) {
      return <div className="payBlock"> <p> ❌  Missing  ,  . </p> </div>
    }//This check will not be required 
    if (attributes.shopifyAccessToken == undefined) {
      return <div className="payBlock"> <p> ❌  Missing  ,  . </p> </div>
    }
    if (attributes.shopifyVariantID == undefined) {
      return <div className="payBlock"> <p> ❌  Missing Product Variant ID, Checkout can't be processed with invalid Product ID. </p> </div>
    }
  } else if (isLearnDash == true) {
    if (attributes.courseID == undefined) {
      return <div className="payBlock"> <p> ❌  Missing Course ID, Needs a valid course ID for the user to purchase. </p> </div>
    }
    if (attributes.courseSiteURL == undefined) {
      return <div className="payBlock"> <p> ❌  Missing Course Site URL, Please provide a valid your website URL (where courses are hosted on). </p> </div>
    }
  } else if (isCustomEP == true) {
    if (attributes.fetchMethod == undefined) {
      return <div className="payBlock"> <p> ❌  Missing Fetch Method, Please select a valid Fetch Method for your Custom Endpoint. </p> </div>
    } else if (attributes.fetchMethod == "POST" || attributes.fetchMethod == "PUT") {
      if (attributes.CEPBody == undefined) {
        return <div className="payBlock"> <p> ❌  Missing Fetch Body, Non-stringified Body is required for Fetch Methods, PUT & POST. </p> </div>
      }
    } else {
      if (attributes.CEPURL == undefined) {
        return <div className="payBlock"> <p> ❌  Missing Fetch URL, A valid URL is required for all Fetch Methods. </p> </div>
      }
      if (attributes.CEPHeader == undefined) {
        return <div className="payBlock"> <p> ❌  Missing Fetch Header, Non-stringified Header is required for all Fetch Methods. </p> </div>
      }
    }
  }

  //Validates whether the course with provided courseID exists or not
  const checkCourseID = () => {
    let isCourseIDValid = new Boolean(true);
    fetch(`http://${attributes.courseSiteURL}/wp-json/ldlms/v1/sfwd-courses/${attributes.courseID}/users`)
    .then(response => response.json())
    .then(data => {
      if (data.date == undefined) {
        isCourseIDValid = false;
      } else if (data.date) {
        isCourseIDValid = true;
      }
    })
    .catch(error => {
      console.log(error);
      isCourseIDValid = false;
    });
    if (!isCourseIDValid) {
      console.warn('⚠️ Invalid Course ID, It seems either the CourseID or the Course Site URL or both of the parameters you provided are invalid. Plugin may not function as expected!');
    }
  }
  if (isLearnDash){
    checkCourseID();
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
  })
  .then(res => {
    res.json();
    if (res.error.code == 401) {
      isAPIKeyValid = false;
    }
  })
  .catch(error => {
    isAPIKeyValid = false;
  });

  if (!isAPIKeyValid) {
    attributes.APIKey = undefined;
    console.warn('API Key is invalid, Chaning it to Default key (Providing one ensures the plugin wont run out of daily API Limit).');
  }

  const USDtoDERO = () => {
    let myAPIKey;
    if (attributes.APIKey == undefined || attributes.APIKey == '') {
      //Default API Key
      myAPIKey = 'c8573f42-e797-43e9-811d-07effb255ad8';
    } else {
      myAPIKey = attributes.APIKey;
    }

    var rawResponse;
    fetch("https://api.livecoinwatch.com/coins/single", {
      body: "{\"currency\":\"USD\",\"code\":\"DERO\",\"meta\":false}",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": myAPIKey
      },
      method: "POST"
    })
      .then(res => res.json())
      .then(data => {
        rawResponse = data;

        const content = rawResponse;
        let currentRate = content.rate;

        let DEROamount = attributes.USDamount * (1 / currentRate);
        DEROamount = DEROamount.toFixed(5);
        DEROamount = parseFloat(DEROamount) * 100000;
        console.log(content);
        console.log(DEROamount);

        DEROPrice = DEROamount;
      })
      .catch(err => {
        alert('🌐 Something went wrong while getting current exchange rates for DERO, Please try again later.');
        console.log(err);
        console.error('If you are owner of this site, try changing Livecoinwatch API key');
        return <div className="payBlock"> <p> ❌  Something Went wrong, Please try again later. </p> </div>
      });
  }
  USDtoDERO();

  //Initialize Complete Purchase Options
  if(isLearnDash){
    completePurchaseOptions = {
      action: 'learnDash',
      learnDash: {
        courseID: attributes.courseID,
        courseSiteURL: attributes.courseSiteURL
      }
    }
  }
  if(isShopify){
    completePurchaseOptions = {
      action: 'shopify',
      shopify: {
        storeName: attributes.shopifyStoreName,
        accessToken: attributes.shopifyAccessToken,
        variantID: attributes.shopifyVariantID
      }
    }
  }
  if(isCustomEP){
    completePurchaseOptions = {
      action: 'customEP',
      customEP: {
        method: attributes.fetchMethod,
        url: attributes.CEPURL,
        header: attributes.CEPHeader,
        body: attributes.CEPBody
      }
    }
  }


  React.useEffect(() => {
    const load = async () => {
      deroBridgeApiRef.current = new DeroBridgeApi()
      const deroBridgeApi = deroBridgeApiRef.current
      const [err] = await to(deroBridgeApi.init())
      if (err) {
        setBridgeInitText('Failed to Connect to the Extension ❌')
      } else {
        setBridgeInitText('Connected to the Extension ✅')
      }
    }
    window.addEventListener('load', load)
    return () => window.removeEventListener('load', load)
  }, [])


  const getWalletBalance = React.useCallback(async () => {
    const deroBridgeApi = deroBridgeApiRef.current;
    const [err, res] = await to(deroBridgeApi.wallet('get-balance'));
    if (err) alert(err.message);
    else {
      console.log(res);
      walletBalance = res.data.result.balance / 100000 + ' DERO';
      setBalanceInfoVisibility(true);
    }
  }, [])

  const getTokenBalance = React.useCallback(async () => {
    const deroBridgeApi = deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('get-balance', { SCID: attributes.TSCID }))
    if (err){
      alert(err.message);
    }
    else {
      console.log(res);
      tokenBalance = res.data.result.balance / 100000 + ' ' + attributes.tokenName;
      setBalanceInfoVisibility(true);
    }
  }, [])

  const transferDERO = React.useCallback(async () => {
    const deroBridgeApi = deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
      transfers: [{
        destination: attributes.destinationWalletAddress,
        amount: DEROPrice * productQuantity,
        burn: 0,
      }]
    }))
    .then(res => {
      console.log(res);
      console.log(res[1].data.result.txid);
      console.log(res[1].data.result.txid != '');
      if(res[1].data.result.txid != ''){
        txid = res[1].data.result.txid;
        completePurchase(completePurchaseOptions)
        .then(response => {
          console.log(response);
          console.log('Purchase Completed');
          setTxidVisibility(true);
        });
      }
    })
    .catch(err => {
      console.log(err);
      alert('Transact Failed 🌐, Check Console for more details.');
    });
  }, [])

  const callDSC = React.useCallback(async () => {
    const deroBridgeApi = deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
      ringsize: attributes.ringSize || 1,
      sc_rpc: attributes.SCRPC,
      transfers: [{
        scid: attributes.DSCID,
        amount: DEROPrice * productQuantity,
      }]
    }))
    .then(res => {
      console.log(res);
      console.log(res[1].data.result.txid);
      console.log(res[1].data.result.txid != '');
      if(res[1].data.result.txid != ''){
        txid = res[1].data.result.txid;
        completePurchase(completePurchaseOptions)
        .then(response => {
          console.log(response);
          console.log('Purchase Completed');
          setTxidVisibility(true);
        });
      }
    })
    .catch(err => {
      console.log(err);
      alert('Transact Failed 🌐, Check Console for more details.');
    });
  }, [])

  const callTSC = React.useCallback(async () => {
    const deroBridgeApi = deroBridgeApiRef.current
    const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
      ringsize: attributes.ringSize || 1,
      sc_rpc: attributes.SCRPC,
      transfers: [{
        scid: attributes.TSCID,
        amount: attributes.tokenAmount * productQuantity,
      }]
    }))
    .then(res => {
      console.log(res);
      console.log(res[1].data.result.txid);
      console.log(res[1].data.result.txid != '');
      if(res[1].data.result.txid != ''){
        txid = res[1].data.result.txid;
        completePurchase(completePurchaseOptions)
        .then(response => {
          console.log(response);
          console.log('Purchase Completed');
          setTxidVisibility(true);
        });
      }
    })
    .catch(err => {
      console.log(err);
      alert('Transact Failed 🌐, Check Console for more details.');
    });
  }, [])

  if (isCustom) {
    currency = attributes.tokenName;
  }
  else {
    currency = 'USD';
  }

  return (<>
    <div onClick={() => {setBalanceInfoVisibility(false)}} className="popupWrapper" style={{ display: balanceInfoVisibility ? "flex" : "none" }}>
      <div className="popup" style={{ height: "200px" }}>
        Wallet Balance:
        <div style={{ display: !isCustom || isDirectTransfer ? "flex" : "none" }}><p> { walletBalance } </p></div>
        <div style={{ display: isCustom && !isDirectTransfer ? "flex" : "none" }}><p> { tokenBalance } </p></div>
        <button onClick={() => { setBalanceInfoVisibility(false) }}> OK </button>
      </div>
    </div>


    <div className="payBlock">
      <h3> Pay with DERO! 🔏🪙</h3>

      <div style={{ display: attributes.actionPreset == 'shopify'? "flex" : "none" }}>
        <div className="productCounter">
          <p> Quantity: { productQuantity } </p>
        </div>
        <div className="productCounter">
          <button onClick={() => { if(productQuantity < 10){setProductQuantity(productQuantity + 1)} }}> Add </button> <button onClick={() => { if(productQuantity > 0){setProductQuantity(productQuantity - 1)} }}> Remove </button>
        </div>
      </div>
      <button onClick={() => { setConfirmTxVisibility(true) }}>Purchase</button>
      <div style={{ display: !isCustom || isDirectTransfer ? "flex" : "none" }}>
        <button onClick={() => { getWalletBalance() }}> Check My Wallet Balance </button>
      </div>
      <div style={{ display: isCustom && !isDirectTransfer ? "flex" : "none" }}>
        <button onClick={() => { getTokenBalance() }}> Check My Token Balance </button>
      </div>
      
      <p> Price: { props.USDamount || props.tokenAmount } { currency } </p>
      <p> { bridgeInitText } </p>
    </div>


    <div onClick={() => {setConfirmTxVisibility(false)}} className="popupWrapper" style={{ display: confirmTxVisibility ? "flex" : "none" }}>
      <div className="popup" style={{ height: "200px" }}>
        Do you want to proceed with this transaction? <br />
        <div style={{ display: !isDirectTransfer ? "flex" : "none" }}> Smart Contract ID to be invoked: <p> {props.DSCID || props.TSCID} </p> </div>
        <div style={{ display: isDirectTransfer? "flex" : "none" }}> You will be sending <p> {props.USDamount * productQuantity} {currency} </p>⠀to <p> {props.destinationWalletAddress} </p> </div>
        <button onClick={() => {
          setConfirmTxVisibility(false);
          if(isDirectTransfer){
            transferDERO();
          } else if(!isDirectTransfer && isCustom) {
            callTSC();
          } else {
            callDSC();
          }
        }}> Confirm </button>
      </div>
    </div>
    

    <div onClick={() => {
      setTxidVisibility(false);
      setTimeout(() => {
        console.log('Refreshing...');
        window.location.reload();
      }, 3000)
      }} className="popupWrapper" style={{ display: txidVisibility ? "flex" : "none" }}>
      <div className="popup" style={{ height: "225px" }}>
        Congrats! Transaction was successful, here's your transaction ID:
        <p> {txid} </p>
        <button onClick={() => {
          setTxidVisibility(false);
          setTimeout(() => {
            console.log('Refreshing...');
            window.location.reload();
          }, 3000)
        }}> OK </button>
      </div>
    </div>

  </>)
}