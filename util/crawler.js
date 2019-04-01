const axios = require('axios');
const cheerio = require('cheerio');
const {
  Builder,
  By,
  Key,
  until,
} = require('selenium-webdriver');

const domain = 'bvr678ijbvftyujnbvtyujn';

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

const getDirectHostingList = async () => {
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

const getMailPlugList = async () => {
  const driver = await new Builder().forBrowser('chrome').build();
  const arr = [];

  try {
    await driver.get('https://www.mailplug.com/front/domain/domain_regist');
    await driver.findElement(By.name('domainlist1')).sendKeys(domain, Key.RETURN);
    await driver.wait(until.elementLocated(By.className('domain_title')));
    const domains = await driver.findElements(By.className('domain_title'));
    const tlds = domains.map(async x => x.getText());

    await Promise.all(tlds).then((values) => {
      arr.push(...values.slice(1));
    });
  } finally {
    setTimeout(() => driver.quit(), 100);
  }

  return arr;
};

module.exports = {
  getGabiaList,
  getGodaddyList,
  getDirectHostingList,
  getMailPlugList,
};
