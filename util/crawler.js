const axios = require('axios');
const cheerio = require('cheerio');
const {
  Builder,
  By,
  Key,
  until,
} = require('selenium-webdriver');
const puppeteer = require('puppeteer');


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

const getHostingKrList = async () => {
  const { data: { event: prices } } = await axios('https://www.hosting.kr/domains/carts/prices');
  const arr = [];
  Object.keys(prices).forEach((key) => {
    arr.push({ tld: key.slice(1), price: prices[key][1] });
  });
  return arr;
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

const getOnlyDomainsList = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let result = [];

  try {
    await page.goto('https://www.onlydomains.com');
    await page.type('#domain', domain);
    await page.keyboard.press('Enter');
    await page.waitForSelector('#searchResultPage > div.Results > div.HomeResult > div');
    // eslint-disable-next-line no-undef
    const [{ ecommerce: { impressions: prices } }] = await page.evaluate(() => dataLayer);
    result = prices.map(({ name: tld, price }) => ({ tld, price }));
  } finally {
    await browser.close();
  }

  return result;
};

module.exports = {
  getGabiaList,
  getGodaddyList,
  getHostingKrList,
  getDirectHostingList,
  getOnlyDomainsList,
};
