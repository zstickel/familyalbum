const Familymember = require('../models/familymember');
const Family = require('../models/family');

module.exports = async function isFamilyMember(user) {
    const first = user.first;
    const last = user.last;
    const email = user.email;
    const member = await Familymember.findOne({ 'first': first, 'last': last }).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
    if (!member) {
        const familymember = new Familymember({ first: user.first, last: user.last, email: user.email, userid: user._id });
        await familymember.save();
        const family = new Family([familymember._id]);
        await family.save();
        familymember.family = family._id;
        await familymember.save();
        user.family = family._id;
        user.familymember = familymember._id;
        await user.save();
    }
    return member;
}