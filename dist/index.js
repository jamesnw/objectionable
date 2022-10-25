"use strict";
module.exports = function (observed, { setValue = true, reporter } = {}) {
    let defaultReporter = function (object, prop, path, value) {
        console.log(`Set: ${path} to ${value}`);
    };
    const reporterToUse = reporter ? reporter : defaultReporter;
    function pathedHandler(path) {
        return {
            // @todo- types are only correct for root
            set(obj, prop, value) {
                if (setValue) {
                    obj[prop] = value;
                }
                const fullPath = `${path}/${String(prop)}`;
                reporterToUse(observed, prop, fullPath, value);
                return setValue && Reflect.set(obj, prop, value);
            },
        };
    }
    function observe(item, path = "") {
        const keys = Object.keys(item);
        keys.forEach((key) => {
            if (["object", "array"].includes(typeof item[key])) {
                item[key] = observe(item[key], `${path}/${key}`);
            }
        });
        return new Proxy(item, pathedHandler(path));
    }
    return observe(observed);
};
