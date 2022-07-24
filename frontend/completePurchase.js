const handleError = (error) => {
    console.warn(error);
    return new Response(JSON.stringify({
        code: error.data.status,
        message: error.data.message
    }));
}

export const completePurchase = async(courseID, userID) => {
    let data = {"user_ids": [ userID ]};
    let packet = JSON.stringify(data);
    console.log(purchaseData.nonce);
    const response = await (fetch(
        `http://templisaquaria.com/wp-json/ldlms/v1/sfwd-courses/${courseID}/users`,
        {
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