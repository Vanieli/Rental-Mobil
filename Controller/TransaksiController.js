import Transaksi from "../Modul/TransaksiModel.js";
import User from "../Modul/UserModel.js";

// (C) __ Create
export const createTrans = async (req, res) => {
    const { tier1, tier2, tier3 } = req.body;
    if (!tier1 || !tier3 || !tier3) {
        return res.status(402).json({
            message: "Data yang dibutuhkan tidak lengkap",
        });
    } 

    const uss = await User.findOne({
        where: {
            uuid: req.session.userId,
        }
    });

    const price = parseInt(tier2)*parseInt(tier3)*0.0013888888888889;

    try {
        await Transaksi.create({
            tagihan: price,
            user_id: uss.id,
            durasi: tier1,
            jarak: tier2,
            date: tier3,
        });

        res.status(201).json({ msg: "Data berhasil ditambahkan" });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};

// (R) __ Read
export const getTrans = async (req, res) => {
    try {
        const response = await Transaksi.findAll({
            attributes: ["id", "user_id", "tagihan", "durasi","jarak", "date"],
        });
        if (!response[0]) {
            res.status(404).json({ msg: "Data kosong!" });
        } else {
            res.status(201).json(response);
        }
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};

export const getTransById = async (req, res) => {
    try {
        const response = await Transaksi.findOne({
            attributes: ["id", "user_id", "tagihan", "durasi", "jarak", "date"],
            where: {
                id: req.params.id,
            },
        });
        if (!response)
            return res.status(404).json({ msg: "Data tidak ditemukan!" });

        res.status(201).json(response);
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};

// (U) __ Update
export const updateTrans = async (req, res) => {
    const { tier1, tier2, tier3, tier4 } = req.body;
    // if (!tier1 || !tier3 || !tier4) {
    //     return res.status(402).json({
    //         message: "Data yang dibutuhkan tidak lengkap",
    //     });
    // }

    const price = parseInt(tier2)*parseInt(tier3)*0.0013888888888889;
    
    try {
        await Transaksi.update({
            tagihan: price,
            durasi: tier1,
            jarak: tier2,
            date: tier3,
        }, {
            where: {
                id: req.params.id
            }
        });
        res.status(201).json({ msg: "Data berhasil diubah" });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};


// (U) __ Delete
export const deleteTrans = async (req, res) => {
    const response = await Transaksi.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!response)
        return res.status(404).json({ msg: "Data mobil tidak ditemukan" });

    try {
        await Transaksi.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(201).json({ msg: "Data berhasil dihapus" });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};