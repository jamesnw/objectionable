import objectionable from "../src/index";

describe("objectionable", () => {
  let logSpy: jest.SpyInstance;
  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });
  afterEach(() => {
    logSpy.mockReset();
  });
  describe("objects", () => {
    test("objects when new field added", () => {
      const objected = objectionable({});
      objected.foo = 1;
      expect(logSpy).toBeCalledWith("Set: /foo to 1");
    });
    test("objects when editing existing field", () => {
      const objected = objectionable({ foo: 2 });
      objected.foo = 1;
      expect(logSpy).toBeCalledWith("Set: /foo to 1");
    });
    test("objects when editing nested field", () => {
      const objected = objectionable({ foo: { bar: 2 } });
      objected.foo.bar = 1;
      expect(logSpy).toBeCalledWith("Set: /foo/bar to 1");
    });
    test("objects when editing nested field a second time", () => {
      const objected = objectionable({ foo: { bar: 2 } });
      objected.foo.bar = 1;
      objected.foo.bar = 3;
      expect(logSpy).toBeCalledWith("Set: /foo/bar to 1");
      expect(logSpy).toBeCalledWith("Set: /foo/bar to 3");
    });
    test("objects when object reassigned", () => {
      let objected = objectionable({ foo: 2 });
      const reassigned = objected;
      reassigned.foo = 3;
      expect(logSpy).toBeCalledWith("Set: /foo to 3");
    });
    test("objects when object deep destructured", () => {
      let objected = objectionable({ foo: { bar: 2 } });
      let { foo } = objected;
      foo.bar = 3;
      expect(logSpy).toBeCalledWith("Set: /foo/bar to 3");
    });
    test("objects when object copied via spread", () => {
      let objected = objectionable({ foo: { bar: 2 } });
      let cloned = { ...objected };
      cloned.foo.bar = 3;
      expect(logSpy).toBeCalledWith("Set: /foo/bar to 3");
    });
  });
  describe("arrays", () => {
    test("objects when adding via push", () => {
      let objected = objectionable([1]);
      objected.push(2);
      expect(logSpy).toBeCalledWith("Set: /1 to 2");
    });
    test("objects when adding deep", () => {
      let objected = objectionable([1, [1]]);
      objected[1].push(2);
      expect(logSpy).toBeCalledWith("Set: /1/1 to 2");
    });
    test("objects when replacing", () => {
      let objected = objectionable([1]);
      objected[0] = 2;
      expect(logSpy).toBeCalledWith("Set: /0 to 2");
    });
    test("objects when adding via assignment", () => {
      let objected = objectionable([1]);
      objected[1] = 2;
      expect(logSpy).toBeCalledWith("Set: /1 to 2");
    });
    test("objects with length when changing length implicitly", () => {
      let objected = objectionable([1]);
      objected.push(2);
      expect(logSpy).toBeCalledWith("Set: /length to 2");
    });
    test("objects when setting length explicitly", () => {
      let objected = objectionable([1]);
      objected.length = 2;
      expect(logSpy).toBeCalledWith("Set: /length to 2");
    });
  });
  describe("mixed object and arrays", () => {
    test("objects to array in object", () => {
      let objected = objectionable({ a: [1] });
      objected.a[0] = 2;
      expect(logSpy).toBeCalledWith("Set: /a/0 to 2");
    });
    test("objects to object in array", () => {
      let objected = objectionable([{ a: 1 }]);
      objected[0].a = 2;
      expect(logSpy).toBeCalledWith("Set: /0/a to 2");
    });
    test("objects to deep combo", () => {
      let objected = objectionable([{ a: [0, { b: [{ c: 1 }] }] }]);
      objected[0].a[1].b[0].c = 2;
      expect(logSpy).toBeCalledWith("Set: /0/a/1/b/0/c to 2");
    });
    test("objects with length changes in deep combo", () => {
      let objected = objectionable([{ a: [0, { b: [{ c: 1 }] }] }]);
      objected[0].a[1].b.push({ d: 3 });
      expect(logSpy).toBeCalledWith("Set: /0/a/1/b/length to 2");
    });
  });
  describe("options", () => {
    describe("setValue", () => {
      test("sets value if not set", () => {
        const objected = objectionable({ foo: { bar: 2 } });
        objected.foo.bar = 1;
        expect(objected.foo.bar).toEqual(1);
      });
      test("sets value if true", () => {
        const objected = objectionable({ foo: { bar: 2 } }, { setValue: true });
        objected.foo.bar = 1;
        expect(objected.foo.bar).toEqual(1);
      });
      test("doesn't set value if false", () => {
        let objected;
        const t = () => {
          objected = objectionable({ foo: { bar: 2 } }, { setValue: false });
          objected.foo.bar = 1;
        };
        expect(t).toThrow(
          "'set' on proxy: trap returned falsish for property 'bar'"
        );
        expect(objected.foo.bar).toEqual(2);
      });
    });
    describe("reporter", () => {
      test("uses console.log as default", () => {
        const objected = objectionable({ foo: { bar: 2 } });
        objected.foo.bar = 1;
        expect(logSpy).toBeCalledWith("Set: /foo/bar to 1");
      });
      test("allows override", () => {
        const mockReporter = jest.fn();
        const objected = objectionable(
          { foo: { bar: 2 } },
          { reporter: mockReporter }
        );
        objected.foo.bar = 1;
        expect(mockReporter).toBeCalledWith(
          { foo: { bar: 1 } },
          "bar",
          "/foo/bar",
          1
        );
      });
    });
  });
  describe("not supported", () => {
    test.skip("objects when replacing object", () => {
      let objected = objectionable({ foo: 2 });
      objected = { foo: 2 };
      expect(logSpy).toBeCalledWith("edited");
    });
    test.skip("objects when object root destructured", () => {
      let objected = objectionable({ foo: 2 });
      let { foo } = objected;
      foo = 3;
      expect(logSpy).toBeCalledWith("Set: /foo to 3");
    });
    test.skip("objects when original object changed", () => {
      const original = { foo: { bar: 2 } };
      let objected = objectionable({ foo: { bar: 2 } });
      original.foo.bar = 3;
      expect(logSpy).toBeCalledWith("Set: /foo/bar to 3");
    });
  });
});
