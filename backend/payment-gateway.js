import "./payment-gateway.scss"
import { registerBlockType } from "@wordpress/blocks"

const EditComponent = (props) => {
    props.attributes.USDamount = 0;
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
    const updateIsDirectTransfer = (event) => {
        props.setAttributes({isDirectTransfer: event.target.value});
    }
    const updateCourseID = (event) => {
        props.setAttributes({courseID: event.target.value});
    }
    const updateDestinationWalletAddress = (event) => {
        props.setAttributes({courseID: event.target.value});
    }

    return (
        <div className="configurationBlock">
            <h3>🔏 DERO Payment Gateway Configuration 🔧</h3>

            <p>Token 🪙 Payment Smart Contract 🆔 📃: <input type='text' id='TSCID' value={props.attributes.TSCID} placeholder='0x______' onChange={updateTSCID}/><br/><br/></p>
            
            <p>DERO 💱 Payment Smart Contract 🆔 📃: <input type='text' id='DSCID' value={props.attributes.DSCID} placeholder='0x______' onChange={updateDSCID}/><br/><br/></p>

            <p><label>Is Direct Transfer: <input type="checkbox" id='isDirectTransfer' onChange={updateIsDirectTransfer} /></label><br/><br/></p>
            
            <p>USD Price 💲: <input type='number' id='amount' value={props.attributes.USDamount} placeholder='$100' onChange={updateAmount}/><br/><br/></p>

            <p>Course ID 🔢: <input type='number' id='courseID' value={props.attributes.courseID} placeholder='1234' onChange={updateCourseID}/><br/><br/></p>

            <p>Livecoinwatch.com 🪙 API Key 🗝️ (Optional): <input type='text' id='APIKey' value={props.attributes.APIKey} placeholder='XXXX-XXXX' onChange={updateAPIKey}/><br/><br/></p>

            <p>Destination Wallet Address 📇: <input type='text' id='destinationWalletAddress' value={props.attributes.destinationWalletAddress} placeholder='deroqy______' onChange={updateDestinationWalletAddress}/><br/><br/></p>
            
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
        courseID: {type: 'integer'},
        APIKey: {type: 'string'},
        isDirectTransfer: {type: 'boolean'},
        destinationWalletAddress: {type: 'string'},
    },
    edit: EditComponent,
    save: function() {
        return null
    }
});