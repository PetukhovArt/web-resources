type ObjIndexType = number;
type TimeoutType = ReturnType<typeof setTimeout> | null;

/**
 * @param creator функция создания уникального объекта для инициализации в пул
 * @param minSize минимальное количество свободных объектов в пуле, default = 5
 * @param normalSize нормальное количество свободных объектов в пуле, default = 10
 * @param maxSize максимальное количество свободных объектов в пуле, default = 20
 * @param timeToClear таймаут очистки неиспользуемого инстанса
 */
export class ObjectPool<T> {
  /**
   * @private freePool  - массив свободных экземпляров
   * @private activePool  - коллекция активных экземпляров
   * @private activeTimeouts  - коллекция таймаутов на очистку активных экземпляров
   */
  private freePool: T[] = [];
  private activePool: Map<ObjIndexType, T> = new Map();
  private activeTimeouts: Map<ObjIndexType, TimeoutType> = new Map();

  constructor(
    private creator: () => T,
    private minSize = 5,
    private normalSize = 10,
    private maxSize = 20,
    private timeToClear = 10000,
  ) {
    this.fillPool(this.normalSize);
  }

  private get freePoolSize(): number | undefined {
    return this.freePool.length;
  }

  private fillPool(targetSize: number): void {
    const fill = (value: number) => {
      for (let i = 0; i < value; i++) {
        const instance = this.creator();
        this.freePool.push(instance);
      }
    };

    if (!this.freePoolSize) {
      fill(this.normalSize);
      return;
    }

    if (this.freePoolSize) {
      const countToFill = targetSize - this.freePoolSize;
      fill(countToFill);
    }
  }

  private cutPoolToNormal(): void {
    const elementsToRemove = this.freePoolSize - this.normalSize;
    if (elementsToRemove && elementsToRemove > 0) {
      this.freePool.splice(-elementsToRemove, elementsToRemove);
    }
  }

  /**
   * @description получение объекта из активного пула по индексу / свободного пула
   *  дозаполнение freePool, в случае minSize свободных экземпляров
   *  удаление лишних экземпляров freePool, в случае maxSize свободных экземпляров
   *  установка таймаута на очистку экземпляра и возврат в freePool
   */
  public getInstance(index: number): T {
    const activePool: T | undefined = this.activePool.get(index);

    if (activePool) {
      this.setTimeoutToClear(index);
      return activePool;
    }

    const freePool: T | undefined = this.freePool.pop();

    if (freePool) {
      this.activePool.set(index, freePool);
      this.setTimeoutToClear(index);
      return freePool;
    } else {
      const newInstance = this.creator();
      this.activePool.set(index, newInstance);
      this.setTimeoutToClear(index);
      return newInstance;
    }
  }

  private setTimeoutToClear(index: number): void {
    const currentTimeout = this.activeTimeouts.get(index);

    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }

    const newTimeout = setTimeout(() => this.dispose(index), this.timeToClear);
    this.activeTimeouts.set(index, newTimeout);
  }

  /**
   * @description удаление таймаута, перемещение инстанса из активного в свободные
   */
  private dispose(index: number): void {
    this.activeTimeouts.delete(index);

    if (this.freePoolSize >= this.normalSize) {
      this.activePool.delete(index);
      this.cutPoolToNormal();
      return;
    }

    const active = this.activePool.get(index);
    if (active) {
      this.activePool.delete(index);
      this.freePool.push(active);
      this.normalizeFreePool();
      return;
    }
  }

  private normalizeFreePool() {
    if (this.freePoolSize > this.maxSize) {
      this.cutPoolToNormal();
      return;
    }
    if (this.freePoolSize < this.minSize) {
      this.fillPool(this.normalSize);
    }
  }

  public getFreePool() {
    return this.freePool;
  }

  public getActivePool() {
    return this.activePool;
  }

  public getActiveTimeouts() {
    return this.activeTimeouts;
  }
}
