const Familymember = require('../models/familymember');


module.exports = async function populateFamilyMembers(newmember, relationship, relatedfamilymember) {
    switch (relationship) {
        case "Mother":
            console.log("Hi mom!");
            break;
        case "Father":
            console.log("Hi dad!");
            break;
        case "Child":
            console.log("Hi kids");
            break;
        default:
            console.log("Hi sibling!")
    }
}