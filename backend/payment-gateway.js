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
    
    
    // ==> PRESET:
    const updateActionPreset = (event) => {
        props.setAttributes({actionPreset: event.target.value});
    }

    //Shopify
    const updateShopifyStoreName = (event) => {
        props.setAttributes({shopifyStoreName: event.target.value});
    }
    const updateShopifyAccessToken = (event) => {
        props.setAttributes({shopifyAccessToken: event.target.value});
    }

    //LearnDash
    const updateCourseID = (event) => {
        props.setAttributes({courseID: event.target.value});
    }
    const updateCourseSite = (event) => {
        props.setAttributes({courseSite: event.target.value});
    }

    //Custom EndPoint
    const updateFetchMethod = (event) => {
        props.setAttributes({fetchMethod: event.target.value});
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

    // ===> PAYMENT PRESET:
    const transferMethod = (event) => {
        props.setAttributes({transferMethod: event.target.value});
    }

    //Token SC
    const updateTSCID = (event) => {
        props.setAttributes({TSCID: event.target.value});
    }
    const updateTokenAmount = (event) => {
        props.setAttributes({tokenAmount: event.target.value});
    }

    //Dero SC + Token SC
    const updateSCRPC = (event) => {
        props.setAttributes({SCRPC: event.target.value});
    }
    const updateRingSize = (event) => {
        props.setAttributes({ringSize: event.target.value});
    }

    //Dero SC
    const updateDSCID = (event) => {
        props.setAttributes({DSCID: event.target.value});
    }
    const updateAmount = (event) => {
        props.setAttributes({USDamount: event.target.value});
    }

    //Direct Transfer
    const updateDestinationWalletAddress = (event) => {
        props.setAttributes({destinationWalletAddress: event.target.value});
    }

    //API Key
    const updateAPIKey = (event) => {
        props.setAttributes({APIKey: event.target.value});
    }
    
    //Action Options
    const setActionOptionsVisibility = (event) => {
        updateActionPreset(event);
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
            updateFetchMethod(event);
            if(event.target.value == "GET"){
                setEndPointOptionsBodyOptionsVisibility(false);
            }
            if(event.target.value == "POST"){
                setEndPointOptionsBodyOptionsVisibility(true);
            }
            if(event.target.value == "PUT"){
                setEndPointOptionsBodyOptionsVisibility(true);
            }
            if(event.target.value == "DELETE"){
                setEndPointOptionsBodyOptionsVisibility(false);
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
                <p>
                    Store Name 🛍️: 
                    <input type='string' id='shopifyStoreName' value={props.attributes.shopifyStoreName} placeholder='myCoffeeShop' onChange={updateShopifyStoreName}/><br/><br/>
                </p>
                <p>
                    Shopify Access Token 🗝️: 
                    <input type='string' id='shopifyAccessToken' value={props.attributes.shopifyAccessToken} placeholder='Your Secret Access Token' onChange={updateShopifyAccessToken}/><br/><br/>
                </p>
            </div>
            {/* LearnDash */}
            <div id="learnDash" style={{ display: learnDashOptionsVisibility ? "inline-flex" : "none" }}>
                <p>
                    Course ID 🔢: 
                    <input data-tip="❕ ID of the current course. Course ID can be checked by following LearnDashs' this FAQ Guide. Read more at this Plugins' Github Repo." type='number' id='courseID' value={props.attributes.courseID} placeholder='1234' onChange={updateCourseID}/><br/><br/>
                    <ReactTooltip />
                </p>
                <p>
                    Course Site Domain 🌐: 
                    <input data-tip="❕ Add the domain of your site, where courses are hosted at." type='string' id='courseSite' value={props.attributes.courseSite} placeholder='www.example.com' onChange={updateCourseSite}/><br/><br/>
                    <ReactTooltip />
                </p>
            </div>
            {/* Custom EndPoint */}
            <div id="customEndPoint" style={{ display: endPointOptionsVisibility ? "inline-flex" : "none" }}>
                <p>Fetch Method:</p>
                <select id="preset" onChange={endpointOptionsFetchMethodOptionsVisibility}>
                    <option value="" disabled selected>Select Fetch Method</option>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                </select>
                {/* ❕You can use current user ID variable by passing ${userID} in URL */}
                <p>
                    URL 🔗: 
                    <input data-tip="❕ URL of the Rest EndPoint." type='text' id='CEPURL' value={props.attributes.CEPURL} placeholder='www.yoursite.com/wp-json/' onChange={updateCEPURL}/><br/><br/>
                    <ReactTooltip />
                </p>
                <p>
                    Header 🗝️: 
                    <input data-tip="❕ Add a non-stringified header (if required)." type='text' id='CEPHeader' value={props.attributes.CEPHeader} placeholder='non-stringified header' onChange={updateCEPHeader}/><br/><br/>
                    <ReactTooltip />
                </p>
                <div id="endpointBody" style={{ display: endPointOptionsBodyOptionsVisibility ? "inline-flex" : "none" }}>
                    <p>
                        Body 📄: 
                        <input data-tip="❕ Add a non-stringified body." type='text' id='CEPBody' value={props.attributes.CEPBody} placeholder='non-stringified body' onChange={updateCEPBody}/><br/><br/>
                        <ReactTooltip />
                    </p>
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
                    <input data-tip="❕ Smart Contract ID to be invoked for custom payment contract with your own Token." type='text' id='TSCID' value={props.attributes.TSCID} placeholder='Token SCID' onChange={updateTSCID}/><br/><br/>
                    <ReactTooltip />
                </p>
                <p>
                    Smart Contract RPC ⚙️: 
                    <input data-tip="❕ Smart Contract Required arguments (should be an array of object(s))." type='text' id='SCRPC' value={props.attributes.SCRPC} placeholder='SC RPC' onChange={updateSCRPC}/><br/><br/>
                    <ReactTooltip />
                </p>
                <p>
                    Ring Size 🔶: 
                    <input data-tip="❕ (Optional) Ring size refers to the total number of signers in a ring signature. (Level of anonymity)" type='number' id='RingSize' value={props.attributes.ringSize} placeholder='Ring size' onChange={updateRingSize}/><br/><br/>
                    <ReactTooltip />
                </p>
                <p>
                    Custom Token Price 🪙: 
                    <input data-tip="❕ The amount to be transferred when Token SCID is invoked." type='number' id='tokenAmount' value={props.attributes.tokenAmount} placeholder='100 MTK' onChange={updateTokenAmount}/><br/><br/>
                    <ReactTooltip />
                </p>
            </div>
            {/* Dero Smart Contract */}
            <div id="deroSC" style={{ display: deroOptionsVisibility ? "inline-flex" : "none" }}>
                <p>
                    Smart Contract ID 📃: 
                    <input data-tip="❕ Smart Contract ID to be invoked for custom payment contract with DERO." type='text' id='DSCID' value={props.attributes.DSCID} placeholder='DERO SCID' onChange={updateDSCID}/><br/><br/>
                    <ReactTooltip />
                </p>
                <p>
                    Smart Contract RPC ⚙️: 
                    <input data-tip="❕ Smart Contract Required arguments (should be an array of object(s))." type='text' id='SCRPC' value={props.attributes.SCRPC} placeholder='SC RPC' onChange={updateSCRPC}/><br/><br/>
                    <ReactTooltip />
                </p>
                <p>
                    Ring Size 🔶: 
                    <input data-tip="❕ (Optional) Ring size refers to the total number of signers in a ring signature. (Level of anonymity)" type='number' id='RingSize' value={props.attributes.ringSize} placeholder='Ring size' onChange={updateRingSize}/><br/><br/>
                    <ReactTooltip />
                </p>
                <p>
                    USD Price 💲: 
                    <input data-tip="❕ The amount to be transferred (in USD), Plugin automatically interprets the amount in DERO with fixed precision to 5 atomic units." type='number' id='amount' value={props.attributes.USDamount} placeholder='$100' onChange={updateAmount}/><br/><br/>
                    <ReactTooltip />
                </p>
            </div>
            {/* Direct transfer */}
            <div id="directTransfer" style={{ display: transferOptionsVisibility ? "inline-flex" : "none"}}>
                <p>
                    Destination Wallet Address 📇: 
                    <input data-tip="❕ Destination Wallet Address for the transfer. You'll recieve the DERO in this Wallet." type='text' id='destinationWalletAddress' value={props.attributes.destinationWalletAddress} placeholder='deroqyXXXX' onChange={updateDestinationWalletAddress}/><br/><br/>
                    <ReactTooltip />
                </p>
                <p>
                    USD Price 💲: 
                    <input data-tip="❕ The amount to be transferred (in USD), Plugin automatically interprets the amount in DERO with fixed precision to 5 atomic units." type='number' id='amount' value={props.attributes.USDamount} placeholder='$100' onChange={updateAmount}/><br/><br/>
                    <ReactTooltip />
                </p>
            </div>


            <p>
                Livecoinwatch.com API Key 🗝️: 
                <input data-tip="❕ This field is optional (But providing one is a good idea). But, if left empty will fall back to the default key." type='text' id='APIKey' value={props.attributes.APIKey} placeholder='XXXX-XXXX' onChange={updateAPIKey}/><br/><br/>
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
        actionPreset: {type: 'string'},

        /* Shopify */
        shopifyStoreName: {type: 'string'},
        shopifyAccessToken: {type: 'string'},

        /* LearnDash */
        courseID: {type: 'integer'},
        courseSiteURL: {type: 'string'},
        
        /* CustomEndPoint */
        fetchMethod: {type: 'string'},
        CEPURL: {type: 'string'},
        CEPHeader: {type: 'string'},
        CEPBody: {type: 'string'},

        transferMethod: {type: 'string'},

        /* Payment Option */
        TSCID: {type: 'string'},
        tokenAmount: {type: 'integer'},

        DSCID: {type: 'string'},
        USDamount: {type: 'integer'},

        SCRPC: {type: 'string'},
        RingSize: {type: 'integer'},

        destinationWalletAddress: {type: 'string'},

        
        APIKey: {type: 'string'},
    },
    edit: EditComponent,
    save: function() {
        return null
    }
});