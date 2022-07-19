import "./heading-ui.scss"
import React, { useState } from "react"
import ReactDOM from "react-dom"


document.addEventListener("DOMContentLoaded", (event) => {
    const allAttributes = document.querySelectorAll(".attributes")
    allAttributes.forEach(attributeElement => {
        const attributes = JSON.parse(attributeElement.innerText)
        const currentBlockName = attributes.name
        const currentBlock = document.querySelectorAll('.replace-' + currentBlockName)[0]
        ReactDOM.render(<Heading {...attributes}/>, currentBlock)
        currentBlock.classList.remove("replace-" + currentBlockName)
    })
})


const Heading = (props) => {
    const [size, setSize] = useState(false)

    const USDtoDERO = async(event) => {
        const packet = {
            "currency": "USD",
            "code": "DERO"
        }

        let myAPIKey = 'c8573f42-e797-43e9-811d-07effb255ad8'; //Hard Coded For DEBUGGING

        if(props.attributes.APIKey == '') {
            //Default API Key
            myAPIKey = 'c8573f42-e797-43e9-811d-07effb255ad8';
        }
        else {
            myAPIKey = props.attributes.APIKey;
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
        
        let DEROamount = USDamount * (1/currentRate);   //   Converts USD Amount to DERO Amount based upon current rate
        DEROamount = DEROamount.toFixed(5);            //    Uses 5 Atomic Unit Precision for DERO Amount
        DEROamount = parseFloat(DEROamount);

        console.log(content.rate);
        console.log(content);
        console.log(DEROamount);
        alert('USD to DERO!');
    }
    USDtoDERO();

    return (
        <div className="payBlock">
            <p>
                <button onClick={() => setSize(prev => !prev)}>Toggle heading h1 or h2 size</button>
            </p>
            {size && <h1 style={{color: props.color}}>Mehroz</h1>}
            {!size && <h2 style={{color: props.color}}>Palu</h2>}
        </div>
    )
}