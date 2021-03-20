const Familymember = require('../models/familymember');



module.exports = async function newMemberPossibleConnnections(familymember, rootmemberid, relationship) {
    let possibleConnections = {
        mother: null,
        father: null,
        spouse: null,
        siblings: [],
        children: []
    };
    let rootmember = await Familymember.findById(rootmemberid);
    if (relationship === "Mother") {
        possibleConnections.spouse = rootmember.father;
        for (let sibling of rootmember.siblings) {
            possibleConnections.children.push(sibling);
        }
    }
    if (relationship === "Father") {
        possibleConnections.spouse = rootmember.mother;
        for (let sibling of rootmember.siblings) {
            possibleConnections.children.push(sibling);
        }
    }
    return possibleConnections;

}