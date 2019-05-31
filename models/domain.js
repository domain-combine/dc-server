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
    list[e] = results[i];
  });

  return list;
}

function getDetail(tld) {
  return redis.get(tld);
}

module.exports = {
  getAvailableTlds,
  getList,
  getDetail,
};
