const axios = require('axios');
const cheerio = require('cheerio');

const domain = 'bvr678ijbvftyujnbvtyujn';

const godaddy = async () => {
  const { data: { Products } } = await axios({
    method: 'get',
    url: 'https://find.godaddy.com/domainsapi/v1/search/spins',
    params: {
      pagestarts: 0,
      pagesize: 1000,
      q: domain,
    },
    headers: {
      Cookie: 'currency=KRW;',
    },
  });
  return Products
    .map(({ Tld: tld, PriceInfo: { CurrentPrice: price } }) => ({ tld, price }));
};

const directHosting = async () => {
  const { data: lawHTML } = await axios.get('https://direct.co.kr/domain/dm_pay.html');
  const $ = cheerio.load(lawHTML);

  const res = $('div[class=con] tbody')
    .first()
    .find('tr').map((i, e) => ({
      tld: $(e).find('th').text(),
      price: $(e).find('td').text().slice(0, -3),
    }))
    .get();

  return res;
};


module.exports = {
  godaddy,
  directHosting,
};
