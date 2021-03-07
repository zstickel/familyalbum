const Familymember = require('../models/familymember');
const updateMember = require('../utilities/updateMember')

module.exports = async function createNewMember(rootmemberid, params) {
    const { first, last, email, relationship } = params;
    const rootmember = await Familymember.findById(rootmemberid);
    const newMember = new Familymember({ first, last, email });
    switch (relationship) {
        case "Mother":
            newMember.children.push(rootmemberid);
            await newMember.save();
            rootmember.mother = newMember._id;
            await rootmember.save();
            break;
        case "Father":
            newMember.children.push(rootmemberid);
            await newMember.save();
            rootmember.father = newMember._id;
            await rootmember.save();
            break;
        case "ChildMother":
            newMember.mother = rootmemberid;
            await newMember.save();
            rootmember.children.push(newMember._id);
            await rootmember.save();
            break;
        case "ChildFather":
            newMember.father = rootmemberid;
            await newMember.save();
            rootmember.children.push(newMember._id);
            await rootmember.save();
            break;
        default:
            newMember.siblings.push(rootmemberid);
            await newMember.save();
            rootmember.siblings.push(newMember._id);
            await rootmember.save();
    }
    console.log(newMember);
    console.log(rootmember);
}