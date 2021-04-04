const Familymember = require('../models/familymember');



module.exports = async function newMemberPossibleConnnections(familymember, rootmemberid, relationship) {
    let possibleConnections = {
        member: familymember,
        relationship: relationship,
        newConnections: false,
        mother: null,
        father: null,
        spouse: null,
        siblings: [],
        children: []
    };
    let rootmember = await Familymember.findById(rootmemberid);
    if (relationship === "Mother") {
        if (rootmember.father) {
            possibleConnections.spouse = await Familymember.findById(rootmember.father);
            possibleConnections.newConnections = true;
        }
        if (rootmember.siblings) {
            for (let siblingid of rootmember.siblings) {
                const child = await Familymember.findById(siblingid);
                possibleConnections.children.push(child);
                possibleConnections.newConnections = true;
            }
        }
    }
    if (relationship === "Father") {
        if (rootmember.mother) {
            possibleConnections.spouse = await Familymember.findById(rootmember.mother);
            possibleConnections.newConnections = true;
        }
        if (rootmember.siblings) {
            for (let siblingid of rootmember.siblings) {
                const child = await Familymember.findById(siblingid);
                possibleConnections.children.push(child);
                possibleConnections.newConnections = true;
            }
        }
    }
    if (relationship === "Sibling") {
        if (rootmember.mother) {
            possibleConnections.mother = await Familymember.findById(rootmember.mother);
            possibleConnections.newConnections = true;
        }

        if (rootmember.father) {
            possibleConnections.father = await Familymember.findById(rootmember.father);
            possibleConnections.newConnections = true;
        }
        for (let siblingid of rootmember.siblings) {
            if (siblingid.toString() !== familymember._id.toString()) {

                const sibling = await Familymember.findById(siblingid);
                possibleConnections.siblings.push(sibling);
                possibleConnections.newConnections = true;
            }
        }

    }




    return possibleConnections;

}