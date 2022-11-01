import EventEmitter from 'eventemitter3';

const eventEmitter = new EventEmitter();
const emitter = {
  on: (event: string, fn: (args: any) => void) => eventEmitter.on(event, fn),
  once: (event: string, fn: () => void) => eventEmitter.once(event, fn),
  off: (event: string, fn: () => void) => eventEmitter.off(event, fn),
  emit: (event: string, payload?: unknown) => eventEmitter.emit(event, payload),
};

Object.freeze(emitter);
export default emitter;
