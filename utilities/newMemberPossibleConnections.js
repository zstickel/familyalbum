const Familymember = require('../models/familymember');



module.exports = async function newMemberPossibleConnnections(familymember, rootmemberid, relationship) {
    let possibleConnections = {
        member: familymember,
        mother: null,
        father: null,
        spouse: null,
        siblings: [],
        children: []
    };
    let rootmember = await Familymember.findById(rootmemberid);
    if (relationship === "Mother") {
        if (rootmember.father) possibleConnections.spouse = await Familymember.findById(rootmember.father);
        if (rootmember.siblings) {
            for (let siblingid of rootmember.siblings) {
                const sibling = await Familymember.findById(siblingid);
                possibleConnections.children.push(sibling);
            }
        }
    }
    if (relationship === "Father") {
        if (rootmember.mother) possibleConnections.spouse = await Familymember.findById(rootmember.mother);
        if (rootmember.siblings) {
            for (let siblingid of rootmember.siblings) {
                const sibling = await Familymember.findById(siblingid);
                possibleConnections.children.push(sibling);
            }
        }
    }
    return possibleConnections;

}