function getAvailableTlds (domain) {
  return [
    'com',
    'kr',
  ];
}

function getList (tlds) {
  return {
    com: [{
      origin: 'https://somewhere.com',
      price: 10000,
    }],
    kr: [{
      origin: 'https://somewhere.com',
      price: 10000,
    }],
  };
}

function getDetail (tld) {
  return {
    origin: 'https://somewhere.com',
    price: 10000,
  };
}

module.exports = {
  getAvailableTlds,
  getList,
  getDetail,
};