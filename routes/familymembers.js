const express = require('express');
const router = express.Router({ mergeParams: true });
const familymember = require('../controllers/familymember');



router.route('/joinfamily')
    .get(familymember.joinfamily);


router.route('/:id/tree')
    .get(familymember.tree);

router.route('/:id/mytree')
    .get(familymember.mytree);

router.route('/:id')
    .get(familymember.index);







module.exports = router;