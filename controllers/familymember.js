const Familymember = require('../models/familymember');
const Family = require('../models/family');
const Memory = require('../models/memory');
const isFamilyMember = require('../utilities/userIsFamilyMember');
const createNewMember = require('../utilities/createNewMember');
const { findById } = require('../models/familymember');



module.exports.joinfamily = async (req, res) => {
    const user = req.user;
    let member = await isFamilyMember(user);
    res.render('familymembers/joinfamily', { member, user });
}

module.exports.albumpostinput = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const familymember = await Familymember.findById(id);
    res.render('familymembers/albumnpost', { user, familymember });
}

module.exports.albumpostmemory = async (req, res) => {
    const { memorytext, date, file } = req.body;
    const { id } = req.params;
    const user = req.user;
    const userid = user._id;
    let familymember = await Familymember.findById(id);
    const memory = new Memory({ familymember: id, description: memorytext, date: date, poster: userid })
    await memory.save();
    familymember.memories.push(memory._id);
    await familymember.save();
    familymember = await Familymember.findById(id).populate({
        path: 'memories',
        populate: {
            path: 'poster'
        }
    }).populate('poster');

    res.render('familymembers/familymemberalbum', { user, familymember });
}

module.exports.album = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const familymember = await Familymember.findById(id).populate({
        path: 'memories',
        populate: {
            path: 'poster'
        }
    }).populate('poster');

    res.render('familymembers/familymemberalbum', { id, user, familymember });
}

module.exports.addtofamily = async (req, res) => {
    const answer = req.body.join;
    const { id } = req.params;
    const user = req.user;
    if (answer === 'join') {
        const familymember = await Familymember.findById(id).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
        const family = await Family.findById(familymember.family);
        familymember.userid = user._id;
        user.family = family._id;
        user.familymember = familymember._id;
        await familymember.save();
        await user.save();
        res.render('familymembers/tree', { id, user, familymember });
    }
    else {
        const familymember = new Familymember({ first: user.first, last: user.last, email: user.email, userid: user._id });
        await familymember.save();
        const family = new Family([familymember._id]);
        await family.save();
        familymember.family = family._id;
        await familymember.save();
        user.family = family._id;
        user.familymember = familymember._id;
        await user.save();
        res.render('familymembers/tree', { id, user, familymember });
    }
}


module.exports.index = async (req, res) => {
    const user = req.user;
    const id = user.familymember;
    const familymember = await Familymember.findById(id).populate({
        path: 'memories',
        populate: {
            path: 'poster'
        }
    }).populate('poster');

    res.render('familymembers/familymemberalbum', { id, user, familymember });
}

module.exports.tree = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const familymember = await Familymember.findById(id).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
    res.render('familymembers/tree', { id, user, familymember });
}

module.exports.mytree = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const memberid = user.familymember;
    const familymember = await Familymember.findOne(memberid).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
    res.render('familymembers/tree', { id, user, familymember });
}

module.exports.renderNewMemberForm = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const familymember = await Familymember.findById(id);
    res.render('familymembers/new', { user, familymember });
}

module.exports.addNewMember = async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const possibleConnections = await createNewMember(id, req.body.familymember);
    const familymember = await Familymember.findById(id).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');
    if (possibleConnections.newConnections === true) {
        res.render('familymembers/checkconnections', { id, user, familymember, possibleConnections });
    }
    else {
        res.render('familymembers/tree', { id, user, familymember });
    }
}


module.exports.checkConnectionsandUpdate = async (req, res) => {
    const { id, relationship } = req.params;
    const user = req.user;
    let spouse;
    let mother;
    let father;
    let familymember = await Familymember.findById(id);
    const entirefam = req.body;
    let startsWithChild = /^child/;
    let startsWithSibling = /^sibling/;
    for (const property in entirefam) {
        if (startsWithChild.test(property)) {

            let child = JSON.parse(entirefam[property]);
            const childMember = await Familymember.findById(child._id);
            if (relationship === "Father") {
                childMember.father = familymember._id;
            } else {
                childMember.mother = familymember._id;
            }
            await childMember.save();
            familymember.children.push(child._id);
        }
        if (startsWithSibling.test(property)) {
            let sibling = JSON.parse(entirefam[property]);
            const siblingMember = await Familymember.findById(sibling._id);
            siblingMember.siblings.push(familymember._id);
            await siblingMember.save();
            familymember.siblings.push(sibling._id);
        }
    }

    if (req.body.spouse) {
        spouse = JSON.parse(req.body.spouse);
        const spouseMember = await Familymember.findById(spouse._id);
        spouseMember.spouse = familymember._id;
        await spouseMember.save();
        familymember.spouse = spouse._id;
    }
    if (req.body.mother) {
        mother = JSON.parse(req.body.mother);
        const motherMember = await Familymember.findById(mother._id);
        motherMember.children.push(familymember._id);
        await motherMember.save();
        familymember.mother = mother._id;
    }
    if (req.body.father) {
        father = JSON.parse(req.body.father);
        const fatherMember = await Familymember.findById(father._id);
        fatherMember.children.push(familymember._id);
        await fatherMember.save();
        familymember.father = father._id;
    }



    await familymember.save();
    familymember = await Familymember.findById(id).populate('spouse').populate('children').populate('mother').populate('father').populate('siblings');

    res.render('familymembers/tree', { id, user, familymember });
}


