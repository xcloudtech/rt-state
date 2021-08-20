export const getProxy = (() => {
    return (raw, handlers) => new Proxy(raw, handlers);
})();
