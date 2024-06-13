import User from "../Modul/UserModel.js";
import argon2 from "argon2";
import path from "path";
import fs from "fs";

// (C) __ Create
export const createUser = async (req, res) => {
    // Memastikan data telah terbuat
    const validate = await User.findOne({
        where: {
            email_user: req.body.tier3,
        },
    });
    if (validate) return res.status(401).json({ msg: "Email telah terpakai" });

    if (req.files === null)
        return res.status(400).json({ msg: "No file uploaded" });

    // (1)name || (2)username || (3)email || (4)password || (5)verify password || (6)role
    const { tier1, tier2, tier3, tier4, tier5, tier6 } = req.body;
    if (!tier1 || !tier2 || !tier3 || !tier4 || !tier5 || !tier6) {
        return res.status(422).json({
            message: "Data yang dibutuhkan tidak lengkap",
        });
    }
    const file = req.files.file;

    // Verify Password
    if (tier4 !== tier5)
        return res
            .status(400)
            .json({ msg: "Password tidak cocok, pastikan keduanya sama!" });
    // Encrypt password
    const pw = await argon2.hash(tier4);

    // Filterisasi profil
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;

    // 5MB
    if (fileSize > 5000000)
        return res
            .status(402)
            .json({ msg: "Ukuran file tidak boleh lebih dari 5Mb" });
    // Allowed Type
    const extType = [".jpg", ".png", ".jpeg"];
    if (!extType.includes(ext.toLowerCase()))
        return res.status(400).json({
            msg: "Silahkan pilih gambar dengan ekstensi .png .jpg. jpeg",
        });
    // Move file to ...
    file.mv(`./public/images/users/${fileName}`),
        async (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        };

    // Upload User
    try {
        await User.create({
            nm_user: tier1,
            username: tier2,
            email_user: tier3,
            password: pw,
            img_profil: fileName,
            role: tier6,
        });

        res.status(201).json({ msg: "Data telah ditambahkan!" });
    } catch (error) {
        res.status(400).json(error);
    }
};

// (R) __ Read
export const getUser = async (req, res) => {
    try {
        const response = await User.findAll({
            attributes: [
                "id",
                "uuid",
                "nm_user",
                "username",
                "email_user",
                "password",
                "img_profil",
                "role",
                "token",
            ],
        });

        if (!response[0]) {
            res.status(404).json({ msg: "Data kosong!" });
        } else {
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};

export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            attributes: [
                "id",
                "uuid",
                "nm_user",
                "username",
                "email_user",
                "password",
                "img_profil",
                "role",
                "token",
            ],
            where: {
                uuid: req.params.id,
            },
        });

        if (!response) {
            res.status(404).json({ msg: "Data tidak ditemukan!" });
        } else {
            res.status(200).json(response);
        }
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};

// (U) __ Update
export const updateUser = async (req, res) => {
    const response = await User.findOne({
        where: {
            uuid: req.params.id,
        },
    });
    if (!response)
        return res.status(404).json({ msg: "Data users tidak ditemukan" });

    // Mencari fileName ...
    let fileName = "";
    if (req.files === null) {
        fileName = response.img_profil;
    } else {
        const file = req.files.file;
        const extType = [".jpg", ".png", ".jpeg"];
        const fileSize = file.data.length;
        const ext = path.extname(file.name);

        if (!extType.includes(ext.toLocaleLowerCase()))
            return res.status(400).json({
                msg: "Silahkan pilih gambar dengan ekstensi .png .jpg. jpeg",
            });

        if (fileSize > 5000000)
            return res
                .status(400)
                .json({ msg: "Pilih file dengan ukuran kurang dari 5Mb" });

        fileName = file.md5 + ext;

        // Menghapus file sebelumnya
        const filePath = `./public/images/users/${response.img_profil}`;
        await fs.unlinkSync(filePath);

        file.mv(`./public/images/users/${fileName}`, (err) => {
            if (err) return res.status(500).json(err);
        });
    }

    const { tier1, tier2, tier3, tier4, tier5, tier6 } = req.body;

    if (tier4 !== tier5)
        return res
            .status(400)
            .json({ msg: "Password tidak sesuai, pastikan keduanya sama!" });
    const pw = await argon2.hash(tier4);

    try {
        await User.update(
            {
                nm_user: tier1,
                username: tier2,
                email_user: tier3,
                password: pw,
                img_profil: fileName,
                role: tier6,
            },
            {
                where: {
                    uuid: req.params.id,
                },
            }
        );

        res.status(201).json({ msg: "Data telah diubah!" });
    } catch (error) {
        res.status(400).json({ error: error });
    }
};

// (D) __ Delete
export const deleteUser = async (req, res) => {
    const response = await User.findOne({
        where: {
            uuid: req.params.id,
        },
    });
    if (!response)
        return res.status(404).json({ msg: "Data users tidak ditemukan" });

    // Menghapus file 
    const filePath = `./public/images/users/${response.img_profil}`;
    await fs.unlinkSync(filePath);
    try {
        await User.destroy({
            where: {
                uuid: req.params.id,
            }
        });

        res.status(201).json({ msg: "Data berhasil dihapus"});
    } catch (error) {
        res.status(400).json({ msg: error });
    }
};
