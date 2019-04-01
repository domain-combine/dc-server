const axios = require('axios');
const {
  Builder,
  By,
  Key,
  until,
} = require('selenium-webdriver');

const domain = 'dfjdkfjkadsjfldksjf';

const getGabiaList = async () => {
  const driver = await new Builder().forBrowser('chrome').build();
  const arr = [];

  try {
    await driver.get('https://www.gabia.com/');
    await driver.findElement(By.id('new_domain')).sendKeys(domain, Key.RETURN);
    await driver.wait(until.elementLocated(By.id('ul_recommend')));
    const domains = await driver.findElement(By.css('#ul_recommend')).getText();
    domains.split('\n').forEach((e, i) => {
      if (i % 2 === 0) arr.push({ tld: e.split(' ')[0].split('.')[1], price: undefined });
      else [arr[Math.floor(i / 2)].price] = e.split(' /');
    });
  } finally {
    await driver.quit();
  }

  return arr;
};

const getGodaddyList = async () => {
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

const getHostingKrList = async () => {
  const { data: { event: prices } } = await axios('https://www.hosting.kr/domains/carts/prices');
  const arr = [];
  Object.keys(prices).forEach((key) => {
    arr.push({ tld: key.slice(1), price: prices[key][1] });
  });
  return arr;
};

module.exports = {
  getGabiaList,
  getGodaddyList,
  getHostingKrList,
};
