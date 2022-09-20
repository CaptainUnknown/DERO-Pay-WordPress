const handleError = (error) => {
  console.error(error);
  return new Response(JSON.stringify({
    code: error.status,
    message: error.message
  }));
}

export const validateTX = async(txid, txProof, DEROPrice, destinationWalletAddress) => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({
    "txid": txid,
    "txProof": txProof,
    "DEROPrice": DEROPrice,
    "destinationWalletAddress": destinationWalletAddress
  });

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const rawRes = await fetch("http://139.162.176.124:8000/validate", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => {
    console.log('error', error);
    handleError(error);
  });

  if (rawRes.ok) {
    return rawRes.json();
  } else {
    return Promise.reject(rawRes);
  }
}