const dotEnv = require('dotenv').config();

module.exports = {
    PRODUCTS_URL: process.env.PRODUCTS_URL,
    CURRENCY_URL: process.env.CURRENCY_URL,
    CATEGORIES_URL: process.env.CATEGORIES_URL,
    PORT: process.env.PORT || 5000
}