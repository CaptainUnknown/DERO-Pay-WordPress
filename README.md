![Powered by DERO](https://i.imgur.com/p6DRKv1.jpg)

# DERO Payment Gateway | WordPress 🔌![DERO Payment Gateway](https://img.shields.io/badge/2.0.0-brightgreen)
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

**Store Admin ServerURI**:

`string` - Store Admin ServerURI (Should not contain protocol). Host a server that manages & generates single use Discount Coupons for selected product & user.

**Product ID**:

`integer` - Shopify Product ID.



**Course ID**:

`integer` - ID of the current course. Course ID can be checked by following LearnDashs' this [FAQ Guide](https://www.learndash.com/support/docs/faqs/find-course-id/#without-a-plugin).

**Course Domain**:

`string` - Domain where courses are hosted at. Required for API call to LearnDash.



**URL (Custom Endpoint)**:

`string` - URL of the EndPoint.

**Header (Custom Endpoint)**:

`string` - Add a non-stringified header (if required)(Should be an object).

**Body (Custom Endpoint)**:

`string` - Add a non-stringified body (Should be an object).



**DERO SCID**:

`string` - Smart Contract ID to be invoked for custom payment contract with DERO, (To check if the SCID is valid, visit: [DERO Explorer](https://explorer.dero.io/)).

**Token SCID**:

`string` - Smart Contract ID to be invoked for custom payment contract with your own Token, (To check if the SCID is valid, visit: [DERO Explorer](https://explorer.dero.io/)).

**Token Price**:

`integer` - The amount of tokens to be transferred when Token SCID is invoked.

**Smart Contract RPC**:

`string` - Smart Contract Required RPC arguments (should be an array of object(s)).

**Ring Size**:

`integer` - (Optional) Ring size refers to the total number of signers in a ring signature. (Level of anonymity).

**USD Price**:

`integer` - The amount to be transferred (in USD), Plugin automatically interprets the amount in DERO with fixed precision to 5 atomic units.



**LiveCoinWatch API Key**:

`string` - To get your own API key go to [LiveCoinWatch API tools](https://www.livecoinwatch.com/tools/api). This field is optional. So, if left empty will fall back to the default key.


**Destination Wallet Address**:

`string` - Destination Wallet Address for the transfer. Required if Is Direct Transfer is checked otherwise can be left empty.



## Customization 🎛️

Edit `index.php` - To add any custom script/styles to the plugin, just enqueue the scripts/styles in `index.php`. `onInit` Scripts are loaded in the editor while `onRender` is called on preview & final page.
[Syntax Guide to enqueue scripts](https://developer.wordpress.org/reference/functions/wp_enqueue_script/).
[Syntax Guide to enqueue styles](https://developer.wordpress.org/reference/functions/wp_enqueue_style/).


## Screenshots 🖼️
**Basic Configuration Block:**
![Basic Configuration Block](https://i.imgur.com/6ACqydj.png)

**Expanded Configuration Block:**
![Expanded Configuration Block](https://i.imgur.com/V2Ua5R4.png)

**Payment Block:**
![Payment Block](https://i.imgur.com/g3kkcqm.png)

**LoggedOut Block:**
![LoggedOut Block](https://i.imgur.com/uGAaJlQ.png)
