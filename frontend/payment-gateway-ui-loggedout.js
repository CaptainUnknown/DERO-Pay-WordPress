import "./payment-gateway-ui-loggedout.scss"
import React, { useState } from "react"
import ReactDOM from "react-dom"

var attributes;
document.addEventListener("DOMContentLoaded", (event) => {
    const allAttributes = document.querySelectorAll(".attributes");
    allAttributes.forEach(attributeElement => {
        attributes = JSON.parse(attributeElement.innerText);
        const currentBlockName = attributes.name;
        const currentBlock = document.querySelectorAll('.replace-' + currentBlockName)[0];
        ReactDOM.render(<Gateway {...attributes}/>, currentBlock);
        currentBlock.classList.remove("replace-" + currentBlockName);
    });
});

const Gateway = (props) => {

    return (
        <div className="loggedout">
            <h3> Logged Out ❌ </h3>
            <p> You're currently logged out, Please log in to use DERO Payment Option. </p>
        </div>
    )
}