<?php

/*
  Plugin Name: DERO RPC Bridge
  Description: Interface to connect with DERO RPC Chrome Extension
  Version: 1.0
  Author: CaptainUnknown
  Author URI: https://web3naut.com
*/

if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

class DERORPC {
    function __construct() {
        add_action('enqueue_block_editor_assets', array($this, 'adminAssets'));
    }

    function adminAssets() {
        wp_enqueue_script('dero-payment-gateway', plugin_dir_url(__FILE__). 'build/index.js', array('wp-blocks', 'wp-element'));
    }
}

$derorpc = new DERORPC();