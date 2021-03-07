const Familymember = require('../models/familymember');

module.exports = async function isFamilyMember(user) {
    const first = user.first;
    const last = user.last;
    const email = user.email;
    const member = await Familymember.findOne({ 'first': first, 'last': last }).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
    if (!member) {
        const newMember = new Familymember({ first, last, email });
        await newMember.save();
    }
    return member;
}