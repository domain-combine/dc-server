const Redis = require('ioredis');

const redis = new Redis(6379, process.env.REDIS_URL);

async function getAvailableTlds() {
  const tlds = await redis.get('_tlds');
  return JSON.parse(tlds);
}

async function getList(tlds) {
  const list = {};
  const results = await Promise.all(tlds.map(e => redis.get(e)));

  tlds.forEach((e, i) => {
    list[e] = JSON.parse(results[i]);
  });

  return list;
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
