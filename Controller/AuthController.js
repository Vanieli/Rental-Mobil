import jwt from "jsonwebtoken";
import argon2 from "argon2";
import User from "../Modul/UserModel.js";

export const login = async (req, res) => {
    const { tier1, tier2 } = req.body;

    const response = await User.findOne({
        where: {
            email_user: tier1,
        },
    });
    if (!response)
        return res
            .status(404)
            .json({ msg: "Data user tidak dapat ditemukan!" });

    const bool = await argon2.verify(response.password, tier2);
    if (!bool)
        return res.status(400).json({ msg: "Password tersebut tidak sesuai!" });

    req.session.userId = response.uuid;

    const id = response.id;
    const uuid = response.uuid;
    const role = response.role;

    console.log("--- __ ---", id, uuid, role);

    const accessToken = jwt.sign(
        { id, uuid, role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id, uuid, role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    try {
        await User.update(
            {
                token: refreshToken,
            },
            {
                where: {
                    uuid: uuid,
                },
            }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(201).json({ uuid, role, accessToken });
    } catch (err) {
        res.status(500).json({ error: err });
    }
};

export const checkLog = async (req, res) => {
    if (!req.session.userId)
        return res.status(404).json({ error: "Silahkan Login lebih dulu!" });

    const response = await User.findOne({
        attributes: ["uuid", "nm_user", "role", "token"],
        where: {
            uuid: req.session.userId,
        },
    });

    if (!response)
        return res
            .status(404)
            .json({ msg: "Data user tidak dapat ditemukan!" });

    res.status(200).json(response);
};

export const logout = async (req, res) => {
    if (!req.session.userId)
        return res.status(404).json({ msg: "Silahkan Login lebih dulu!" });
    if (!req.cookies.refreshToken)
        return res.status(404).json({ msg: "Token tidak ada!" });

    const response = await User.findOne({
        where: {
            uuid: req.session.userId,
            token: req.cookies.refreshToken,
        },
    });
    if (!response)
        return res
            .status(404)
            .json({ msg: "Data user tidak dapat ditemukan!" });

    try {
        await User.update(
            { token: null },
            {
                where: {
                    token: req.cookies.refreshToken,
                },
            }
        );

        await req.session.destroy((err) => {
            if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
            res.status(200).json({ msg: "Anda berhasil logout" });
        });
    } catch (err) {
        return res.status(500).json({ error: err });
    }
};


export const refreshToken = async (req, res) => {
    if (!req.session.userId)
        return res.status(404).json({ msg: "Silahkan Login lebih dulu!" });
    if (!req.cookies.refreshToken)
        return res.status(404).json({ msg: "Coockie tidak dikenali, harap login ulang!" });

    const response = await User.findOne({
        where: {
            token: req.cookies.refreshToken,
        }
    });
    if (!response)
        return res
            .status(404)
            .json({ msg: "Data user tidak dapat ditemukan!", });

    try {
        jwt.verify(
            req.cookies.refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) return res.status(403).json({ msg: "Token telah kadaluarsa"})
    
                const id = response.id;
                const uuid = response.uuid;
                const role = response.role;
            
                const accessToken = jwt.sign(
                    {id, uuid, role},
                    process.env.ACCESS_TOKEN_SECRET,
                    {expiresIn: '15m'}
                );
    
                res.json({accessToken});
            }
        )
    } catch (err) {
        if(err) return res.status(500).json({ error: err });
    }
}