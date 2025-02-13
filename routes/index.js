const express = require('express');
const router = express.Router();
const Database = require('../services/database');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const deliveries = await Database.getDeliveries();
  const shops = await Database.getShops();
  const senders = await Database.getSenders();

  res.render('pages/index', {
    title: 'DAO',
    deliveries: deliveries,
    shops: shops,
    senders: senders
  });
});

router.post('/createSender', async function(req, res, next) {
    const name = req.body.name;
    const address = req.body.address;
    const zip = req.body.zip;
    const phone = req.body.phone;
    const email = req.body.email;

    if (!name || !address || !zip || !phone || !email) {
        res.status(400).json({message: 'Missing required fields'});
    } else {
      try {
        const result = await Database.createSender(name, address, zip, phone, email);
        res.json(result);
      } catch (e) {
        res.status(500).json({message: 'Failed to create sender'});
      }
    }
});

router.post('/createShop', async function(req, res, next) {
    const name = req.body.name;
    const address = req.body.address;
    const zip = req.body.zip;
    const phone = req.body.phone;
    const email = req.body.email;
    const lat = req.body.lat;
    const lng = req.body.lng;

    if (!name || !address || !zip || !phone || !email || !lat || !lng) {
        res.status(400).json({message: 'Missing required fields'});
    } else {
      try {
        const result = await Database.createShop(name, address, zip, phone, email, lat, lng);
        res.json(result);
      } catch (e) {
        res.status(500).json({message: 'Failed to create shop'});
      }
    }
});

router.post('/deleteSender/:id', async function(req, res, next) {
    const senderId = req.params.id;

    try {
      const result = await Database.deleteSender(senderId);
      res.json(result);
    } catch (e) {
      res.status(500).json({message: 'Failed to delete sender'});
    }
});

router.post('/deleteShop/:id', async function(req, res, next) {
    const shopId = req.params.id;

    try {
      const result = await Database.deleteShop(shopId);
      res.json(result);
    } catch (e) {
      res.status(500).json({message: 'Failed to delete shop'});
    }
});

router.post('/createDelivery', async function(req, res, next) {
    const shopId = req.body.shopId;
    const senderId = req.body.senderId;

    if (!shopId || !senderId) {
        res.status(400).json({message: 'Missing required fields'});
    } else {
      try {
        const result = await Database.createDelivery(shopId, senderId);
        res.json(result);
      } catch (e) {
        res.status(500).json({message: 'Failed to create delivery'});
      }
    }
});

router.get('/getDeliveries', async function(req, res, next) {
  const deliveries = await Database.getDeliveries();
  res.json(deliveries);
});

router.get('/getPendingPackages/:shopName', async function(req, res, next) {
    const shopName = req.params.shopName;
    const pendingPackages = await Database.getPendingPackages(shopName);

    console.log(pendingPackages);

    res.json(pendingPackages);
});

router.post('/startDelivery/:id', async function(req, res, next) {
    const packageId = req.params.id;

    try {
        const result = await Database.markDeliveryPending(packageId);
        res.json(result);
    } catch (e) {
        res.status(500).json({message: 'Failed to start delivery', error: e});
    }
});

router.post('/cancelDelivery/:id', async function(req, res, next) {
    const packageId = req.params.id;

    try {
        const result = await Database.markDeliveryCanceled(packageId);
        res.json(result);
    } catch (e) {
        res.status(500).json({message: 'Failed to cancel delivery', error: e});
    }
});

router.post('/registerPackages', async function(req, res, next) {
  const packages = req.body;

  if (!packages || !packages.length) {
    res.status(400).json({message: 'Missing required fields'});
  } else {
    try {
      let success = true;
      for (let i = 0; i < packages.length; i++) {
        const result = await Database.markDeliveryDelivered(packages[i]);
        if (result.affectedRows === 0) success = false;
      }

      res.json(success);
    } catch (e) {
        res.status(500).json({message: 'Failed to register packages'});
    }
  }
});

module.exports = router;
