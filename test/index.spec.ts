import iObject from '../src/index';

describe('iObject', ()=>{
    let logger;
    beforeEach(()=>{
        logger = jest.spyOn(console, 'log');
    })
    test('reports when new field added', ()=>{
        const objected = iObject({});
        objected.foo = 1;
        expect(logger).toBeCalledWith('Set: /foo to 1')
    })
    test('reports when editing existing field', ()=>{
        const objected = iObject({foo: 2});
        objected.foo = 1;
        expect(logger).toBeCalledWith('Set: /foo to 1')
    })
    test('reports when editing nested field', ()=>{
        const objected = iObject({foo: {bar: 2}});
        objected.foo.bar = 1;
        expect(logger).toBeCalledWith('Set: foo/bar to 1')
    })
    test('reports when editing nested field a second time', ()=>{
        const objected = iObject({foo: {bar: 2}});
        objected.foo.bar = 1;
        objected.foo.bar = 3;
        expect(logger).toBeCalledWith('Set: foo/bar to 3')
    })
    test.skip('reports when replacing object', ()=>{
        let objected = iObject({foo: 2});
        objected = {foo: 2}
        expect(logger).toBeCalledWith('edited')
    })
})