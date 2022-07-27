<?php

/*
  Plugin Name: DERO Payment Gateway
  Description: Interface to connect with DERO RPC Chrome Extension
  Version: 0.9.9
  Author: CaptainUnknown
  Author URI: https://web3naut.com
  License: MIT
  License URI: https://opensource.org/licenses/MIT
  Update URI: https://github.com/CaptainUnknown/DERO-RPC-Bridge-WordPress/releases/latest
*/

if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly (For example by malicious bots that want to exploit this plugin)

class Block {
    function __construct($name) {
        $this->name = $name;
        add_action('init', array($this,'onInit'));
    }

    function onInit() {
        wp_register_script($this->name . '_script', plugin_dir_url(__FILE__) . "build/{$this->name}.js", array('wp-blocks', 'wp-editor'));
        wp_register_style($this->name . '_style', plugin_dir_url(__FILE__) . "build/{$this->name}.css");

        $arguments = array(
            'render_callback' => array($this, 'onRender'),
            'editor_style' => "{$this->name}_style",
            'editor_script' => "{$this->name}_script",
        );

        register_block_type("dero/{$this->name}", $arguments);
    }

    function onRender($attributes) {
        $attributes['name'] = $this->name;

        if (!is_admin() && is_user_logged_in()) {
            $attributes['user_id'] = get_current_user_id();
            wp_enqueue_script($this->name . '_ui_script', plugin_dir_url(__FILE__) . "build/{$this->name}-ui.js", array('wp-element')); //Make sure to use double quotes after plugin_dir_url, single quotes won't use {$this->name}
            wp_enqueue_style($this->name . '_ui_style', plugin_dir_url(__FILE__) . "build/{$this->name}-ui.css");
            
            wp_enqueue_script($this->name . '_api_script', plugin_dir_url(__FILE__) . "build/bridgeAPI.js", array('wp-element')); //DERO Bridge API

            wp_enqueue_script('completePurchase', 'build/completePurchase.js');
            wp_localize_script('completePurchase', 'purchaseData', [
                'root' => esc_url_raw(rest_url()),
                'nonce' => wp_create_nonce('wp_rest')
            ]);
        }
        elseif (!is_admin() && !is_user_logged_in()) {
            wp_enqueue_script($this->name. '_ui_loggedout_script', plugin_dir_url(__FILE__) . "build/{$this->name}-ui-loggedout.js", array('wp-element')); //Asks User to Login to use DERO Payment Option
            wp_enqueue_style($this->name . '_ui_loggedout_style', plugin_dir_url(__FILE__) . "build/{$this->name}-ui-loggedout.css");
        }

        ob_start();
        ?>

        <pre class="attributes" style="display:none;">
            <?php echo wp_json_encode($attributes) ?>
        </pre>

        <div class="replace-<?php echo $this->name;?>">
        </div>

        <?php return ob_get_clean();
    }
}


$payment_gateway = new Block('payment-gateway');