const express = require('express');
const router = express.Router();
const path = require('path');

//app.get('adress of request', __what to to with that__, )
router.get('^/$|/index(.html)?', (req, res) => {//regular expression
    //res.sendFile('./views/index.html', {root: __dirname});
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// router.get('/new-page(.html)?', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
// });

// router.get('/old-page(.html)?', (req, res) => {
//     res.redirect(301, '/new-page.html');//302 by default, but we need 301
// });

module.exports = router;