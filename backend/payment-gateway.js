import "./payment-gateway.scss"
import { registerBlockType } from "@wordpress/blocks"
import { useState } from 'react'
import ReactTooltip from 'react-tooltip'

const EditComponent = (props) => {
    const [shopifyOptionsVisibility, setShopifyOptionsVisibility] = useState(false);
    const [learnDashOptionsVisibility, setLearnDashOptionsVisibility] = useState(false);
    const [endPointOptionsVisibility, setEndPointOptionsVisibility] = useState(false);
        const [endPointOptionsBodyOptionsVisibility, setEndPointOptionsBodyOptionsVisibility] = useState(false);

    const [tokenOptionsVisibility, setTokenOptionsVisibility] = useState(false);
    const [deroOptionsVisibility, setDeroOptionsVisibility] = useState(false);
    const [transferOptionsVisibility, setTransferOptionsVisibility] = useState(false);


    const transferMethod = (event) => {
        props.setAttributes({transferMethod: event.target.value});
        console.log(event.target.value);
    }
    const updateTSCID = (event) => {
        props.setAttributes({TSCID: event.target.value});
    }
    const updateTokenAmount = (event) => {
        props.setAttributes({tokenAmount: event.target.value});
    }
    const updateDSCID = (event) => {
        props.setAttributes({DSCID: event.target.value});
    }
    const updateAmount = (event) => {
        props.setAttributes({USDamount: event.target.value});
    }
    const updateAPIKey = (event) => {
        props.setAttributes({APIKey: event.target.value});
    }
    const updateCourseID = (event) => {
        props.setAttributes({courseID: event.target.value});
    }
    const updateDestinationWalletAddress = (event) => {
        props.setAttributes({destinationWalletAddress: event.target.value});
    }

    const updateCEPURL = (event) => {
        props.setAttributes({CEPURL: event.target.value});
    }
    const updateCEPHeader = (event) => {
        props.setAttributes({CEPHeader: event.target.value});
    }
    const updateCEPBody = (event) => {
        props.setAttributes({CEPBody: event.target.value});
    }
    
    //Action Options
    const setActionOptionsVisibility = (event) => {
        if(event.target.value == "shopify"){
            setShopifyOptionsVisibility(true);
            setLearnDashOptionsVisibility(false);
            setEndPointOptionsVisibility(false);
        }
        if(event.target.value == "learnDash"){
            setShopifyOptionsVisibility(false);
            setLearnDashOptionsVisibility(true);
            setEndPointOptionsVisibility(false);
        }
        if(event.target.value == "customEP"){
            setShopifyOptionsVisibility(false);
            setLearnDashOptionsVisibility(false);
            setEndPointOptionsVisibility(true);
        }
    }

        //EndPoint Options
        const endpointOptionsFetchMethodOptionsVisibility = (event) => {
            if(event.target.value == "get"){
                setEndPointOptionsBodyOptionsVisibility(false);
                updateCEPMethod('GET');
            }
            if(event.target.value == "post"){
                setEndPointOptionsBodyOptionsVisibility(true);
                updateCEPMethod("POST");
            }
            if(event.target.value == "put"){
                setEndPointOptionsBodyOptionsVisibility(true);
                updateCEPMethod('PUT');
            }
            if(event.target.value == "delete"){
                setEndPointOptionsBodyOptionsVisibility(false);
                updateCEPMethod('DELETE');
            }
        }

    //Payment Options
    const setPaymentOptionsVisibility = (event) => {
        transferMethod(event);
        if(event.target.value == "ctsc"){
            setTokenOptionsVisibility(true);
            setDeroOptionsVisibility(false);
            setTransferOptionsVisibility(false);
        }
        if(event.target.value == "cdsc"){
            setTokenOptionsVisibility(false);
            setDeroOptionsVisibility(true);
            setTransferOptionsVisibility(false);
        }
        if(event.target.value == "dt"){
            setTokenOptionsVisibility(false);
            setDeroOptionsVisibility(false);
            setTransferOptionsVisibility(true);
        }
    }

    return (
        <div className="configurationBlock">
            <h3> DERO Payment Gateway Configuration 🔧</h3>

            {/* ✅ Action Options ✅ */}
            <p>Preset:</p>
            <select id="preset" onChange={setActionOptionsVisibility}>
                <option value="" disabled selected>Select Preset</option>
                <option value="shopify" >Shopify</option>
                <option value="learnDash">LearnDash</option>
                <option value="customEP">Custom Endpoint</option>
            </select>
            {/* Shopify */}
            <div id="shopify" style={{ display: shopifyOptionsVisibility ? "inline-flex" : "none" }}>
                <p> {/* Add Shopify Options */}
                    Store URL 🔗: 
                    <input type='number' id='courseID' value={props.attributes.courseID} placeholder='www.yoursite.com/SHOPIFY-REST/' onChange={updateCourseID}/><br/><br/>
                </p>
            </div>
            {/* LearnDash */}
            <div id="learnDash" style={{ display: learnDashOptionsVisibility ? "inline-flex" : "none" }}>
                <p>
                    Course ID 🔢: 
                    <input type='number' id='courseID' value={props.attributes.courseID} placeholder='1234' onChange={updateCourseID}/><br/><br/>
                    </p>
            </div>
            {/* Custom EndPoint */}
            <div id="customEndPoint" style={{ display: endPointOptionsVisibility ? "inline-flex" : "none" }}>
                <p>Endpoint Preset:</p>
                <select id="preset" onChange={endpointOptionsFetchMethodOptionsVisibility}>
                    <option value="" disabled selected>Select Fetch Method</option>
                    <option value="delete">GET</option>
                    <option value="post">POST</option>
                    <option value="put">PUT</option>
                    <option value="delete">DELETE</option>
                </select>
                {/* ❕You can use current user ID variable by passing ${userID} in URL */}
                <p>URL 🔗: <input type='text' id='CEPURL' value={props.attributes.CEPURL} placeholder='www.yoursite.com/wp-json/' onChange={updateCEPURL}/><br/><br/></p>
                <p>Header 🗝️: <input type='text' id='CEPHeader' value={props.attributes.CEPHeader} placeholder='non-stringified header' onChange={updateCEPHeader}/><br/><br/></p>
                <div id="endpointBody" style={{ display: endPointOptionsBodyOptionsVisibility ? "inline-flex" : "none" }}>
                    <p>Body 📄: <input type='text' id='CEPBody' value={props.attributes.CEPBody} placeholder='non-stringified body' onChange={updateCEPBody}/><br/><br/></p>
                </div>
            </div>



            {/* 🪙 Payment Options 🪙 */}
            <p>Payment option: </p>
            <select id="preset" onChange={setPaymentOptionsVisibility}>
                <option value="" disabled selected>Select Payment Option</option>
                <option value="ctsc">Custom Token SC</option>
                <option value="cdsc">Custom DERO SC</option>
                <option value="dt">Direct Transfer</option>
            </select>
            {/* Token Smart Contract */}
            <div id="tokenSC" style={{ display: tokenOptionsVisibility ? "inline-flex" : "none" }}>
                <p>
                    Token Payment Smart Contract 📃: 
                    <input data-tip="Smart Contract ID to be invoked for custom payment contract with your own Token." type='text' id='TSCID' value={props.attributes.TSCID} placeholder='Token SCID' onChange={updateTSCID}/><br/><br/>
                    <ReactTooltip />
                </p>
                <p>
                    Custom Token Price 🪙: 
                    <input data-tip="The amount to be transferred when Token SCID is invoked." type='number' id='tokenAmount' value={props.attributes.tokenAmount} placeholder='100 MTK' onChange={updateTokenAmount}/><br/><br/>
                    <ReactTooltip />
                </p>
            </div>
            {/* Dero Smart Contract */}
            <div id="deroSC" style={{ display: deroOptionsVisibility ? "inline-flex" : "none" }}>
                <p>
                    DERO Payment Smart Contract 📃: 
                    <input data-tip="Smart Contract ID to be invoked for custom payment contract with DERO." type='text' id='DSCID' value={props.attributes.DSCID} placeholder='DERO SCID' onChange={updateDSCID}/><br/><br/>
                    <ReactTooltip />
                </p>
                <p>
                    USD Price 💲: 
                    <input data-tip="The amount to be transferred (in USD), Plugin automatically interprets the amount in DERO with fixed precision to 5 atomic units." type='number' id='amount' value={props.attributes.USDamount} placeholder='$100' onChange={updateAmount}/><br/><br/>
                    <ReactTooltip />
                </p>
            </div>
            {/* Direct transfer */}
            <div id="directTransfer" style={{ display: transferOptionsVisibility ? "inline-flex" : "none"}}>
                <p>
                    Destination Wallet Address 📇: 
                    <input data-tip="Destination Wallet Address for the transfer. You'll recieve the DERO in this Wallet." type='text' id='destinationWalletAddress' value={props.attributes.destinationWalletAddress} placeholder='deroqyXXXX' onChange={updateDestinationWalletAddress}/><br/><br/>
                    <ReactTooltip />
                </p>
                <p>
                    USD Price 💲: 
                    <input data-tip="The amount to be transferred (in USD), Plugin automatically interprets the amount in DERO with fixed precision to 5 atomic units." type='number' id='amount' value={props.attributes.USDamount} placeholder='$100' onChange={updateAmount}/><br/><br/>
                    <ReactTooltip />
                </p>
            </div>



            <p>
                Livecoinwatch.com API Key 🗝️: 
                <input data-tip="This field is optional. So, if left empty will fall back to the default key." type='text' id='APIKey' value={props.attributes.APIKey} placeholder='XXXX-XXXX' onChange={updateAPIKey}/><br/><br/>
                <ReactTooltip />
            </p>
        </div>
    )
}

registerBlockType("dero/payment-gateway", {
    title: 'DERO Payment Gateway',
    icon: 'money-alt',
    category: "common",
    attributes: {
        APIKey: {type: 'string'},

        /* Shopify */
        /* LearnDash */
        courseID: {type: 'integer'},
        courseSiteURL: {type: 'string'},
        /* CustomEndPoint */
        CEPURL: {type: 'string'},
        CEPHeader: {type: 'string'},
        CEPBody: {type: 'string'},

        /* Payment Option */
        transferMethod: {type: 'string'},
        TSCID: {type: 'string'},
        tokenAmount: {type: 'integer'},
        DSCID: {type: 'string'},
        USDamount: {type: 'integer'},
        destinationWalletAddress: {type: 'string'},
    },
    edit: EditComponent,
    save: function() {
        return null
    }
});