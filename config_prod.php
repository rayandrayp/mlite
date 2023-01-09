<?php
if (!version_compare(PHP_VERSION, '5.5.0', '>=')) {
    exit("Khanza LITE requires at least <b>PHP 5.5</b>");
}

define('DBHOST', '172.16.10.105');
define('DBPORT', '3306');
define('DBUSER', 'itrst');
define('DBPASS', 'ITrst321');
define('DBNAME', 'sik');

// URL Webapps
define('WEBAPPS_URL', 'http://localhost/webapps');
define('WEBAPPS_PATH', BASE_DIR . '/webapps');

// Admin cat name
define('ADMIN', 'admin');

// Themes path
define('THEMES', BASE_DIR . '/themes');

// Modules path
define('MODULES', BASE_DIR . '/plugins');

// Uploads path
define('UPLOADS', BASE_DIR . '/uploads');

// Lock files
define('FILE_LOCK', false);

// Basic modules
define('BASIC_MODULES', serialize([
    9 => 'settings',
    0 => 'dashboard',
    1 => 'master',
    2 => 'pasien',
    3 => 'rawat_jalan',
    4 => 'kasir_rawat_jalan',
    5 => 'kepegawaian',
    6 => 'farmasi',
    8 => 'users',
    7 => 'modules'
]));

// Developer mode
define('DEV_MODE', true);

?>
