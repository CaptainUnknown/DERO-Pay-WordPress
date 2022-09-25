import axios from 'axios';

export const validateTX = async(txid, txProof, DEROPrice, destinationWalletAddress) => {
  let data = JSON.stringify({
    "txid": txid,
    "txProof": txProof,
    "DEROPrice": DEROPrice,
    "destinationWalletAddress": destinationWalletAddress
  });

  let config = {
    method: 'post',
    url: 'https://deropay.herokuapp.com/validate',
    headers: {
      'Content-Type': 'application/json'
    },
    data: data
  };

  axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    if (response.error == 0) {
      console.log("Payment is valid");
      return true
    } else {
      console.log("Payment is invalid");
      return false
    }
  })
  .catch(function (error) {
    console.log(error);
    console.log("Failed to connect to validation server");
    return false
  });
}