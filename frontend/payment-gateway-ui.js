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
        ReactDOM.render(<Gateway {...attributes}/>, currentBlock);
        currentBlock.classList.remove("replace-" + currentBlockName);
    });
});

const Gateway = (props) => {
  var DEROPrice;
  console.log('Current User ID:' + attributes.user_id);
  
  let isCustom = new Boolean(false);
  let isDirectTransfer = new Boolean(false);
  if(attributes.transferMethod == 'ctsc'){
    isCustom = true;
  } else if(attributes.transferMethod == 'cdsc'){
    isCustom = false;
  } else if(attributes.transferMethod == 'dt'){
    isDirectTransfer = true;
  } else{
    return <> <div className="payBlock"> <p> ❌  Missing Transfer Method, Please select one of the payment methods. </p> </div> </>
  }
  
  if(isCustom == true){
    if(attributes.TSCID == undefined){
      return <> <div className="payBlock"> <p> ❌  Missing Token Smart Contract ID, Gateway needs a valid Smart Contract. </p> </div> </>
    }
    if(attributes.tokenAmount == undefined){
      return <> <div className="payBlock"> <p> ❌  Missing Token Price, Gateway needs a valid Token Price. </p> </div> </>
    }
  } else {
    if(attributes.DSCID == undefined){
      return <> <div className="payBlock"> <p> ❌  Missing DERO Smart Contract ID, Gateway needs a valid Smart Contract. </p> </div> </>
    }
    if(attributes.USDamount == undefined){
      return <> <div className="payBlock"> <p> ❌  Missing USD Price, USD Price needs to be greater than 0. </p> </div> </>
    }
  }
  
  if(isDirectTransfer == true){
    if(attributes.destinationWalletAddress == undefined){
      return <> <div className="payBlock"> <p> ❌  Missing Destination Wallet Address, Please enter a valid wallet address to recieve your revenue in. </p> </div> </>
    }
    if(attributes.USDamount == undefined){
      return <> <div className="payBlock"> <p> ❌  Missing USD Price, USD Price needs to be greater than 0. </p> </div> </>
    }
  }
  
  
  //Comment out this block if you are using custom script as completely.js
  let isShopify = new Boolean(false);
  let isLearnDash = new Boolean(false);
  let isCustomEP = new Boolean(false);
  if(attributes.actionPreset == 'shopify'){
    isShopify = true;
  } else if(attributes.actionPreset == 'learnDash'){
    isLearnDash = true;
  } else if(attributes.actionPreset == 'customEP'){
    isCustomEP = true;
  } else {
    return <> <div className="payBlock"> <p> ❌  Missing Action Preset, Please select atleast of the actions to be executed after a successful purchase. </p> </div> </>
  }
  
  if(isShopify == true){
    if(attributes.shopifyStoreName == undefined){
      return <> <div className="payBlock"> <p> ❌  Missing  ,  . </p> </div> </>
    }//This check will not be required 
    if(attributes.shopifyAccessToken == undefined){
      return <> <div className="payBlock"> <p> ❌  Missing  ,  . </p> </div> </>
    }
  } else if (isLearnDash == true) {
    if(attributes.courseID == undefined){
      return <> <div className="payBlock"> <p> ❌  Missing Course ID, Needs a valid course ID for the user to purchase. </p> </div> </>
    }
    if(attributes.courseSiteURL == undefined){
      return <> <div className="payBlock"> <p> ❌  Missing Course Site URL, Please provide a valid your website URL (where courses are hosted on). </p> </div> </>
    }
  } else if(isCustomEP == true){
    if(attributes.fetchMethod == undefined){
      return <> <div className="payBlock"> <p> ❌  Missing Fetch Method, Please select a valid Fetch Method for your Custom Endpoint. </p> </div> </>
    } else if (attributes.fetchMethod == "POST" || attributes.fetchMethod == "PUT"){
      if(attributes.CEPBody == undefined){
        return <> <div className="payBlock"> <p> ❌  Missing Fetch Body, Non-stringified Body is required for Fetch Methods, PUT & POST. </p> </div> </>
      }
    } else {
      if(attributes.CEPURL == undefined){
        return <> <div className="payBlock"> <p> ❌  Missing Fetch URL, A valid URL is required for all Fetch Methods. </p> </div> </>
      }
      if(attributes.CEPHeader == undefined){
        return <> <div className="payBlock"> <p> ❌  Missing Fetch Header, Non-stringified Header is required for all Fetch Methods. </p> </div> </>
      }
    }
  }
  
  //Validates whether the course with provided courseID exists or not
  let isCourseIDValid = new Boolean(true);
  const checkCourseID = async () => {
    await fetch(attributes.courseSiteURL + attributes.courseID)
    .then(response => response.json())
    .then(data => {
      if (data.date == undefined){
        isCourseIDValid = false;
      } else if (data.date) {
        isCourseIDValid = true;
      }
    })
    .catch(error => {
      console.log(error);
      isCourseIDValid = false;
    });
    
    console.log('Is Course ID Valid: ' + isCourseIDValid);
    if (!isCourseIDValid){
      alert('⚠️ Invalid Course ID, It seems either the CourseID or the Course Site URL or both of the parameters you provided are invalid. Plugin may not function as expected!');
    }
  }
  checkCourseID();
  
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
    if(res.error.code == 401){
      isAPIKeyValid = false;
    }
  })
  .catch(error => {
    isAPIKeyValid = false;
  });

  if(!isAPIKeyValid){
    attributes.APIKey = undefined;
    console.log('API Key is invalid, Chaning it to Default key (Providing one ensures the plugin wont run out of daily API Limit).');
  }
  
  const USDtoDERO = () => {
    let myAPIKey;
    if(attributes.APIKey == undefined || attributes.APIKey == '') {
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
      
      let DEROamount = attributes.USDamount * ( 1 / currentRate );   //   Converts USD Amount to DERO Amount based upon current rate
      DEROamount = DEROamount.toFixed(5);                           //    Uses 5 Atomic Unit Precision for DERO Amount
      DEROamount = parseFloat(DEROamount) * 100000;                //     Converts back to DERO atmoic format
      console.log(content);
      console.log(DEROamount);
      
      DEROPrice = DEROamount;
    })
    .catch(err => {
      alert('🌐 Something went wrong while getting current exchange rates for DERO, Please try again later.');
      console.log(err);
    });
  }
  USDtoDERO();
  
  console.log('Bridging...');

    const deroBridgeApiRef = React.useRef();
    const [bridgeInitText, setBridgeInitText] = React.useState('');
  
    React.useEffect(() => {
      const load = async () => {
        deroBridgeApiRef.current = new DeroBridgeApi();
        const deroBridgeApi = deroBridgeApiRef.current;
        const [err] = await to(deroBridgeApi.init());
        if (err) {
          setBridgeInitText('Failed to connect to the Extension ❌');
        } else {
          setBridgeInitText('Connected to the Extension ✅');
        }
      }
  
      window.addEventListener('load', load);
      return () => window.removeEventListener('load', load);
    }, []);

    const getWalletBalance = React.useCallback(async () => {
        const deroBridgeApi = deroBridgeApiRef.current;
        const [err, res] = await to(deroBridgeApi.wallet('get-balance'));
        if (err) 
            alert(err.message);
        else{
            alert('Wallet Balance 📇: ' + res.data.result.balance / 100000 + ' DERO');
        }
    }, []);

    const getWalletTokenBalance = React.useCallback(async () => {
        const deroBridgeApi = deroBridgeApiRef.current;
        const [err, res] = await to(deroBridgeApi.wallet('get-balance', { SCID: props.TSCID }));
        if (err)
            alert(err.message);
        else
            alert('Wallet Token Balance 🪙: ' + res.result.balance / 100000 + ' Tokens');
    }, []);

    const transfer = React.useCallback(async () => {
        console.log(DEROPrice);
        if(attributes.isDirectTransfer == 'on'){
            const deroBridgeApi = deroBridgeApiRef.current;
            const [err, res] = await to(deroBridgeApi.wallet('start-transfer', { //Direct Transfer
                transfers: [{
                    destination: attributes.destinationWalletAddress,
                    amount: DEROPrice,
                    burn: 0,
                }]
            }))
            .then(res => {
                if(res[1].data.result.txid != ''){
                    completePurchase(attributes.courseID, attributes.user_id)
                    .then(response => {
                        console.log(response);
                    });
                    alert('Purchase Completed ✅');
                    setTimeout(() => {
                        console.log('Refreshing...');
                        window.location.reload();
                    }, 3000);
                }
            })
            .catch(err => {
                console.log(err);
                alert('Transact Failed 🌐, Check Console for more details.');
            });
        }
        else if (!isCustom && attributes.isDirectTransfer == 'off'){
            /*
            const deroBridgeApi = deroBridgeApiRef.current;
            const [err, res] = await to(deroBridgeApi.wallet('start-transfer', { // DERO SCID Transfer
              scid: attributes.DSCID,
              destination: attributes.destinationWalletAddress,
              amount: DEROPrice,
            }))
            .then(res => {
                console.log(res);
                console.log(res[1].data.result.txid);
                console.log(res[1].data.result.txid != '');
                if(res[1].data.result.txid != ''){
                    completePurchase(attributes.courseID, attributes.user_id)
                    .then(response => {
                        console.log(response);
                    });
                    alert('Purchase Completed ✅');
                    setTimeout(() => {
                        console.log('Refreshing...');
                        window.location.reload();
                    }, 3000);
                }
            })
            .catch(err => {
                console.log(err);
                alert('Transact Failed 🌐, Check Console for more details.');
            });
            */
        }
        else if (isCustom && attributes.isDirectTransfer == 'off'){ 
            /*
            const deroBridgeApi = deroBridgeApiRef.current;
            const [err, res] = await to(deroBridgeApi.wallet('start-transfer', { //Token Custom Smart Contract
              scid: attributes.TSCID,
              destination: attributes.destinationWalletAddress,
              amount: attributes.tokenAmount,
            }))
            .then(res => {
                console.log(res);
                console.log(res[1].data.result.txid);
                console.log(res[1].data.result.txid != '');
                if(res[1].data.result.txid != ''){
                    completePurchase(attributes.courseID, attributes.user_id)
                    .then(response => {
                        console.log(response);
                    });
                    alert('Purchase Completed ✅');
                    setTimeout(() => {
                        console.log('Refreshing...');
                        window.location.reload();
                    }, 3000);
                }
            })
            .catch(err => {
                console.log(err);
                alert('Transact Failed 🌐, Check Console for more details.');
            });*/
        }
    }, []);
    
    let currency = 'USD';
    if (isCustom){
        currency = 'Tokens';
    }
    if (attributes.isDirectTransfer == 'on'){
        currency = 'USD';
    }

    return (
        <div className="payBlock">
            <h3> Pay with DERO 🔏🪙</h3>
            
            <button onClick={transfer}>Purchase</button>
            <button onClick={getWalletBalance}>Check My Wallet Balance</button>
            <button onClick={getWalletTokenBalance}>Check My Token Balance</button>
            <p>Price: {props.USDamount} {currency}</p><p>{bridgeInitText}</p>
        </div>
    )
}