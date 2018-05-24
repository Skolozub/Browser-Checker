/**
 * @const
 */
var THIS_SCRIPT_ID = 'id-browser-checker';
var PATH = '/browser-checker/';
var PATH_TO_LIBRARY = PATH + 'bowser.min.js';
var PATH_TO_STYLE = PATH + 'styles/style.css';
var PATH_TO_IMAGES = PATH + 'images/';
var IN_SITE_WRAPPER = true;
var SITE_WRAPPER_ID = 'root';
var COOKIE_LIVE_HOURS = 24;

// supported VERSIONS ({chrome: '55'} => unsupported less then this version)
var CHROME = { chrome: '56' };
var FIREFOX = { firefox: '53' };
var SAFARI = { safari: '11' };
var IE = { msie: '11' };
var OPERA = { opera: '43' };
// var EDGE = { msedge: 'null' };

// nodes
var THIS_SCRIPT_NODE = document.getElementById(THIS_SCRIPT_ID);

/**
 * RENDER WARNING WINDOW IF BROWSER NOT SUPPORTED
 */

window.onload = function() {
    if (isWarningShouldBeShown()) {
        renderWarningWindow();
        addStylesToDom();
    }

    console.log('Browser Not Supported');
};

/**
 * add bowser.min.js library in body
 */
var bowserScript = document.createElement('script');
bowserScript.src = PATH_TO_LIBRARY;
document.body.insertBefore(bowserScript, THIS_SCRIPT_NODE);

/**
 * @func add style.css styles to header
 */
function addStylesToDom() {
    var warningBoxStyles = document.createElement('link');
    var head = document.getElementsByTagName('head')[0];
    warningBoxStyles.href = PATH_TO_STYLE;
    warningBoxStyles.rel = 'stylesheet';
    head.appendChild(warningBoxStyles);
    setTimeout(function() {
        window.warningWindow.style.opacity = 1;
    }, 200);
}

/**
 * @func set cookie
 */
function setCookie(cookieName, cookieBody) {
    var date = new Date();
    date.setHours(date.getHours() + COOKIE_LIVE_HOURS);

    document.cookie =
        cookieName +
        '=' +
        cookieBody +
        '; path=/; expires="' +
        date.toUTCString(); //`${cookieName}=${cookieBody}; path=/;`;
}

/**
 * @func get cookie
 */
function getCookie(cookieName) {
    var results = document.cookie.match(
        '(^|;) ?' + cookieName + '=([^;]*)(;|$)'
    );

    if (results) {
        return unescape(results[2]);
    } else {
        return null;
    }
}

/**
 * @func check browsers
 */
function isBrowserSupported() {
    var isSupported = true;

    if (bowser.isUnsupportedBrowser(CHROME, window.navigator.userAgent)) {
        isSupported = false;
    } else if (
        bowser.isUnsupportedBrowser(FIREFOX, window.navigator.userAgent)
    ) {
        isSupported = false;
    } else if (bowser.isUnsupportedBrowser(OPERA, window.navigator.userAgent)) {
        isSupported = false;
    } else if (
        bowser.isUnsupportedBrowser(SAFARI, window.navigator.userAgent)
    ) {
        isSupported = false;
    } else if (bowser.isUnsupportedBrowser(IE, window.navigator.userAgent)) {
        isSupported = false;
    }

    return isSupported;
}

/**
 * @func check mobiles
 */
function isMobile() {
    return !!bowser.mobile;
}

/**
 * @func check tablets
 */
function isTablet() {
    return !!bowser.tablet;
}

/**
 * @func check warning block should be shown
 */
function isWarningShouldBeShown() {
    var isSetCookie = getCookie('browser_checker') || false;

    if (!isSetCookie) {
        var isBrowserUnsupported = !isBrowserSupported();

        if (isBrowserUnsupported && !isMobile() && !isTablet()) {
            return true;
        }
    }

    return false;
}

/**
 * @func render warning window
 */
function renderWarningWindow() {
    window.warningWindow = document.createElement('div');
    window.warningWindow.style.opacity = 0;
    var CLASS_PREFIX = 'BROWSER__CHECKER__';
    window.warningWindow.id = 'browser-checker';
    window.warningWindow.className = CLASS_PREFIX + 'warning';

    if (!IN_SITE_WRAPPER) {
        window.warningWindow.style.position = 'fixed';
    }

    var wrapper = '<div class="' + CLASS_PREFIX + 'wrapper">';
    wrapper +=
        '<div onClick="removeWarningWindow(window.warningWindow)" class="' +
        CLASS_PREFIX +
        'close"><img src="' +
        PATH_TO_IMAGES +
        'close.png"/></div>';
    wrapper +=
        '<div class="' + CLASS_PREFIX + 'header">Ваш браузер устарел!</div>';
    wrapper +=
        '<div class="' +
        CLASS_PREFIX +
        'text">Чтобы использовать все возможности сайта, загрузите и установите один из этих браузеров: </div>';
    wrapper += '<div class="' + CLASS_PREFIX + 'browsers-block">';
    // ////////////////////start chrome
    wrapper += '<div class="' + CLASS_PREFIX + 'chrome">';
    wrapper += '<img src="' + PATH_TO_IMAGES + 'logo-chrome.png" />';
    wrapper +=
        '<a href="https://www.google.ru/chrome/" class="' +
        CLASS_PREFIX +
        'link" target="_blank">Chrome</a>';
    wrapper += '<div class="' + CLASS_PREFIX + 'subtext">Google</div>';
    wrapper += '</div> ';
    // ////////////////////end chrome
    // ////////////////////start firefox
    wrapper += '<div class="' + CLASS_PREFIX + 'firefox">';
    wrapper += '<img src="' + PATH_TO_IMAGES + 'logo-firefox.png" />';
    wrapper +=
        '<a href="https://www.mozilla.org/ru/firefox/" class="' +
        CLASS_PREFIX +
        'link" target="_blank">Firefox</a>';
    wrapper +=
        '<div class="' + CLASS_PREFIX + 'subtext">Mozilla Foundation</div>';
    wrapper += '</div> ';
    // ////////////////////end firefox
    // ////////////////////start safari
    wrapper += '<div class="' + CLASS_PREFIX + 'safari">';
    wrapper += '<img src="' + PATH_TO_IMAGES + 'logo-safari.png" />';
    wrapper +=
        '<a href="https://support.apple.com/ru-ru/HT204416" class="' +
        CLASS_PREFIX +
        'link" target="_blank">Safari</a>';
    wrapper += '<div class="' + CLASS_PREFIX + 'subtext">Apple</div>';
    wrapper += '</div> ';
    // ////////////////////end safari
    // end browsers-block
    wrapper += '</div> ';
    // end wrapper
    wrapper += '</div> ';

    window.warningWindow.innerHTML = wrapper;

    if (IN_SITE_WRAPPER && SITE_WRAPPER_ID) {
        var wrapperDiv = document.getElementById(SITE_WRAPPER_ID);
        var firstChild = wrapperDiv.firstChild;
        wrapperDiv.insertBefore(window.warningWindow, firstChild);
    } else {
        document.body.appendChild(window.warningWindow);
    }
}

/**
 *
 * @func remove warning window
 */
function removeWarningWindow(el) {
    if (IN_SITE_WRAPPER && SITE_WRAPPER_ID) {
        var wrapperDiv = document.getElementById(SITE_WRAPPER_ID);
        wrapperDiv.removeChild(el);
    } else {
        document.body.removeChild(el);
    }

    setCookie('browser_checker', true);
}
