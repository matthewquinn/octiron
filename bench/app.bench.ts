

function random() {
  return Math.random().toString(36) + Math.random().toString(36) + Math.random().toString(36);
}

function randomNumber(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const keys = Array.from({ length: 1000 }).map(random);
const strObj: Record<string, string> = keys.reduce((acc, key) => ({ ...acc, [key]: random() }), {});
const symObj: Record<symbol, string> = keys.reduce((acc, key) => ({ ...acc, [Symbol.for(key)]: random() }), {});
const strMap = new Map(Object.entries(strObj));
const symMap: Map<symbol, string> = new Map<symbol, string>(
  Reflect.ownKeys(symObj)
  .filter((sym) => typeof sym === 'symbol')
  .map((sym) => [sym, symObj[sym]])
);
const findKeys = Array.from({ length: 100 }).map(() => keys[randomNumber(0, 1000 - 1)]);


Deno.bench("Str obj", { n: 100 }, () => {
  for (const key of findKeys) {
    strObj[key];
    strObj[key];
    strObj[key];
  }
});

Deno.bench("Sym obj", { n: 100 }, () => {
  for (const key of findKeys) {
    const symbol = Symbol.for(key);
    
    symObj[symbol];
    symObj[symbol];
    symObj[symbol];
  }
});

Deno.bench("Str map", { n: 100 }, () => {
  for (const key of findKeys) {
    strMap.get(key);
    strMap.get(key);
    strMap.get(key);
  }
});

Deno.bench("Sym map", { n: 100 }, () => {
  for (const key of findKeys) {
    const symbol = Symbol.for(key);
    
    symMap.get(symbol);
    symMap.get(symbol);
    symMap.get(symbol);
  }
});
