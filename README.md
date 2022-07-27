![Powered by DERO](https://i.imgur.com/p6DRKv1.jpg)

# DERO-RPC-Bridge 🔌
WordPress Plugin for an Interface to connect with [DERO RPC Chrome Extension](https://chrome.google.com/webstore/detail/dero-rpc-bridge/nmofcfcaegdplgbjnadipebgfbodplpd).

Plugin connects & Communicates with DERO Wallet through the [DERO RPC Extension API](https://github.com/g45t345rt/dero-rpc-bridge). After Connecting to the wallet webapp can invoke any Smart Contract or perform a transaction with provided parameters.

🎁 If you want to support the continuous effort to further develop this plugin, please consider donating DERO at:
`Captain_Unknown` or `dero1qyq7zg0aa06vsh9z46w0ypms70haz55ff2vv60aph65j9dfn5mjv6qqfsf2k7`.

After placing one of the folders in your WordPress **plugins** folder (that can be found under **wp-content**), you can then:

1. Point your terminal towards the **DERO-RPC-Bridge** folder (with admin rights).
2. Run `npm install` or `npm i`.
3. Then run `npm run start` to build the files.
4. In WordPress Editor, Drag & Drop plugin Block. Change the fields to desired parameters.
5. Click `Update` & `Preview`.


## Parameters 🔧
(⚠️ `Token SCID`, `Token Price` & `DERO SCID` have now been temporarily disabled. Because they are currently WIP.)

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



## Customization 🎛️
**On Complete Purchase**:

`completePurchase.js` - It exports a custom function that is called when the transaction has been made. `completePurchase` is a very basic function that sends the server a POST Request with ``$user_id`` & ``courseID`` as a parameters. You can add any functionality or change the REST Endpoint in `completePurchase.js` to better suit your needs.

`index.php` - To add any custom script/styles to the plugin, just enqueue the scripts/styles in `index.php`. `onInit` Scripts are loaded in the editor while `onRender` is called on preview & final page.
[Syntax Guide to enqueue scripts](https://developer.wordpress.org/reference/functions/wp_enqueue_script/).
[Syntax Guide to enqueue styles](https://developer.wordpress.org/reference/functions/wp_enqueue_style/).



## Screenshots 🖼️
**Configuration Block:**
![Configuration Block](https://i.imgur.com/2bY5coz.png)

**Payment Block:**
![Payment Block](https://i.imgur.com/sQNvwwe.png)

**LoggedOut Block:**
![LoggedOut Block](https://i.imgur.com/uGAaJlQ.png)