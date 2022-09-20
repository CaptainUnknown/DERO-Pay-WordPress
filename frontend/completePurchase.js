const handleError = (error) => {
    console.error(error);
    return new Response(JSON.stringify({
        code: error.data.status,
        message: error.data.message
    }));
}

export const completePurchase = async(options) => {
    if (options.action == 'learnDash') {
        let data = { "user_ids": [userID], "request_url": `http://${options.learnDash.courseSiteURL}/wp-json/ldlms/v1/sfwd-courses/${options.learnDash.courseID}/users`};
        let packet = JSON.stringify(data);
        console.log(purchaseData.nonce);
        const response = await (fetch(options.learnDash.courseSiteURL + 'wp-json/deropay/v1/learndash', {
            body: packet,
            headers: {
                'Content-Type': "application/json",
                'X-WP-Nonce': purchaseData.nonce
            },
            method: "POST"
        })
        .catch((error) => {
            handleError(error);
        }));

        if (response.ok) {
            return response.json();
        } else {
            return Promise.reject(response);
        }
    }
    else if (options.action == 'customEP'){
        const myHeaders =  options.customEP.headers;
        const myURL = options.customEP.url;
        if(options.customEP.method == 'GET'){
            const response = await (fetch(myURL, {
                headers: myHeaders,
                method: "GET"
            })
            .catch((error) => {
                handleError(error);
            }));

            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }
        else if(options.customEP.method == 'POST'){
            const response = await (fetch(myURL, {
                body: JSON.stringify(options.customEP.body),
                headers: myHeaders,
                method: "POST"
            })
            .catch((error) => {
                handleError(error);
            }));
            
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }
        else if(options.customEP.method == 'PUT'){
            const response = await (fetch(myURL, {
                body: JSON.stringify(options.customEP.body),
                headers: myHeaders,
                method: "PUT"
            })
            .catch((error) => {
                handleError(error);
            }));
            
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }
        else if(options.customEP.method == 'DELETE'){
            const response = await (fetch(myURL, {
                headers: myHeaders,
                method: "DELETE"
            })
            .catch((error) => {
                handleError(error);
            }));
            
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(response);
            }
        }
    }
    else if (options.action == 'shopify'){
        let checkoutToken;
        let createCheckoutData = { 
            "checkout": { 
                "line_items": [{ 
                    "variant_id": options.shopify.variantID, 
                    "quantity": options.shopify.quantity
                }]
            }
        };
        let createCheckoutPacket = JSON.stringify(createCheckoutData);
        let createCheckoutHeaders =  {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": `${options.shopify.accessToken}`
        };
        fetch(`https://${options.shopify.storeName}/admin/api/2022-07/checkouts.json`, {
            body: createCheckoutPacket,
            headers: createCheckoutHeaders,
            method: "POST"
        })
        .then(res => {
            res.json();
            checkoutToken = res.token;
            completeCheckout();
        })
        .catch(error => {
            handleError(error);
        });

        const completeCheckout = async (checkoutToken) => {
            let completeCheckoutData = {
                "checkout": {
                    "token": `${options.shopify.checkoutToken}`,
                    "order": null
                }
            };
            let completeCheckoutPacket = JSON.stringify(completeCheckoutData);
            let completeCheckoutHeaders =  {
                "Content-Type": "application/json",
                "Retry-After": "1",
                "X-Shopify-Access-Token": `${options.shopify.accessToken}`
            };
            const completeCheckoutResponse = await (fetch(`https://${options.shopify.storeName}/admin/api/2022-07/checkouts/${checkoutToken}/complete.json`, {
                body: completeCheckoutPacket,
                headers: completeCheckoutHeaders,
                method: "POST"
            })
            .catch((error) => {
                handleError(error);
            }));

            if (completeCheckoutResponse.ok) {
                return completeCheckoutResponse.json();
            } else {
                return Promise.reject(completeCheckoutResponse);
            }
        }
    }
    else {
        alert('❌ No action specified');
    }
}