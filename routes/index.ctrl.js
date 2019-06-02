const axios = require('axios');
const domains = require('../models/domain');

const validateDomain = async (domain, tld) => {
  const apiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${process.env['WHOIS_APIKEY']}&domainName=${domain}.${tld}&outputFormat=json`;
  const { data: { WhoisRecord: { parseCode } } } = await axios.get(apiUrl);
  if (parseCode === 0) {
    return true;
  }
  return false;
};

const validateTld = async (domain, tlds) => {
  const isValid = await Promise.all(tlds.map(tld => validateDomain(domain, tld)));
  const result = tlds.filter((_, index) => isValid[index]);
  return result;
};

const getList = async (req, res) => {
  const allTlds = await domains.getAvailableTlds(req.query.domain);
  const availableTlds = await validateTld(req.query.domain, allTlds);
  const tlds = await domains.getList(availableTlds);

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

const getDetail = async (req, res) => {
  res.json(await domains.getDetail(req.query.tld));
};

module.exports = {
  getList,
  getDetail,
};
