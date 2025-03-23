const TypeProxy = require('../proxies/TypeProxy');
const NXBProxy = require('../proxies/NXBProxy');

const typeProxy = new TypeProxy();
const nxbProxy = new NXBProxy();

exports.createType = async (req, res) => {
    try {
        const { userID } = req.user;
        const result = await typeProxy.createType(userID, req.body);
        res.json({
            status: "success",
            result
        });
    } catch (err) {
        res.json({
            status: "failed",
            message: err.message
        });
    }
};

exports.getAllType = async (req, res) => {
    try {
        const types = await typeProxy.getAllTypes();
        res.json({
            status: "success",
            types
        });
    } catch (err) {
        res.json({
            status: "failed",
            message: err.message
        });
    }
};

exports.deleteType = async (req, res) => {
    try {
        const { id } = req.params;
        const { userID } = req.user;
        const result = await typeProxy.deleteType(userID, id);
        res.json({
            status: "success",
            result
        });
    } catch (err) {
        res.json({
            status: "failed",
            message: err.message
        });
    }
};

exports.createNXB = async (req, res) => {
    try {
        const { userID } = req.user;
        const result = await nxbProxy.createNXB(userID, req.body);
        res.json({
            status: "success",
            result
        });
    } catch (err) {
        res.json({
            status: "failed",
            message: err.message
        });
    }
};

exports.getAllNXB = async (req, res) => {
    try {
        const nxb = await nxbProxy.getAllNXBs();
        res.json({
            status: "success",
            nxb
        });
    } catch (err) {
        res.json({
            status: "failed",
            message: err.message
        });
    }
};

exports.deleteNXB = async (req, res) => {
    try {
        const { id } = req.params;
        const { userID } = req.user;
        const result = await nxbProxy.deleteNXB(userID, id);
        res.json({
            status: "success",
            result
        });
    } catch (err) {
        res.json({
            status: "failed",
            message: err.message
        });
    }
};