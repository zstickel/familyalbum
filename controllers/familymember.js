const Familymember = require('../models/familymember');
const Family = require('../models/family');
const isFamilyMember = require('../utilities/userIsFamilyMember');
const createNewMember = require('../utilities/createNewMember');


module.exports.joinfamily = async (req, res) => {
    const user = req.user;
    let member = await isFamilyMember(user);
    res.render('familymembers/joinfamily', { member, user });
}

module.exports.addtofamily = async (req, res) => {
    const answer = req.body.join;
    const { id } = req.params;
    console.log(answer);
    console.log(id);
    const user = req.user;
    if (answer === 'join') {
        const familymember = await Familymember.findById(id);
        const family = await Family.findById(familymember.family);
        familymember.userid = user._id;
        user.family = family._id;
        user.familymember = familymember._id;
        await familymember.save();
        await user.save();
        console.log(familymember);
        console.log(user);
    }
    else {

    }
    res.send('made it here');
}


module.exports.index = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const familymember = await Familymember.findOne({ 'first': user.first, 'last': user.last }).populate('spouse').populate('children');

    res.render('familymembers/memberpage', { id, user });
}

module.exports.tree = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    console.log(id);
    const familymember = await Familymember.findById(id).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
    res.render('familymembers/tree', { id, user, familymember });
}

module.exports.mytree = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const familymember = await Familymember.findOne({ 'first': user.first, 'last': user.last }).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');

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




module.exports.login = (req, res) => {
    const user = 'Bethany';
    res.render('familymembers/login', { user })
}

module.exports.register = (req, res) => {
    const user = 'Bethany';
    res.render('familymembers/register', { user })
}