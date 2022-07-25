![Powered by DERO](https://i.imgur.com/p6DRKv1.jpg)

# DERO-RPC-Bridge 🔌
WordPress Plugin for an Interface to connect with [DERO RPC Chrome Extension](https://chrome.google.com/webstore/detail/dero-rpc-bridge/nmofcfcaegdplgbjnadipebgfbodplpd).

Plugin connects & Communicates with DERO Wallet through the [DERO RPC Extension API](https://github.com/g45t345rt/dero-rpc-bridge). After Connecting to the wallet webapp can invoke any Smart Contract or perform a transaction with provided parameters.

After placing one of the folders in your WordPress **plugins** folder (that can be found under **wp-content**), you can then:

1. Point your terminal towards the **DERO-RPC-Bridge** folder (with admin rights).
2. Run `npm install` or `npm i`.
3. Then run `npm run start` to build the files.
4. In WordPress Editor, Drag & Drop plugin Block. Change the fields to desired parameters.
5. Click `Update` & `Preview`.

## Parameters 🔧
**Token SCID**:

`string` - Smart Contract ID to be invoked for custom payment contract with your own Token, (To check if the SCID is valid, visit: [DERO Explorer](https://explorer.dero.io/)).


**Token Price**:

`integer` - The amount to be transferred when Token SCID is invoked.


**DERO SCID**:

`string` - Smart Contract ID to be invoked for custom payment contract with DERO, (To check if the SCID is valid, visit: [DERO Explorer](https://explorer.dero.io/)).


**Is Direct Transfer**:

`boolean` - Directly Transfers to the provided Wallet Address, If checked destination wallet address must be provided. However, DERO SCID & Token SCID can be left empty.


**USD Price**:

`integer` - The amount to be transferred (in USD), Plugin automatically interprets the amount in DERO with fixed precision to 5 atomic units.


**Course ID**:

`integer` - ID of the current course. Course ID can be checked by following LearnDashs' this [FAQ Guide](https://www.learndash.com/support/docs/faqs/find-course-id/#without-a-plugin).


**LiveCoinWatch API Key**:

`string` - To get your own API key go to [LiveCoinWatch API tools](https://www.livecoinwatch.com/tools/api). This field is optional. So, if left empty will fall back to the default key.


**Destination Wallet Address**:

`string` - Destination Wallet Address for the transfer. Required if Is Direct Transfer is checked otherwise can be left empty.

## Screenshots 🖼️
**Configuration Block:**
<img src="https://i.imgur.com/2bY5coz.png" alt="Configuration Block" width="650"/>

**Payment Block:**
<img src="https://i.imgur.com/sQNvwwe.png" alt="Payment Block" width="650"/>

**LoggedOut Block:**
<img src="https://i.imgur.com/uGAaJlQ.png" alt="LoggedOut Block" width="650"/>