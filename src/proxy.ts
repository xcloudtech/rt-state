function isIE9_11() {
    // @ts-ignore
    const ua = window?.navigator?.userAgent;
    if (ua == null) {
        return false;
    }
    if (ua.indexOf('Trident/7.0') > -1) {
        return true; // 11
    } else if (ua.indexOf('Trident/6.0') > -1) {
        return true; // 10
    } else if (ua.indexOf('Trident/5.0') > -1) {
        return true; // 9
    }
    return false;
}
export const getProxy = (() => {
    if (isIE9_11()) {
        console.log('inject proxy-polyfill for ie.');
        // @ts-ignore
        require('proxy-polyfill/proxy.min.js');
    }
    return (raw, handlers) => new Proxy(raw, handlers);
})();
