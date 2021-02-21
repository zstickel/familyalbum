const Familymember = require('../models/familymember');

module.exports.index = async (req, res) => {
    const familymember = await (await Familymember.findOne({ 'first': 'Bethany' }).populate('spouse')).populate('children');
    console.log(familymember.spouse);
    const user = 'Bethany';
    const { id } = req.params;
    console.log(id);
    res.render('familymembers/memberpage', { id, user, familymember });
}

module.exports.tree = async (req, res) => {
    const user = "Bethany";
    const { id } = req.params;
    const familymember = await Familymember.findOne({ 'first': id }).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');

    res.render('familymembers/familytree', { id, user, familymember });
}

module.exports.login = (req, res) => {
    const user = 'Bethany';
    res.render('familymembers/login', { user })
}

module.exports.register = (req, res) => {
    const user = 'Bethany';
    res.render('familymembers/register', { user })
}