const axios = require('axios');

const domain = 'bvr678ijbvftyujnbvtyujn.com';

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
    .map(({ Tld, PriceInfo: { CurrentPrice } }) => ({ tld: Tld, price: CurrentPrice }));
};
