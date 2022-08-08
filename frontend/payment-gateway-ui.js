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
    const [size, setSize] = useState(false);

    var DEROPrice;

    console.log(attributes.user_id);

    let isCustom = new Boolean(false);
    if(attributes.DSCID == ''){
        isCustom = true;
    }
    else if(attributes.TSCID == ''){
        isCustom = false;
    }
    else if(attributes.DSCID == '' && attributes.TSCID == '' && attributes.isDirectTransfer == 'off'){
        return <>
        <div className="payBlock">
            <p>❌ Missing Smart Contract ID, Gateway needs a contract to function, if direct transfer is disabled.</p>
        </div>
        </>
    }

    if(attributes.isDirectTransfer == 'on' && attributes.USDamount == undefined){
        return <>
        <div className="payBlock">
            <p>❌ Missing USD Price, USD Price needs to be greater than 0 if Direct transfer is enabled.</p>
        </div>
        </>
    }

    if(attributes.courseID == undefined){
        return <>
        <div className="payBlock">
            <p>❌ Missing Course ID, Needs a course ID for the user to purchase.</p>
        </div>
        </>
    }

    //Validates whether the course with provided courseID exists or not
    let isCourseIDValid = new Boolean(true);
    const checkCourseID = async () => {
        await fetch(`https://templisaquaria.com/wp-json/ldlms/v1/sfwd-courses/${attributes.courseID}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.date == undefined){
                isCourseIDValid = false;
            }
            else if (data.date) {
                isCourseIDValid = true;
            }
        })
        .catch(error => {
            console.log(error);
            isCourseIDValid = false;
        });
    
        console.log('Is Course ID Valid: ' + isCourseIDValid);
        if (!isCourseIDValid){
            alert('⚠️ Invalid Course ID, Please enter a valid course ID.');
        }
    }
    checkCourseID();

    if(attributes.destinationWalletAddress == undefined && attributes.isDirectTransfer == 'on'){
        return <>
        <div className="payBlock">
            <p>❌ Missing Destination Wallet Address, Destination Wallet is required when Direct Transfer is on.</p>
        </div>
        </>
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
        if(res.error.code == 401){
            isAPIKeyValid = false;
        }
    })
    .catch(error => {
        isAPIKeyValid = false;
    });
    if(!isAPIKeyValid){
        attributes.APIKey = undefined;
        console.log('API Key is invalid, Chaning it to Default key');
    }

    const USDtoDERO = () => {
        let myAPIKey;
        if(attributes.APIKey == undefined || attributes.APIKey == '') {
            //Default API Key
            myAPIKey = 'c8573f42-e797-43e9-811d-07effb255ad8';
        }
        else {
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
            console.log(rawResponse);
            console.log(rawResponse);

            const content = rawResponse;
            let currentRate = content.rate;
    
            console.log(content);
            console.log(currentRate);
            
            let DEROamount = attributes.USDamount * ( 1 / currentRate );   //   Converts USD Amount to DERO Amount based upon current rate
            DEROamount = DEROamount.toFixed(5);                           //    Uses 5 Atomic Unit Precision for DERO Amount
            DEROamount = parseFloat(DEROamount) * 100000;                //     Converts back to DERO atmoic format
            console.log(content.rate);                                  //      It's very weird that for some reason DEROamount is very inconsistently deviated by a value of +-0.00000000004, smh...
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

    console.log('Is Direct Transfer: ' + attributes.isDirectTransfer);
    console.log(attributes.isDirectTransfer == 'on');
    console.log(attributes.isDirectTransfer);


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