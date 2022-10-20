import iObject from "../src/index";

describe("iObject", () => {
  let logger;
  beforeEach(() => {
    logger = jest.spyOn(console, "log");
  });
  test("reports when new field added", () => {
    const objected = iObject({});
    objected.foo = 1;
    expect(logger).toBeCalledWith("Set: /foo to 1");
  });
  test("reports when editing existing field", () => {
    const objected = iObject({ foo: 2 });
    objected.foo = 1;
    expect(logger).toBeCalledWith("Set: /foo to 1");
  });
  test("reports when editing nested field", () => {
    const objected = iObject({ foo: { bar: 2 } });
    objected.foo.bar = 1;
    expect(logger).toBeCalledWith("Set: foo/bar to 1");
  });
  test("reports when editing nested field a second time", () => {
    const objected = iObject({ foo: { bar: 2 } });
    objected.foo.bar = 1;
    objected.foo.bar = 3;
    expect(logger).toBeCalledWith("Set: foo/bar to 3");
  });
  test.skip("reports when replacing object", () => {
    let objected = iObject({ foo: 2 });
    objected = { foo: 2 };
    expect(logger).toBeCalledWith("edited");
  });
  describe("options", () => {
    describe("setValue", () => {
      test("sets value if not set", () => {
        const objected = iObject({ foo: { bar: 2 } });
        objected.foo.bar = 1;
        expect(objected.foo.bar).toEqual(1);
      });
      test("sets value if true", () => {
        const objected = iObject({ foo: { bar: 2 } }, { setValue: true });
        objected.foo.bar = 1;
        expect(objected.foo.bar).toEqual(1);
      });
      test("doesn't set value if false", () => {
        let objected;
        const t = () => {
          objected = iObject({ foo: { bar: 2 } }, { setValue: false });
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
        const objected = iObject({ foo: { bar: 2 } });
        objected.foo.bar = 1;
        expect(logger).toBeCalledWith("Set: foo/bar to 1");
      });
      test("allows override", () => {
        const mockReporter = jest.fn();
        const objected = iObject(
          { foo: { bar: 2 } },
          { reporter: mockReporter }
        );
        objected.foo.bar = 1;
        expect(mockReporter).toBeCalledWith(
          { foo: { bar: 1 } },
          "bar",
          "foo/bar",
          1
        );
      });
    });
  });
});
