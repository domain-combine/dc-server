const axios = require('axios');
const domains = require('../models/domain');

const validateDomain = async (domain, tld) => {
  const apiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=at_AYhrsq6qQrSETtqsn4V3UQFgxj0HQ&domainName=${domain}.${tld}&outputFormat=json`;
  const { data: { WhoisRecord: { parseCode } } } = await axios.get(apiUrl);
  if (parseCode === 0) {
    return true;
  }
  return false;
};

const validateTld = async (domain, tlds) => {
  const results = [];
  for (let i = 0; i < tlds.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    const res = await validateDomain(domain, tlds[i]);
    console.log(`${tlds[i]} > ${res}`);
    if (res) {
      results.push(tlds[i]);
    }
  }
  return results;
};

const getList = (req, res) => {
  const allTlds = domains.getAvailableTlds(req.params.domain);
  const availableTlds = validateTld(req.params.domain, allTlds);
  const tlds = domains.getList(availableTlds);

  const result = [];
  Object.keys(tlds).forEach((tld) => {
    const { length } = tlds[tld];
    const { origin, price: minPrice } = tlds[tld].sort((x, y) => x.price - y.price)[0];
    result.push({
      tld, origin, minPrice, length,
    });
  });

  res.json(result);
};

const getDetail = (req, res) => {
  res.json(domains.getDetail(req.params.tld));
};

module.exports = {
  getList,
  getDetail,
};
