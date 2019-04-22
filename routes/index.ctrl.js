const Domain = require('../models/domain');

const getList = (req, res) => {
  res.json(Domain.getList(req.query.domain));
};

const getDetail = (req, res) => {
  res.json(Domain.getDetail(req.query.tld));
};

module.exports = {
  getList,
  getDetail,
};
