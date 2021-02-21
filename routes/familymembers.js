const express = require('express');
const router = express.Router({ mergeParams: true });
const familymember = require('../controllers/familymember');


router.route('/login')
    .get(familymember.login);

router.route('/register')
    .get(familymember.register);


router.route('/:id')
    .get(familymember.index);


router.route('/:id/tree')
    .get(familymember.tree);




module.exports = router;