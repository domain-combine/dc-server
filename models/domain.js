const Redis = require('ioredis');
const zipObject = require('lodash.zipobject');

const redis = new Redis(6379, process.env.REDIS_URL);

async function getAvailableTlds() {
  const tlds = await redis.get('_tlds');
  return JSON.parse(tlds);
}

async function getList(tlds) {
  const results = await redis.mget(...tlds);

  return zipObject(tlds, results.map(e => JSON.parse(e)));
}

async function getDetail(tld) {
  const result = await redis.get(tld);
  return JSON.parse(result);
}

module.exports = {
  getAvailableTlds,
  getList,
  getDetail,
};
