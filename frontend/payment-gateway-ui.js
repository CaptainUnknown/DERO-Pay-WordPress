import "./payment-gateway-ui.scss"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import to from 'await-to-js'
import axios from "axios"

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

const Gateway = (props) => {
  const [txidVisibility, setTxidVisibility] = useState(false);
  const [confirmTxVisibility, setConfirmTxVisibility] = useState(false);
  const [balanceInfoVisibility, setBalanceInfoVisibility] = useState(false);
  const [txProofVisibility, setTxProofVisibility] = useState(false);
  const [loadingVisibility, setLoadingVisibility] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const [txProof, setTxProof] = useState('');

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
      return <div className="payBlock"> <p> ❌  Missing Shopify Store Name, If you're not sure about this, Visit Shopify Dashboard. </p> </div>
    }//This check will not be required 
    if (attributes.shopifyAccessToken == undefined) {
      return <div className="payBlock"> <p> ❌  Missing Shopify Access Token, If you're not sure about this, Visit Shopify Dashboard. </p> </div>
    }
    if (attributes.shopifyVariantID == undefined) {
      return <div className="payBlock"> <p> ❌  Missing Product Variant ID, Checkout can't be processed with invalid Product Variant ID. </p> </div>
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
    let config = {
      method: 'get',
      url: 'https://api.coinranking.com/v2/coin/9jgCbgZ_J9mj-',
      headers: {
        'x-access-token': attributes.APIKey
      }
    };

    axios(config)
    .then(function (response) {
      let exchangeRate = parseFloat(response.data.data.coin.price);
      console.log(exchangeRate);
        
      DEROPrice = attributes.USDamount * (1 / exchangeRate);
      DEROPrice = parseFloat(DEROPrice.toFixed(5));
      DEROPrice = DEROPrice * 100000;
      console.log(DEROPrice);
    })
    .catch(function (error) {
      console.log(error);
      //alert('⚠️ Something went wrong while getting current exchange rates for DERO, Please try again later.');
      console.error('❌ If you are owner of this site, try checking if CoinRanking API key is valid.');
    });
  }

  //Initialize Complete Purchase Options
  if(isLearnDash == true){
    completePurchaseOptions = {
      action: 'learnDash',
      learnDash: {
        courseID: attributes.courseID,
        courseSiteURL: attributes.courseSiteURL
      }
    }
  }
  if(isShopify == true){
    completePurchaseOptions = {
      action: 'shopify',
      shopify: {
        storeName: attributes.shopifyStoreName,
        accessToken: attributes.shopifyAccessToken,
        variantID: attributes.shopifyVariantID
      }
    }
  }
  if(isCustomEP == true){
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
        amount: DEROPrice * productQuantity
      }]
    }))
    .then(res => {
      console.log(res);
      console.log(res[1].data.result.txid);
      console.log(res[1].data.result.txid != '');
      if(res[1].data.result.txid != ''){
        txid = res[1].data.result.txid;
        setTxidVisibility(true);
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
          console.log('Purchase Completed ✅');
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
          console.log('Purchase Completed ✅');
          setTxidVisibility(true);
        });
      }
    })
    .catch(err => {
      console.log(err);
      alert('Transact Failed 🌐, Check Console for more details.');
    });
  }, [])

  if (isCustom)  currency = attributes.tokenName;
  else currency = 'USD';

  return (<>

  {/* Wallet Balance Popup */}
    <div onClick={() => {setBalanceInfoVisibility(false)}} className="popupWrapper" style={{ display: balanceInfoVisibility ? "flex" : "none" }}>
      <div className="popup" style={{ height: "fit-content" }}>
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
      <button onClick={() => {
        setConfirmTxVisibility(true);
        //completePurchase(completePurchaseOptions);
        }}>Purchase</button>
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
      <div className="popup" style={{ height: "fit-content" }}>
        Do you want to proceed with this transaction? <br />
        <div style={{ display: !isDirectTransfer ? "flex" : "none" }}> Smart Contract ID to be invoked: <p> {props.DSCID || props.TSCID} </p> </div>
        <div style={{ display: isDirectTransfer? "flex" : "none" }}> You will be sending <p> {props.USDamount * productQuantity} {currency} </p>⠀to <p> {props.destinationWalletAddress} </p> </div>
        <button onClick={() => {
          setConfirmTxVisibility(false);
          setLoadingVisibility(true);
          USDtoDERO();
          setTimeout(() => {
            setLoadingVisibility(false);
            
            if(isDirectTransfer) transferDERO()
            else if(!isDirectTransfer && isCustom) callTSC()
            else callDSC()
          }, 2000);
        }}> Confirm </button>
      </div>
    </div>
    

    {/* TX Success Popup */}
    <div className="popupWrapper" style={{ display: txidVisibility ? "flex" : "none" }}>
      <div className="popup" style={{ height: "fit-content" }}>
        Congrats! Transaction was successful, here's your transaction ID:
        <p> {txid} </p>
        <button onClick={() => {
          setTxidVisibility(false);
          setTxProofVisibility(true);
        }}> OK </button>
      </div>
    </div>

    {/* Proof Popup */}
    <div className="popupWrapper" style={{ display: txProofVisibility ? "flex" : "none" }}>
      <div className="popup" style={{ height: "fit-content" }}>
        Please provide your transaction proof for confirmation:
        (You can get this from your wallet or from the transaction history in Engram)
        <input type="text" onChange={(e) => {setTxProof(e.target.value)}} />
        <button onClick={() => {
          setLoadingVisibility(true);
          let isTXConfirmed = false;
          if(validateTX(txid, txProof, DEROPrice * productQuantity, destinationWalletAddress) == 202) isTXConfirmed = true;
          if(isTXConfirmed){
            completePurchase(completePurchaseOptions)
            .then(response => {
              console.log(response);
              console.log('Purchase Completed ✅');
              setLoadingVisibility(false);
              setTxidVisibility(true);
            });
          } else {
            alert('❌ Invalid Transaction, Try again!');
            setLoadingVisibility(false);
          }
        }}> Prove </button>
      </div>
    </div>
    
    {/* Loading Popup */}
    <div className="popupWrapper" style={{ display: loadingVisibility ? "flex" : "none" }}>
      <div className="popup" style={{ height: "fit-content", flexDirection: "row", alignItems: "flex-start" }}>
        <Loading/>
        <span> Verifying, Please wait... </span>
      </div>
    </div>

  </>)
}