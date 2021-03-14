const Familymember = require('../models/familymember');
const Family = require('../models/family');
const Memory = require('../models/memory');
const isFamilyMember = require('../utilities/userIsFamilyMember');
const createNewMember = require('../utilities/createNewMember');
const { findById } = require('../models/familymember');
const moment = require('moment');


module.exports.joinfamily = async (req, res) => {
    const user = req.user;
    let member = await isFamilyMember(user);
    res.render('familymembers/joinfamily', { member, user });
}

module.exports.albumpostinput = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const familymember = await Familymember.findById(id);
    res.render('familymembers/albumnpost', { user, familymember });
}

module.exports.albumpostmemory = async (req, res) => {
    const { memorytext, date, file } = req.body;
    const { id } = req.params;
    const user = req.user;
    const dateformat = moment(date).format();
    console.log(dateformat);
    const newdate = new Date(dateformat);
    console.log(newdate.toString());
    const memory = new Memory({ familymember: id, description: memorytext, date: newdate, user: user._id, })
    console.log(memory);
    console.log(memory.date.toString());
    res.send('Made it here');
}

module.exports.addtofamily = async (req, res) => {
    const answer = req.body.join;
    const { id } = req.params;
    const user = req.user;
    if (answer === 'join') {
        const familymember = await Familymember.findById(id).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
        const family = await Family.findById(familymember.family);
        familymember.userid = user._id;
        user.family = family._id;
        user.familymember = familymember._id;
        await familymember.save();
        await user.save();
        res.render('familymembers/tree', { id, user, familymember });
    }
    else {
        const familymember = new Familymember({ first: user.first, last: user.last, email: user.email, userid: user._id });
        await familymember.save();
        const family = new Family([familymember._id]);
        await family.save();
        familymember.family = family._id;
        await familymember.save();
        user.family = family._id;
        user.familymember = familymember._id;
        await user.save();
        res.render('familymembers/tree', { id, user, familymember });
    }
}


module.exports.index = async (req, res) => {
    const user = req.user;
    const id = user.familymember;
    const familymember = await Familymember.findById(id).populate('spouse').populate('children');

    res.render('familymembers/memberpage', { id, user });
}

module.exports.tree = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const familymember = await Familymember.findById(id).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
    res.render('familymembers/tree', { id, user, familymember });
}

module.exports.mytree = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const memberid = user.familymember;
    const familymember = await Familymember.findOne(memberid).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
    res.render('familymembers/tree', { id, user, familymember });
}

module.exports.renderNewMemberForm = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const familymember = await Familymember.findById(id);
    res.render('familymembers/new', { user, familymember });
}

module.exports.addNewMember = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    await createNewMember(id, req.body.familymember);
    const familymember = await Familymember.findById(id).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
    res.render('familymembers/tree', { id, user, familymember });
}


