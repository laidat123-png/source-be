const User = require('../models/user');
const bcrypt = require('bcryptjs');

class UserFactory {
    static async createUser(userData) {
        const newUser = new User(userData);
        newUser.password = await bcrypt.hash(newUser.password, 10);
        return newUser.save();
    }
}

module.exports = UserFactory;