import "./styles.css"

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
        const USDtoDERO = async(event) => { //Move to save block
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
        }
        return (
            <div>
                <h3>🔏 DERO Payment Gateway 🎛️ Configuration 🔧</h3>
                <p>Smart Contract ID 📃:</p>
                <input type='text' id='SCID' value={props.attributes.SCID} placeholder='0x______' onChange={updateSCID}/><br/><br/>
                <p>USD Amount 💲:</p>
                <input type='number' id='amount' value={props.attributes.USDamount} placeholder='$100' onChange={updateAmount}/><br/><br/>
                <p>livecoinwatch.com 🪙 API Key 🗝️ (Optional):</p>
                <input type='text' id='APIKey' value={props.attributes.APIKey} placeholder='XXXX-XXXX' onChange={updateAPIKey}/><br/><br/>
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