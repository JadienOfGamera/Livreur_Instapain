const Bread = require("./models/Bread");

let breadsChoices = [];

async function loadBreadChoices() {
    const breads = await Bread.find({}).lean();
    breadsChoices = breads.map(b => ({
        name: b.bread_name,
        value: b.bread_name,
    }));
}

function getBreadChoices() {
    return breadsChoices;
}

module.exports = {
    loadBreadChoices,
    getBreadChoices,
};
