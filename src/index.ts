interface GenericObserved {
    [key: string | symbol]: any;
} 
export default function(observed: GenericObserved, path: string ='') : GenericObserved{
    function pathedHandler (path: string) : ProxyHandler<GenericObserved>{
        return {
            set(obj: typeof observed, prop: keyof typeof observed, value: any){
                obj[prop] = value;
                console.log(`Set: ${path}/${String(prop)} to ${value}`)
                return true;
            }
        }
    }
    function observe(item: GenericObserved, hand: object, path: string){
        const keys = Object.keys(item);
        keys.forEach(key=>{
            if(typeof item[key] === 'object'){
                item[key] = observe(item[key], hand, path + key);
            }
        })
        return new Proxy(item, pathedHandler(path))
        
    }
    return observe(observed, pathedHandler(path), path);
}