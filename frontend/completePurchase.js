import axios from 'axios';

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
        //make a shopidy backend
        let data = {
            "price": options.shopify.price,
            "quantity": options.shopify.quantity,
            "product_id": options.shopify.productID,
        };
        let config = {
            method: 'post',
            url: `https://${options.shopify.adminServerURI}`,
            headers: {
              'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
          };
        
          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            return { "success": true, "message": `Product purchased, claim your item at our store with ${response.data.discount} as discount coupon.` };
          })
          .catch(function (error) {
            return { "success": false, "message": `Failed to connect to shopify backend, ${error.message}.` };
          });
    }
    else {
        alert('❌ No action specified');
    }
}