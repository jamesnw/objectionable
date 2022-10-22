"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(observed, { setValue = true, reporter } = {}) {
    let defaultReporter = function (object, prop, path, value) {
        console.log(`Set: ${path} to ${value}`);
    };
    const reporterToUse = reporter ? reporter : defaultReporter;
    function pathedHandler(path) {
        return {
            set(obj, prop, value) {
                if (setValue) {
                    obj[prop] = value;
                }
                const fullPath = `${path}/${String(prop)}`;
                reporterToUse(observed, prop, fullPath, value);
                return setValue && Reflect.get(obj, prop, value);
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
}
exports.default = default_1;
