const handleError = (error) => {
    console.warn(error);
    return new Response(JSON.stringify({
        code: error.data.status,
        message: error.data.message
    }));
}

export const completePurchase = async(options) => {
    if (action == 'learnDash') {
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
    else if (action == 'customEP'){
        const myHeaders =  options.customEP.headers;
        const myURL = `${JSON.parse(options.customEP.url)}`;
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
    else if (action == 'shopify'){

    }
    else {
        alert('❌ No action specified');
    }
}