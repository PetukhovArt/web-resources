import { ObjectPool } from "./ObjectPool"; // Путь к вашему классу ObjectPool

class TestInstance {
  name = "random " + Math.random().toFixed(3);
  returnName = () => this.name;
}

describe("ObjectPool", () => {
  let pool: ObjectPool<TestInstance>;

  const generate = async (count: number, fromIndex?: number) => {
    const instances: TestInstance[] = [];
    const promises = Array.from({ length: count }, (_, index) => {
      return pool.getInstance(fromIndex ? index + fromIndex : index);
    });

    const results = await Promise.all(promises);
    results.forEach((instance, index) => {
      expect(instance).toBeDefined();
      instances[index] = instance;
    });
    return instances;
  };

  beforeEach(() => {
    pool = new ObjectPool<TestInstance>(() => new TestInstance());
  });

  test("should initialize with correct size", () => {
    expect(pool.getFreePool().length).toBe(10);
  });

  test("method from instance of pool is working", () => {
    const instance = pool.getInstance(0);
    expect(instance).toBeDefined();
    expect(instance.returnName()).toMatch(/random/);
  });

  test("active instances should be returned to free pool", () => {
    jest.useFakeTimers();
    const instance = pool.getInstance(0);
    const instance2 = pool.getInstance(1);
    const instance3 = pool.getInstance(2);
    expect(pool.getFreePool().length).toBe(7);
    jest.advanceTimersByTime(10001);
    expect(pool.getFreePool().length).toBe(10);
  });

  test("should handle 40 requests, and after timeoutToClear(10 sec) free=10 , active=0", async () => {
    jest.useFakeTimers();
    const instances = await generate(40);
    expect(instances.length).toBe(40);
    jest.advanceTimersByTime(10001);
    expect(pool.getFreePool().length).toBeLessThanOrEqual(10);
    expect(pool.getActivePool().size).toBe(0);
  });

  test("should fill freePool to normalSize after timeout", () => {
    jest.useFakeTimers();
    const instances = generate(40);
    expect(pool.getFreePool().length).toBe(0);
    expect(pool.getActivePool().size).toBe(40);
    jest.advanceTimersByTime(10000);
    expect(pool.getFreePool().length).toBe(10);
    expect(pool.getActivePool().size).toBe(0);
  });

  test("should return instance for non-existent index in initial pool", () => {
    jest.useFakeTimers();
    const nonExistentIndex = 100;
    const instance = pool.getInstance(nonExistentIndex);
    expect(instance).toBeTruthy();
  });

  test("should allow re-acquisition of an instance after it has been returned to the freePool", () => {
    jest.useFakeTimers();
    const instance = pool.getInstance(0);
    expect(pool.getFreePool().length).toBe(9);
    expect(pool.getActivePool().size).toBe(1);

    jest.advanceTimersByTime(10001);
    expect(pool.getFreePool().length).toBe(10);
    expect(pool.getActivePool().size).toBe(0);

    const reacquiredInstance = pool.getInstance(0);
    expect(reacquiredInstance).toBeDefined();
    expect(pool.getFreePool().length).toBe(9);
    expect(pool.getActivePool().size).toBe(1);
  });

  test("pool's and timeouts sizes change successfully", async () => {
    jest.useFakeTimers();
    const instances = await generate(20);
    expect(pool.getActivePool().size).toBe(20);
    expect(pool.getActiveTimeouts().size).toBe(20);
    expect(pool.getFreePool().length).toBe(0);

    jest.advanceTimersByTime(2000);
    const instances2 = await generate(10, 20);
    expect(pool.getActivePool().size).toBe(30);
    expect(pool.getActiveTimeouts().size).toBe(30);
    expect(pool.getFreePool().length).toBe(0);

    jest.advanceTimersByTime(2000);
    const instances3 = await generate(10, 30);
    expect(pool.getActivePool().size).toBe(40);
    expect(pool.getActiveTimeouts().size).toBe(40);
    expect(pool.getFreePool().length).toBe(0);

    jest.advanceTimersByTime(6001);
    const normalSize = 10;
    expect(pool.getActivePool().size).toBe(20);
    expect(pool.getActiveTimeouts().size).toBe(20);
    expect(pool.getFreePool().length).toBe(normalSize);

    jest.advanceTimersByTime(2001);
    expect(pool.getActivePool().size).toBe(10);
    expect(pool.getActiveTimeouts().size).toBe(10);
    expect(pool.getFreePool().length).toBe(normalSize);

    jest.advanceTimersByTime(2001);
    expect(pool.getActivePool().size).toBe(0);
    expect(pool.getActiveTimeouts().size).toBe(0);
    expect(pool.getFreePool().length).toBe(normalSize);
  });
});
