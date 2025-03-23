const Type = require('../models/type');
const User = require('../models/user');

class TypeProxy {
    constructor() {
        this.typeModel = Type;
    }

    async createType(userID, typeData) {
        const admin = await User.findById(userID);
        if (admin.role !== 'admin') {
            throw new Error("Bạn không đủ quyền");
        }
        return await this.typeModel.create(typeData);
    }

    async deleteType(userID, typeID) {
        const admin = await User.findById(userID);
        if (admin.role !== 'admin') {
            throw new Error("Bạn không đủ quyền");
        }
        return await this.typeModel.findByIdAndDelete(typeID);
    }

    async getAllTypes() {
        return await this.typeModel.find({});
    }
}

module.exports = TypeProxy;