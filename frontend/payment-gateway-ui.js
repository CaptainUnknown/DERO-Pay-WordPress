import "./payment-gateway-ui.scss"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import to from 'await-to-js'

import { ReactComponent as Loading } from "./Loading.svg" 

import { completePurchase } from "./completePurchase"
import { validateTX } from "./validateTX"
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

var isShopify = false;
var isLearnDash = false;
var isCustomEP = false;
var walletBalance = '0' + ' DERO';
var tokenBalance = '0' + ' Tokens';
var isCustom = false;
var isDirectTransfer = false;
var currency;
var DEROPrice;
var txid = '';
var completePurchaseOptions;
var isExchangeRateValid = true;

const Gateway = (props) => {
  const [txidVisibility, setTxidVisibility] = useState(false);
  const [confirmTxVisibility, setConfirmTxVisibility] = useState(false);
  const [balanceInfoVisibility, setBalanceInfoVisibility] = useState(false);
  const [loadingVisibility, setLoadingVisibility] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const [txProofVisibility, setTxProofVisibility] = useState(false);
  const [txProof, setTxProof] = useState('');
  const [errorVisibility, setErrorVisibility] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const deroBridgeApiRef = React.useRef()
  const [bridgeInitText, setBridgeInitText] = React.useState('')

  if (attributes.transferMethod == 'ctsc') {
    isCustom = true;
  } else if (attributes.transferMethod == 'cdsc') {
    isCustom = false;
  } else if (attributes.transferMethod == 'dt') {
    isDirectTransfer = true;
    isCustom = false;
  } else if (attributes.transferMethod == undefined) {
    return <div className="payBlock"> <p> ❌  Missing Transfer Method, Please select one of the payment methods. </p> </div>
  }

  if (isCustom) {
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
  } else if (!isCustom && !isDirectTransfer) {
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

  if (isDirectTransfer) {
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

  if (isShopify) {
    if (attributes.shopifyAdminServerURI == undefined) {
      return <div className="payBlock"> <p> ❌  Missing Admin Server URI, It'll handle discount code generation. </p> </div>
    }
    if (attributes.shopifyProductID == undefined) {
      return <div className="payBlock"> <p> ❌  Missing Product ID, Visit Shopify admin panel to get the product ID. </p> </div>
    }
  } else if (isLearnDash) {
    if (attributes.courseID == undefined) {
      return <div className="payBlock"> <p> ❌  Missing Course ID, Needs a valid course ID for the user to purchase. </p> </div>
    }
    if (attributes.courseSiteURL == undefined) {
      return <div className="payBlock"> <p> ❌  Missing Course Site URL, Please provide a valid your website URL (where courses are hosted on). </p> </div>
    }
  } else if (isCustomEP) {
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
  if (attributes.APIKey == undefined) {
    return <div className="payBlock"> <p> ❌  Missing Coin Ranking API Key, It's required for getting exchange rates. </p> </div>
  }

  //Validates whether the course with provided courseID exists or not
  const checkCourseID = () => {
    let isCourseIDValid = true;
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

  const USDtoDERO = () => {
    fetch("https://api.livecoinwatch.com/coins/single", {
      body: "{\"currency\":\"USD\",\"code\":\"DERO\",\"meta\":false}",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": attributes.APIKey
      },
      method: "POST"
    })
    .then(res => res.json())
    .then(data => {
      let currentRate = data.rate;
      let DEROamount = attributes.USDamount * (1 / currentRate);
      DEROamount = DEROamount.toFixed(5);
      DEROamount = parseFloat(DEROamount) * 100000;
      DEROPrice = DEROamount;
      console.log(`DERO Price: ${DEROPrice}`);
    })
    .catch(err => {
      console.log(err);
      console.error('❌ If you are owner of this site, make sure if Livecoinwatch API key is valid or not.');
      isExchangeRateValid = false;
    });
  }

  //Initialize Complete Purchase Options
  const initCompletePurchase = () => {
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
          adminServerURI: attributes.shopifyAdminServerURI,
          price: attributes.USDamount,
          quantity: productQuantity,
          productID: attributes.shopifyProductID,
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
    return () => {
      window.removeEventListener('load', load)
    }
  }, [])

  const getWalletBalance = React.useCallback(async () => {
    const deroBridgeApi = deroBridgeApiRef.current;
    const [err, res] = await to(deroBridgeApi.wallet('get-balance'));
    if (err) {
      console.log(err);
      setErrorMessage('❌ Failed to get wallet balance, Please make sure to connect & authorize DERO RPC Bridge Extension.');
      setErrorVisibility(true);
    }
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
      console.log(err);
      setErrorMessage('❌ Failed to get token balance, Please make sure to connect & authorize DERO RPC Bridge Extension.');
      setErrorVisibility(true);
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
        amount: DEROPrice * productQuantity
      }]
    }))
    .then(res => {
      console.log(res);
      console.log(res[1].data.result.txid);
      if(res[1].data.result.txid != ''){
        txid = res[1].data.result.txid;
        setTxidVisibility(true);
      }
    })
    .catch(err => {
      console.log(err);
      setErrorMessage('❌ Transact Failed, Check Console for more details.');
      setErrorVisibility(true);
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
      console.log(res[1].data.result.txid);
      if(res[1].data.result.txid != ''){
        txid = res[1].data.result.txid;
        completePurchase(completePurchaseOptions)
        .then(response => {
          console.log(response);
          console.log('Purchase Completed ✅');
          setTxidVisibility(true);
        });
      }
    })
    .catch(err => {
      console.log(err);
      setErrorMessage('❌ Transact Failed, Check Console for more details.');
      setErrorVisibility(true);
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
      console.log(res[1].data.result.txid);
      if(res[1].data.result.txid != ''){
        txid = res[1].data.result.txid;
        completePurchase(completePurchaseOptions)
        .then(response => {
          console.log(response);
          console.log('Purchase Completed ✅');
          setTxidVisibility(true);
        });
      }
    })
    .catch(err => {
      console.log(err);
      setErrorMessage('❌ Transact Failed, Check Console for more details.');
      setErrorVisibility(true);
    });
  }, [])

  if (isCustom)  currency = attributes.tokenName;
  else currency = 'USD';

  return (<>

  {/* Wallet Balance Popup */}
    <div onClick={() => {setBalanceInfoVisibility(false)}} className="popupWrapper" style={{ display: balanceInfoVisibility ? "flex" : "none" }}>
      <div className="popup" style={{ height: "fit-content", width: "fit-content" }}>
        Wallet Balance:
        <div style={{ display: !isCustom || isDirectTransfer ? "flex" : "none" }}><p> { walletBalance } </p></div>
        <div style={{ display: isCustom && !isDirectTransfer ? "flex" : "none" }}><p> { tokenBalance } </p></div>
        <button onClick={() => { setBalanceInfoVisibility(false) }}> OK </button>
      </div>
    </div>

    {/* Pay Block */}
    <div className="payBlock">
      <h3> Pay with DERO </h3>

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

    {/* Confirm TX Popup */}
    <div onClick={() => { setConfirmTxVisibility(false) }} className="popupWrapper" style={{ display: confirmTxVisibility ? "flex" : "none" }}>
      <div className="popup" style={{ height: "fit-content", width: "fit-content", flexDirection: "column" }}>
        Do you want to proceed with this transaction? <br />
        <div style={{ display: !isDirectTransfer ? "flex" : "none", flexDirection: "row" }}> Smart Contract ID to be invoked: {props.DSCID || props.TSCID} </div>
        <div style={{ display: isDirectTransfer? "flex" : "none", flexDirection: "row" }}> You will be sending {props.USDamount * productQuantity} {currency} to {props.destinationWalletAddress} </div>
        <button onClick={() => {
          setConfirmTxVisibility(false);
          setLoadingVisibility(true);
          USDtoDERO();
          setTimeout(() => {
            setLoadingVisibility(false);
          
            if(isExchangeRateValid){
              if(isDirectTransfer) transferDERO()
              else if(!isDirectTransfer && isCustom) callTSC()
              else callDSC()
            } else {
              setLoadingVisibility(false);
              setErrorMessage('⚠️ Something went wrong while getting current exchange rates for DERO, Please reload (or press F5) & try again.');
              setErrorVisibility(true);
            }
          }, 2000);
        }}> Confirm </button>
      </div>
    </div>

    {/* TX Success Popup */}
    <div className="popupWrapper" style={{ display: txidVisibility ? "flex" : "none" }}>
      <div className="popup" style={{ height: "fit-content", width: "fit-content" }}>
        Congrats! Transaction was successful, here's your transaction ID:
        <p> {txid} </p>
        <button onClick={() => {
          setTxidVisibility(false);
          //verifyTx();
          setTxProofVisibility(true);
        }}> OK </button>
      </div>
    </div>

    {/* Proof Popup */}    
    <div className="popupWrapper" style={{ display: txProofVisibility ? "flex" : "none" }}>
      <div className="popup" style={{ height: "fit-content" }}>
        Please provide your transaction proof for confirmation:
        (You can get this from your wallet or from the transaction history in Engram)
        <input type="text" onChange={(e) => { setTxProof(e.target.value) }} />
        <button onClick={() => {
          setLoadingVisibility(true);
          let isTXConfirmed = false;
          if (validateTX(txid, txProof, DEROPrice * productQuantity, destinationWalletAddress)) isTXConfirmed = true;
          if (isTXConfirmed) {
            completePurchase(completePurchaseOptions)
              .then(response => {
                console.log(response);
                console.log('Purchase Completed ✅');
                setLoadingVisibility(false);

                setErrorMessage('✅ Transaction Confirmed! Purchase Completed.');
                setErrorVisibility(true);
              });
          } else {
            setErrorMessage('❌ Invalid Transaction, Try again!');
            setLoadingVisibility(false);
            setErrorVisibility(true);
          }
        }}> Next </button>
      </div>
    </div>
    
    {/* Error Popup */}
    <div className="popupWrapper" style={{ display: errorVisibility ? "flex" : "none" }} onClick={() => { setErrorVisibility(false) }}>
      <div className="popup" style={{ height: "fit-content", width: "fit-content", flexDirection: "row", alignItems: "flex-start" }}>
        <span> { errorMessage } </span>
      </div>
    </div>
    
    {/* Loading Popup */}
    <div className="popupWrapper" style={{ display: loadingVisibility ? "flex" : "none" }}>
      <div className="popup" style={{ height: "fit-content", width: "fit-content", flexDirection: "row", alignItems: "flex-start" }}>
        <Loading/>
        <span> Loading, Please wait... </span>
      </div>
    </div>

  </>)
}