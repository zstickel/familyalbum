const Familymember = require('../models/familymember');

module.exports = async function isFamilyMember(user) {
    const first = user.first;
    const last = user.last;
    const member = await Familymember.findOne({ 'first': first, 'last': last });
    return member;
}