const { getProducts, getCurrencyConversion, getMoreCurrentProducts, getCategories, formatCategories } = require('../middlewares');
const { Router } = require('express');
const router = Router();

router.get('/', getProducts, getCurrencyConversion, getMoreCurrentProducts, (req, res) => {
    return res.send(res.locals.data);
});

router.get('/categories', getCategories, formatCategories, (req, res) => {
    return res.send(res.locals.data);
});

module.exports = router;