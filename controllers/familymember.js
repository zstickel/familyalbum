const Familymember = require('../models/familymember');
const isFamilyMember = require('../utilities/userIsFamilyMember');

module.exports.joinfamily = async (req, res) => {
    const user = req.user;
    let member = await isFamilyMember(user);
    res.render('familymembers/joinfamily', { member, user });
}

module.exports.index = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const familymember = await (await Familymember.findOne({ 'first': user.first, 'last': user.last }).populate('spouse')).populate('children');

    res.render('familymembers/memberpage', { id, user });
}

module.exports.tree = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    console.log(id);
    const familymember = await Familymember.findById(id).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
    console.log(familymember);
    res.render('familymembers/tree', { id, user, familymember });
}

module.exports.mytree = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const familymember = await Familymember.findOne({ 'first': user.first, 'last': user.last }).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
    console.log(familymember);
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