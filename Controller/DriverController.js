import Driver from "../Modul/DriverModel.js";
import User from "../Modul/UserModel.js";


// (C) __ Create
export const createDriver = async (req, res) => {
    // user_id, name, mobil_id, status_kerja
    const { tier1, tier2, tier3 } = req.body;
    if (!tier1 || !tier2 || !tier3 ) {
        return res.status(402).json({
            message: "Data yang dibutuhkan tidak lengkap",
        });
    } 

    const validate = await User.findOne({
        where: {
            uuid: tier1
        }
    });
    if (!validate) return res.status(404).json({ msg: "UUID tidak ditemukan" });



    try {
        await Driver.create({
            user_uuid: tier1,
            name: validate.nm_user,
            mobil_id: tier2,
            status_kerja: tier3,
        });

        res.status(201).json({ msg: "Data berhasil ditambahkan" });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};

// (R) __ Read
export const getDriver = async (req, res) => {
    try {
        const response = await Driver.findAll({
            attributes: ["id", "user_uuid", "name", "mobil_id", "status_kerja"],
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

export const getDriverById = async (req, res) => {
    try {
        const response = await Driver.findOne({
            attributes: ["id", "user_uuid", "name", "mobil_id", "status_kerja"],
            where: {
                user_uuid: req.params.id,
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
export const updateDriver = async (req, res) => {
    // user_id, name, mobil_id, status_kerja
    const { tier1, tier2, tier3 } = req.body;
    if (!tier1 || !tier2 || !tier3 ) {
        return res.status(402).json({
            message: "Data yang dibutuhkan tidak lengkap",
        });
    } 

    const validate = await User.findOne({
        where: {
            uuid: tier1
        }
    });
    if (!validate) return res.status(404).json({ msg: "UUID tidak ditemukan" });
    
    try {
        await Driver.update({
            user_uuid: tier1,
            name: validate.nm_user,
            mobil_id: tier2,
            status_kerja: tier3,
        }, {
            where: {
                user_uuid: req.params.id
            }
        });
        res.status(201).json({ msg: "Data berhasil diubah" });
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

// (D) __ Delete
export const deleteDriver = async (req, res) => {
    const response = await Driver.findOne({
        where: {
            user_uuid: req.params.id,
        },
    });
    if (!response)
        return res.status(404).json({ msg: "Data driver tidak ditemukan" });

    try {
        await Driver.destroy({
            where: {
                user_uuid: req.params.id,
            },
        });

        res.status(201).json({ msg: "Data berhasil dihapus" });
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};