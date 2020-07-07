const cache = {}

const getObject = (key, defval = null) => {
  let v = cache[key];
  if (v === undefined)v = defval;
  return v;
}

const setObject = (key, value) => {
  cache[key] = value
}

const removeObject = (key) => {
  if (Object.keys(cache).indexOf(key) > -1) {
    delete cache[key]
  }
}

export default {
  getObject,
  setObject,
  removeObject,
}

