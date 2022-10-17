export default function(observed: Object, path: string =''){
    function pathedHandler (path: string){
        return {
            set(obj: typeof observed, prop: keyof typeof observed, value: any){
                obj[prop] = value;
                console.log(`Set: ${path}/${prop} to ${value}`)
                return true;
            }
        }
    }
    function observe(item: Object, hand: object, path: string){
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