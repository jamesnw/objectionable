interface GenericObserved {
    [key: string | symbol | number]: any;
}
declare type ObjectionableReporterCallback = (object: any, prop: string | symbol | number, path: string, value: any) => void;
interface ObjectionableOptions {
    setValue?: boolean;
    reporter?: ObjectionableReporterCallback;
}
