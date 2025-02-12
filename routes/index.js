const express = require('express');
const router = express.Router();
const Database = require('../services/database');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/getDeliveries', async function(req, res, next) {
  const deliveries = await Database.getDeliveries()
  res.json(deliveries);
});

router.get('/getPendingPackages', async function(req, res, next) {
  const pendingPackages = await Database.getPendingPackages();

  res.json(pendingPackages);
});

router.post('/registerPackages', async function(req, res, next) {
  const packages = req.body;

  let success = true;
  for (let i = 0; i < packages.length; i++) {
    const result = await Database.markPackageDelivered(packages[i]);
    if (result.affectedRows === 0) success = false;
  }

  res.json(success);
});

module.exports = router;
