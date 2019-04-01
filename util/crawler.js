const {
  Builder,
  By,
  Key,
  until,
} = require('selenium-webdriver');

const domain = 'dfjdkfjkadsjfldksjf';

const getGabiaPrice = async () => {
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

module.exports = {
  getGabiaPrice,
};
