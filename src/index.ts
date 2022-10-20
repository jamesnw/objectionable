interface GenericObserved {
  [key: string | symbol | number]: any;
}

type iObjectReporterCallback = (
  object: any,
  prop: string | symbol,
  path: string,
  value: any
) => void;
interface iObjectOptions {
  setValue?: boolean;
  reporter?: iObjectReporterCallback;
}

export default function (
  observed: GenericObserved,
  { setValue = true, reporter }: iObjectOptions = {}
): GenericObserved {
  let defaultReporter: iObjectReporterCallback = function (
    object,
    prop,
    path,
    value
  ) {
    console.log(`Set: ${path} to ${value}`);
  };
  const reporterToUse = reporter ? reporter : defaultReporter;
  function pathedHandler(path: string = ""): ProxyHandler<GenericObserved> {
    return {
      set(obj: typeof observed, prop: keyof typeof observed, value: any) {
        if (setValue) {
          obj[prop] = value;
        }
        const fullPath = `${path}/${String(prop)}`;
        reporterToUse(observed, prop, fullPath, value);
        return setValue;
      },
    };
  }
  function observe(item: GenericObserved, hand: object, path: string = "") {
    const keys = Object.keys(item);
    keys.forEach((key) => {
      if (typeof item[key] === "object") {
        item[key] = observe(item[key], hand, path + key);
      }
    });
    return new Proxy(item, pathedHandler(path));
  }
  return observe(observed, pathedHandler());
}
