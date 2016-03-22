<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress4');

/** MySQL database username */
define('DB_USER', 'stef');

/** MySQL database password */
define('DB_PASSWORD', 'micmac11mew');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'UU2Cc@R3aXC7-w-d&&j~|#d$s|B?AlYOhmdgft9FfTX1a$zvHa@6vq(H3k&.,P{0');
define('SECURE_AUTH_KEY',  'v8ZNIB`]`Il%XwoGAx=BE{P3r~C|KU9Rt4$hY.kPAJ!y&-i~=C1aGz+se0atL?p&');
define('LOGGED_IN_KEY',    '924`J.y>aX3BXCAR^yB|l|G+.a5EJ(7bH}+X~KE~[MpGpZp|Gqu,D|A~pf2thJyq');
define('NONCE_KEY',        'i^gByuUy;MAcH(B/#c~`|Fm4T,$MX~D[;3+zXG51Nf2W%[Ye scD1G,LZ2&CY52m');
define('AUTH_SALT',        'tT_&U9B#Z3jqfh+TgVfx85^Q&n:+QpM[(nC!q{?ep-!i -~>jdvbK5#B.3jx:f+h');
define('SECURE_AUTH_SALT', '~GE09QMukpZ+h4SWwU+=EOsoTy!-;l&_1M6[v8)f+5f{t&IdcOy-Yo5;CNt$B>ZK');
define('LOGGED_IN_SALT',   'OiqF?j1:X>*z-QP|Z2jCLGn]wGaD/@^|C,q)*2YNb*sp,HnTa3@>F3EPg~kTd900');
define('NONCE_SALT',       'g>(2bbD,2v+;U]+QRy@4V)|[-PR9hzw[KRCUq9e:|rx)0J1XAPZX1<vB&Q/^aKL ');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');

