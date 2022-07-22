import "./payment-gateway.scss"
import { registerBlockType } from "@wordpress/blocks"

const EditComponent = (props) => {
    const updateDSCID = (event) => {
        props.setAttributes({DSCID: event.target.value});
    }
    const updateTSCID = (event) => {
        props.setAttributes({TSCID: event.target.value});
    }
    const updateAmount = (event) => {
        props.setAttributes({USDamount: event.target.value});
    }
    const updateAPIKey = (event) => {
        props.setAttributes({APIKey: event.target.value});
    }
    const updateOwnerWallet = (event) => {
        props.setAttributes({ownerWallet: event.target.value});
    }
    return (
        <div>
            <h3>🔏 DERO Payment Gateway 🎛️ Configuration! 🔧</h3>
            <p>Token 🪙 Payment Smart Contract 🆔 📃:</p>
            <input type='text' id='TSCID' value={props.attributes.TSCID} placeholder='0x______' onChange={updateTSCID}/><br/>
            <p>DERO 💱 Payment Smart Contract 🆔 📃:</p>
            <input type='text' id='DSCID' value={props.attributes.DSCID} placeholder='0x______' onChange={updateDSCID}/><br/>
            <p>USD Amount 💲:</p>
            <input type='number' id='amount' value={props.attributes.USDamount} placeholder='$100' onChange={updateAmount}/><br/>
            <p>livecoinwatch.com 🪙 API Key 🗝️ (Optional):</p>
            <input type='text' id='APIKey' value={props.attributes.APIKey} placeholder='XXXX-XXXX' onChange={updateAPIKey}/><br/>
            <p>Owner Wallet 📇:</p>
            <input type='text' id='ownerWallet' value={props.attributes.ownerWallet} placeholder='dero1qyXXXX' onChange={updateOwnerWallet}/><br/>
        </div>
    )
}

registerBlockType("dero/payment-gateway", {
    title: 'DERO Payment Gateway',
    icon: 'money-alt',
    category: "common",
    attributes: {
        TSCID: {type: 'string'},
        DSCID: {type: 'string'},
        USDamount: {type: 'integer'},
        APIKey: {type: 'string'},
        ownerWallet: {type: 'string'}
    },
    edit: EditComponent,
    save: function() {
        return null
    }
})