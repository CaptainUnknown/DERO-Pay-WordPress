wp.blocks.registerBlockType('derorpc/gateway', {
    title: 'DERO Payment Gateway',
    icon: 'money-alt',
    category: 'common',
    attribute: {
        SCID: {type: 'string'},
        amount: {type: 'integer'},
    },
    edit: (props) => {
        const updateSCID = (event) => {
            props.setAttributes({SCID: event.target.value});
        }
        const updateAmount = (event) => {
            props.setAttributes({amount: event.target.value});
        }
        return (
            <div>
                <h3>DERO Payment Gateway Configuration</h3>
                <input type='text' id='SCID' placeholder='Smart Contract Address' onChange={updateSCID}/>
                <input type='text' id='amount' placeholder='Amount in DERO' onChange={updateAmount}/>
                {/* /* Add a conversion function from Dollar value to current DERO Value */}
            </div>
        )
    },
    save: (props) => {
        return (
            <div>
                <p>{props.attributes.amount} DERO transfered to {props.attributes.SCID} SCID</p>
            </div>
        )
    }
})