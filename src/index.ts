interface GenericObserved {
  [key: string | symbol | number]: any;
}

type ObjectionableReporterCallback = (
  object: any,
  prop: string | symbol | number,
  path: string,
  value: any
) => void;
interface ObjectionableOptions {
  setValue?: boolean;
  reporter?: ObjectionableReporterCallback;
}

module.exports = function (
  observed: GenericObserved,
  { setValue = true, reporter }: ObjectionableOptions = {}
): GenericObserved {
  let defaultReporter: ObjectionableReporterCallback = function (
    object,
    prop,
    path,
    value
  ) {
    console.log(`Set: ${path} to ${value}`);
  };
  const reporterToUse = reporter ? reporter : defaultReporter;
  function pathedHandler(path: string): ProxyHandler<GenericObserved> {
    return {
      // @todo- types are only correct for root
      set(obj: typeof observed, prop: keyof typeof observed, value: any) {
        if (setValue) {
          obj[prop] = value;
        }
        const fullPath = `${path}/${String(prop)}`;
        reporterToUse(observed, prop, fullPath, value);
        return setValue && Reflect.set(obj, prop, value);
      },
    };
  }
  function observe(item: GenericObserved, path: string = "") {
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
