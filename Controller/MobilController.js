import Mobil from "../Modul/MobilModel.js";

// (C) __ Create
export const createMobil = async (req, res) => {
    const { tier1, tier2, tier3, tier4 } = req.body;
    if (!tier1 || !tier2 || !tier3 || !tier4) {
        return res.status(402).json({
            message: "Data yang dibutuhkan tidak lengkap",
        });
    } 

    const validate = await Mobil.findOne({
        where: {
            nomor: tier2
        }
    });
    if (validate) {
        return res.status(402).json({
            message: "Nomor plat telah terpakai!",
        });
    }



    try {
        await Mobil.create({
            jenis: tier1,
            nomor: tier2,
            warna: tier3,
            bangku: tier4,
        });

        res.status(201).json({ msg: "Data berhasil ditambahkan" });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};

// (R) __ Read
export const getMobil = async (req, res) => {
    try {
        const response = await Mobil.findAll({
            attributes: ["id", "jenis", "nomor", "warna", "bangku"],
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

export const getMobilById = async (req, res) => {
    try {
        const response = await Mobil.findOne({
            attributes: ["id", "jenis", "nomor", "warna", "bangku"],
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
export const updateMobil = async (req, res) => {
    const { tier1, tier2, tier3, tier4 } = req.body;
    if (!tier1 || !tier2 || !tier3 || !tier4) {
        return res.status(402).json({
            message: "Data yang dibutuhkan tidak lengkap",
        });
    }
    
    try {
        await Mobil.update({
            jenis: tier1,
            nomor: tier2,
            warna: tier3,
            bangku: tier4,
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

// (D) __ Delete
export const deleteMobil = async (req, res) => {
    const response = await Mobil.findOne({
        where: {
            id: req.params.id,
        },
    });
    if (!response)
        return res.status(404).json({ msg: "Data mobil tidak ditemukan" });

    try {
        await Mobil.destroy({
            where: {
                id: req.params.id,
            },
        });

        res.status(201).json({ msg: "Data berhasil dihapus" });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};
