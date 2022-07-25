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

    console.log(attributes.user_id);

    let isCustom = new Boolean(false);
    if(attributes.DSCID == ''){
        isCustom = true;
    }
    else if(attributes.TSCID == ''){
        isCustom = false;
    }
    else if(attributes.DSCID == '' && attributes.TSCID == '' && attributes.isDirectTransfer == false){
        return <>
        <div className="payBlock">
            <p>❌ Missing Smart Contract ID, Gateway needs a contract to function, if direct transfer is disabled.</p>
        </div>
        </>
    }

    if(attributes.isDirectTransfer == true && attributes.USDamount == undefined){
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
            if (data.data.status == 404){
                isCourseIDValid = false;
            }
        })
        .catch(err => {
            console.error(err);
            isCourseIDValid = false;
        });
    
        console.log(isCourseIDValid);
        if(!isCourseIDValid){
            return <>
            <div className="payBlock">
                <p>⚠️ Invalid Course ID, Please enter a valid course ID.</p>
            </div>
            </>
        }
    }
    checkCourseID();

    if(attributes.destinationWalletAddress == undefined && attributes.isDirectTransfer == true){
        return <>
        <div className="payBlock">
            <p>❌ Missing Destination Wallet Address, Destination Wallet is required when Direct Transfer is checked.</p>
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
    }).catch(error => {
        alert(error);
        isAPIKeyValid = false;
    });
    if(!isAPIKeyValid){
        attributes.APIKey = '';
    }

    const deroBridgeApiRef = React.useRef();
    const [bridgeInitText, setBridgeInitText] = React.useState('');
  
    React.useEffect(() => {
      const load = async () => {
        deroBridgeApiRef.current = new DeroBridgeApi();
        const deroBridgeApi = deroBridgeApiRef.current;
        const [err] = await to(deroBridgeApi.init());
        if (err) {
          setBridgeInitText('Failed to connect to the extension ❌');
        } else {
          setBridgeInitText('Connected to extension ✅');
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
            alert('Wallet Balance 📇: ' + res.data.result.balance);
        }
    }, []);

    const getWalletTokenBalance = React.useCallback(async () => {
        const deroBridgeApi = deroBridgeApiRef.current;
        const [err, res] = await to(deroBridgeApi.wallet('get-balance', { SCID: props.TSCID }));
        if (err) 
            alert(err.message);
        else
            alert('Wallet Token Balance 🪙: ' + res.result.balance);
    }, []);

    const transfer = React.useCallback(async () => {
        if(isCustom && attributes.isDirectTransfer == false){
            const deroBridgeApi = deroBridgeApiRef.current;
            const [err, res] = await to(deroBridgeApi.wallet('start-transfer', { //Token custom smart contract
              scid: attributes.TSCID,
              destination: attributes.destinationWalletAddress,
              amount: attributes.token,
            }));
        
            console.log(err);
            console.log(res);
    
            completePurchase(attributes.courseID, attributes.user_id)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                alert(error)
            });
        }
        else if (!isCustom && attributes.isDirectTransfer == false){
            const deroBridgeApi = deroBridgeApiRef.current;
            const [err, res] = await to(deroBridgeApi.wallet('start-transfer', { //DERO custom smart contract
              scid: attributes.DSCID,
              destination: attributes.destinationWalletAddress,
              amount: USDtoDERO(),
            }));
        
            console.log(err);
            console.log(res);
    
            completePurchase(attributes.courseID, attributes.user_id)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                alert(error)
            });
        }
        else{
            const deroBridgeApi = deroBridgeApiRef.current;
            const [err, res] = await to(deroBridgeApi.wallet('start-transfer', {
              scid: '0000000000000000000000000000000000000000000000000000000000000000', //Default dero token
              destination: attributes.destinationWalletAddress,
              amount: USDtoDERO(),
            }));
        
            console.log(err);
            console.log(res);
    
            completePurchase(attributes.courseID, attributes.user_id)
            .then(response => {
                console.log(response);
            })
            .catch(error => {
                alert(error)
            });
        }
    }, []);

    const USDtoDERO = async() => {
        const packet = {
            "currency": "USD",
            "code": "DERO"
        }

        if(attributes.APIKey == '') {
            //Default API Key
            myAPIKey = 'c8573f42-e797-43e9-811d-07effb255ad8';
        }
        else {
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
        }).catch(error => {alert(error)});

        const content = await rawResponse.json();
        let currentRate = content.rate;
        
        let DEROamount = attributes.USDamount * ( 1 / currentRate );   //   Converts USD Amount to DERO Amount based upon current rate
        DEROamount = DEROamount.toFixed(5);            //    Uses 5 Atomic Unit Precision for DERO Amount
        DEROamount = parseFloat(DEROamount);
        console.log(myAPIKey);
        console.log(content.rate);
        console.log(content);
        console.log(DEROamount);

        return DEROamount;
    }

    let currency = 'DERO';
    if (isCustom){
        currency = 'Tokens';
    }

    return (
        <div className="payBlock">
            <h3> Pay with DERO 🔏🪙</h3>
            <button onClick={transfer}>Purchase</button>
            <button onClick={getWalletBalance}>Check My Wallet Balance</button>
            <button onClick={getWalletTokenBalance}>Check My Token Balance</button>
            <p>Price: {props.USDamount} {currency}</p>
        </div>
    )
}