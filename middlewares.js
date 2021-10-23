const axios = require('axios').default;
const config = require('./config');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 600 }); // 10 minutes

const getProducts = async (req, res, next) => {
    console.log(process.env.PRODUCTS_URL)
    try {
        let data;

        if(myCache.has(`products_${req.query.page}`)) {
            data = myCache.get(`products_${req.query.page}`);
        } else {
            data = (await axios(`${config.PRODUCTS_URL}/?page=${req.query.page}`)).data;
            myCache.set(`products_${req.query.page}`, data);
        }

        res.locals.data = data;
        return next();
    } catch (error) {
        return res.status(500).send(error);
    }
}

const getCurrencyConversion = async (req, res, next) => {

    try {
        let data;
    
        if(myCache.has('currency')) {
            data = myCache.get('currency');
        } else {
            data = (await axios(config.CURRENCY_URL)).data;
            myCache.set('currency', data);
        }
    
        const { rate }  = data;
        res.locals.data.products = [ ...res.locals.data.products ].map( product => {
            product.originalPriceInDollars = Number.parseFloat((product.originalPrice / rate).toFixed(2));
            product.priceInDollars = Number.parseFloat((product.price / rate).toFixed(2));
    
            return product;
        });
        
        return next();
    } catch (error) {
        return res.status(500).send(error);
    }
}

const getMoreCurrentProducts = (req, res, next) => {
    const msecPerMinute = 1000 * 60;
    const msecPerHour = msecPerMinute * 60;
    const msecPerDay = msecPerHour * 24;
    const daysInMonth = 30;
    const now = new Date();

    res.locals.data.products = [ ...res.locals.data.products ].filter( product => {
        const interval = (now.getTime() - new Date(product.updatedAt).getTime());
        const intervalAsDays = Math.floor(interval / msecPerDay);

        return intervalAsDays < daysInMonth;
    });
    
    res.locals.data.per_page = res.locals.data.products.length;

    return next();
}

const getCategories = async (req, res, next) => {
    try {
        let data;

        if(myCache.has('categories')) {
            data = myCache.get('categories');
        } else {
            data = (await axios(config.CATEGORIES_URL)).data;
            myCache.set('categories', data);
        }

        res.locals.data = data;

        return next();
    } catch (error) {
        return res.status(500).send(error);
    }
}

const formatCategories = (req, res, next) => {
    const { data: { categories } } = res.locals;

    const format = (categories, parent_id = null) => {
        return categories.reduce((acc, element) => {
          let obj = { ...element };
    
          if (parent_id == element.parent_id) {
            let subcategories = format(categories, element.id);
    
            if (subcategories.length) obj.subcategories = subcategories;
    
            acc.push(obj)
          }
    
          return acc;
        }, []);
    }


    res.locals.data = format(categories);

    return next();
}

module.exports = { getProducts, getCurrencyConversion, getMoreCurrentProducts, getCategories, formatCategories }