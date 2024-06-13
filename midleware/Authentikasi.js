import jwt, { decode } from "jsonwebtoken";
import User from "../Modul/UserModel.js"


export const verifyUser = async (req, res, next) => {
    if (!req.session.userId) return res.status(404).json({ msg: "Silahkan Login lebih dulu!" });

    const response = await User.findOne({
        where: {
            uuid: req.session.userId,
        }
    });
    if (!response){
        res.status(404).json({ alert: "Anda tidak dapat mengakses halaman ini!"});
        console.log("Data user tidak ditemukan!");
    }

    const token = req.headers['authorization'];
    if (!token) return res.status(402).json({ error: "Token accsess tidak di temukan"});
    const tokens = token.split(' ')[1];
    console.log("-- Tokenn: ", tokens);
    await jwt.verify(tokens, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ msg: "Token sudah kadaluarsa!"});

        req.userId = response.uuid;
        req.role = response.role;

        next();
    })

    // res.status(201).json({ msg: tokens});
}

export const allowedRole = (...role) =>  {
    return (req, res, next) => {
        const nowRoles = req.role;
        const bool = !role.includes(nowRoles.toLowerCase());
        if (bool) return res.status(403).json({ msg: "Halaman tidak tersedia, anda tidak memiliki akses!"});
    
        console.log("-- is Allowed role? ",bool)
        next();
    }
}