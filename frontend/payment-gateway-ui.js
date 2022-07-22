import "./payment-gateway-ui.scss"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import to from 'await-to-js'

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

    const deroBridgeApiRef = React.useRef()
    const [bridgeInitText, setBridgeInitText] = React.useState('')
  
    React.useEffect(() => {
      const load = async () => {
        deroBridgeApiRef.current = new DeroBridgeApi();
        const deroBridgeApi = deroBridgeApiRef.current;
        const [err] = await to(deroBridgeApi.init());
        if (err) {
          setBridgeInitText('Failed to connect to extension ❌');
        } else {
          setBridgeInitText('Connected to extension ✅');
        }
      }
  
      window.addEventListener('load', load);
      return () => window.removeEventListener('load', load);
    }, []);

    const USDtoDERO = async() => {
        const packet = {
            "currency": "USD",
            "code": "DERO"
        }

        let myAPIKey = 'c8573f42-e797-43e9-811d-07effb255ad8'; //Hard Coded For DEBUGGING PURPOSES props.APIKey

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
        
        let DEROamount = attributes.USDamount * (1/currentRate);   //   Converts USD Amount to DERO Amount based upon current rate
        DEROamount = DEROamount.toFixed(5);            //    Uses 5 Atomic Unit Precision for DERO Amount
        DEROamount = parseFloat(DEROamount);
        console.log(myAPIKey);
        console.log(content.rate);
        console.log(content);
        console.log(DEROamount);

        return DEROamount;
    }

    return (
        <div className="payBlock">
            <h3>🔏 DERO Payment Gateway 🪙</h3>
            <button onClick={transfer}>Send transfer</button>
            <button onClick={getWalletBalance}>Get balance</button>
            <button onClick={getWalletTokenBalance}>Get token balance</button>
            <p>DERO Smart Contract Address: {props.DSCID}</p>
            <p>Amount in USD: {props.USDamount}</p>
            <p>Owner Wallet: {props.ownerWallet}</p>
        </div>
    )
}