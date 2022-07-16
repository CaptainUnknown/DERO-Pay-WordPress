wp.blocks.registerBlockType('derorpc/gateway', {
    title: 'DERO Payment Gateway',
    icon: 'money-alt',
    category: 'common',
    attribute: {
        SCID: {type: 'string'},
        USDamount: {type: 'integer'},
        APIKey: {type: 'string'},
    },
    edit: (props) => {
        const updateSCID = (event) => {
            props.setAttributes({SCID: event.target.value});
        }
        const updateAmount = (event) => {
            props.setAttributes({USDamount: event.target.value});
        }
        const updateAPIKey = (event) => {
            props.setAttributes({APIKey: event.target.value});
        }
        const USDtoDERO = async(event) => {
            const packet = {
                "currency": "USD",
                "code": "DERO"
            }

            let myAPIKey = 'c8573f42-e797-43e9-811d-07effb255ad8'; //c8573f42-e797-43e9-811d-07effb255ad8 Hard Coded For DEBUGGING

            if(props.attributes.APIKey == '') {
                //Default API Key
                myAPIKey = 'c8573f42-e797-43e9-811d-07effb255ad8';
            }
            else{
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
            
            let DEROamount = 99.999 * (1/currentRate);
            DEROamount = DEROamount.toFixed(5);         //   Converts USD Amount to DERO Amount based upon current rate
            DEROamount = parseFloat(DEROamount);       //    Uses 5 Atomic Unit Precision for DERO Amount

            console.log(content.rate);
            console.log(content);
            console.log(DEROamount);
        }
        return (
            <div>
                <h3>DERO Payment Gateway Configuration</h3>
                <input type='text' id='SCID' value={props.attributes.SCID} placeholder='Smart Contract Address' onChange={updateSCID}/>
                <input type='number' id='amount' value={props.attributes.USDamount} placeholder='Amount in DERO' onChange={updateAmount}/>
                <input type='number' id='APIKey' value={props.attributes.APIKey} placeholder='livecoinwatch API Key (Visit: livecoinwatch.com)' onChange={updateAPIKey}/>
            </div>
        )
    },
    save: (props) => {
        return (
            <div>
                <h3>DERO Payment Gateway</h3>
                <p>Smart Contract Address: {props.attributes.SCID}</p>
                <p>Amount in USD: {props.attributes.USDamount}</p>
            </div>
        )
    }
})