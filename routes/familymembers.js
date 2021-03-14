const express = require('express');
const router = express.Router({ mergeParams: true });
const familymember = require('../controllers/familymember');



router.route('/joinfamily')
    .get(familymember.joinfamily);

router.route('/:id/joinfamily')
    .post(familymember.addtofamily);


router.route('/:id/tree')
    .get(familymember.tree);

router.route('/:id/mytree')
    .get(familymember.mytree);

router.route('/:id/albumpost')
    .get(familymember.albumpostinput)
    .post(familymember.albumpostmemory);

router.route('/:id/new')
    .get(familymember.renderNewMemberForm)
    .post(familymember.addNewMember)

router.route('/:id')
    .get(familymember.index);







module.exports = router;