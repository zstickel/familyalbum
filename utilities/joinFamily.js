const Familymember = require('../models/familymember');
const Family = require('../models/family');

module.exports = async function joinFamily(id, user) {
    const familymember = await Familymember.findById(id).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
    const family = await Family.findById(familymember.family);
    familymember.userid = user._id;
    user.family = family._id;
    user.familymember = familymember._id;
    await familymember.save();
    await user.save();
}
