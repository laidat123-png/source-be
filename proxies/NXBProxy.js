const NXB = require('../models/nxb');
const User = require('../models/user');

class NXBProxy {
    constructor() {
        this.nxbModel = NXB;
    }

    async createNXB(userID, nxbData) {
        const admin = await User.findById(userID);
        if (admin.role !== 'admin') {
            throw new Error("Bạn không đủ quyền");
        }
        return await this.nxbModel.create(nxbData);
    }

    async deleteNXB(userID, nxbID) {
        const admin = await User.findById(userID);
        if (admin.role !== 'admin') {
            throw new Error("Bạn không đủ quyền");
        }
        return await this.nxbModel.findByIdAndDelete(nxbID);
    }

    async getAllNXBs() {
        return await this.nxbModel.find({});
    }
}

module.exports = NXBProxy;