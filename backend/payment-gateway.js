import "./payment-gateway.scss"
import { registerBlockType } from "@wordpress/blocks"
import { useState } from 'react'
import ReactTooltip from 'react-tooltip'

const EditComponent = (props) => {
    const [tokenOptionsVisibility, setTokenOptionsVisibility] = useState(false);
    const [deroOptionsVisibility, setDeroOptionsVisibility] = useState(false);
    const [transferOptionsVisibility, setTransferOptionsVisibility] = useState(false);


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
    const updateIsDirectTransfer = (event) => {
        props.setAttributes({isDirectTransfer: event.target.value});
    }
    const updateCourseID = (event) => {
        props.setAttributes({courseID: event.target.value});
    }
    const updateDestinationWalletAddress = (event) => {
        props.setAttributes({destinationWalletAddress: event.target.value});
    }

    //Actions
    const learnDash = () => {
        return (
            <>
                <p>Course ID 🔢: <input type='number' id='courseID' value={props.attributes.courseID} placeholder='1234' onChange={updateCourseID}/><br/><br/></p>
            </>
        )
    }
    const shopify = () => {
        return (
            <>
                <p>Course ID 🔢: <input type='number' id='courseID' value={props.attributes.courseID} placeholder='1234' onChange={updateCourseID}/><br/><br/></p>
                {/* More Options Here */}
            </>
        )
    }
    const endpoint = () => {
        const get = () => {
            updateCEPMethod('GET');
        }
        const post = () => {
            updateCEPMethod("POST");
            return(
                <p>Body 📄: <input type='text' id='CEPBody' value={props.attributes.CEPBody} placeholder='non-stringified body' onChange={updateCEPBody}/><br/><br/></p>
            )
        }
        const put = () => {
            updateCEPMethod('PUT');
        }
        const deleteMethod = () => {
            updateCEPMethod('DELETE');
        }
        return (
            <>
                <p>Preset:</p>
                <select id="preset">
                    <option value="" disabled selected>Select Fetch Method</option>
                    <option value="delete" onChange={get}>GET</option>
                    <option value="post" onChange={post}>POST</option>
                    <option value="put" onChange={put}>PUT</option>
                    <option value="delete" onChange={deleteMethod}>DELETE</option>
                </select>
                <p>❕You can use current user ID variable by passing ${userID} in URL</p>
                <p>URL 🔗: <input type='text' id='CEPURL' value={props.attributes.CEPURL} placeholder='www.yoursite.com/wp-json/' onChange={updateCEPURL}/><br/><br/></p>
                <p>Header 🗝️: <input type='text' id='CEPHeader' value={props.attributes.CEPHeader} placeholder='non-stringified header' onChange={updateCEPHeader}/><br/><br/></p>
            </>
        )
    }

    //Payment Options
    const setPaymentOptionsVisibility = (events) => {
        console.log('Visibility is: ' + tokenOptionsVisibility);
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

            <p>Preset:</p>
            
            <select id="preset">
                <option value="" disabled selected>Select Preset</option>
                <option value="shopify" >Shopify</option>
                <option value="learnDash">LearnDash</option>
                <option value="customEP">Custom Endpoint</option>
            </select>
            {/*data-tip="tip here"
            <ReactTooltip />*/}




            <p>Payment option: </p>
            <select id="preset" onChange={setPaymentOptionsVisibility}>
                <option value="" disabled selected>Select Payment Option</option>
                <option value="ctsc">Custom Token SC</option>
                <option value="cdsc">Custom DERO SC</option>
                <option value="dt">Direct Transfer</option>
            </select>


            <div id="tokenSC" style={{ display: tokenOptionsVisibility ? "inline-flex" : "none" }}>
                <p>Token Payment Smart Contract 📃: <input type='text' id='TSCID' value={props.attributes.TSCID} placeholder='Token SCID' onChange={updateTSCID}/><br/><br/></p>
                <p>Custom Token Price 🪙: <input type='number' id='tokenAmount' value={props.attributes.tokenAmount} placeholder='100 MTK' onChange={updateTokenAmount}/><br/><br/></p>
                {/* More Options Here */}
            </div>

            <div id="deroSC" style={{ display: deroOptionsVisibility ? "inline-flex" : "none" }}>
                <p>DERO Payment Smart Contract 📃: <input type='text' id='DSCID' value={props.attributes.DSCID} placeholder='DERO SCID' onChange={updateDSCID}/><br/><br/></p>
                <p>USD Price 💲: <input type='number' id='amount' value={props.attributes.USDamount} placeholder='$100' onChange={updateAmount}/><br/><br/></p>
                {/* More Options Here */}
            </div>
            <div id="directTransfer" style={{ display: transferOptionsVisibility ? "inline-flex" : "none"}}>
                <p>Destination Wallet Address 📇: <input type='text' id='destinationWalletAddress' value={props.attributes.destinationWalletAddress} placeholder='deroqyXXXX' onChange={updateDestinationWalletAddress}/><br/><br/></p>
                <p>USD Price 💲: <input type='number' id='amount' value={props.attributes.USDamount} placeholder='$100' onChange={updateAmount}/><br/><br/></p>
                {/* More Options Here */}
            </div>


            <p>Livecoinwatch.com API Key (Optional) 🗝️: <input type='text' id='APIKey' value={props.attributes.APIKey} placeholder='XXXX-XXXX' onChange={updateAPIKey}/><br/><br/></p>
        </div>
    )
}

registerBlockType("dero/payment-gateway", {
    title: 'DERO Payment Gateway',
    icon: 'money-alt',
    category: "common",
    attributes: {
        TSCID: {type: 'string'},
        tokenAmount: {type: 'integer'},
        DSCID: {type: 'string'},
        USDamount: {type: 'integer'},
        APIKey: {type: 'string'},
        isDirectTransfer: {type: 'boolean'},
        destinationWalletAddress: {type: 'string'},

        /* Shopify */
        /* LearnDash */
        courseID: {type: 'integer'},
        courseSiteURL: {type: 'string'},
        /* CustomEndPoint */

        /* DERO Smart Contract */
        /* Token Smart Contract */
        /* Direct Transfer */
    },
    edit: EditComponent,
    save: function() {
        return null
    }
});