const express = require('express');
const router = express.Router({ mergeParams: true });
const familymember = require('../controllers/familymember');
const upload = require('../utilities/multerupload');
const catchAsync = require('../utilities/catchAsync');


router.route('/joinfamily')
    .get(catchAsync(familymember.joinfamily));

router.route('/:id/joinfamily')
    .post(catchAsync(familymember.addtofamily));

router.route('/:id/checkconnections/:relationship')
    .post(catchAsync(familymember.checkConnectionsandUpdate));

router.route('/:id/tree')
    .get(catchAsync(familymember.tree));

router.route('/:id/mytree')
    .get(catchAsync(familymember.mytree));

router.route('/:id/albumpost')
    .get(catchAsync(familymember.albumpostinput))
    .post(upload.single('file'), catchAsync(familymember.albumpostmemory));

router.route('/:id/album')
    .get(catchAsync(familymember.album));

router.route('/:id/new')
    .get(catchAsync(familymember.renderNewMemberForm))
    .post(catchAsync(familymember.addNewMember))

router.route('/:id')
    .get(catchAsync(familymember.index));







module.exports = router;