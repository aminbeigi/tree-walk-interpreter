import { Lox } from "../Lox";

describe("Lox - run", () => {
  let logSpy: jest.SpyInstance;
  let errorLogSpy: jest.SpyInstance;
  const lox = new Lox();

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, "log");
    errorLogSpy = jest.spyOn(console, "error");
  });

  afterEach(() => {
    logSpy.mockRestore();
    errorLogSpy.mockRestore();
  });

  it("should interpret valid source code to number", () => {
    const source = "(20 * (5 + 3) - (7 * 2)) / (4 + 2)";
    const expected = "24.333333333333332";
    lox.run(source);
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(expected);
  });

  it("should interpret valid source code to boolean", () => {
    const source = "(5 * 2) < (10 + 3)";
    const expected = "true";
    lox.run(source);
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(expected);
  });

  it("should interpret erroneus source code", () => {
    const source = "3 + apples";
    const expected = "[line 0] Error at 'apples': Expect expression.";
    lox.run(source);
    expect(errorLogSpy).toHaveBeenCalledTimes(1);
    expect(errorLogSpy).toHaveBeenCalledWith(expected);
  });
});
