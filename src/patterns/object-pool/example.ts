import {ObjectPool} from './ObjectPool';

class TestInstance {
	name = 'random ' + Math.random().toFixed(3);
	returnName = () => this.name;
}

class ParentClass {
	pool: ObjectPool<TestInstance>;

	constructor() {
		//initialize pool
		this.pool = new ObjectPool<TestInstance>(() => new TestInstance());
	}

	getData(channelId: number) {
		//get instance by index
		const instance = this.pool.getInstance(channelId - 1);
		//use instance
		return instance.returnName();
	}
}

const c = new ParentClass();
console.log(c.getData(1)); // some data from 0 index instance
console.log(c.getData(2)); // some data from 1 index instance