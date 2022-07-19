import "./heading.scss"
import { registerBlockType } from "@wordpress/blocks"

const EditComponent = (props) => {
    const updateSCID = (event) => {
        props.setAttributes({SCID: event.target.value});
    }
    const updateAmount = (event) => {
        props.setAttributes({USDamount: event.target.value});
    }
    const updateAPIKey = (event) => {
        props.setAttributes({APIKey: event.target.value});
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
}

registerBlockType("dero-payment-gateway/heading", {
    title: 'DERO Payment Gateway',
    icon: 'money-alt',
    category: "common",
    attributes: {
        SCID: {type: 'string'},
        USDamount: {type: 'integer'},
        APIKey: {type: 'string'},
    },
    edit: EditComponent,
    save: function() {
        return null
    }
})