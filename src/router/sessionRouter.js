
import { Router } from "express";
import { userModel } from "../models/user.js";


const sessionRouter = Router()

sessionRouter.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await userModel.findOne({ email: email }).lean()
        console.log(user)
        if (user && password == user.password) {
            req.session.email = email
            //res.status(200).send("Usuario logueado correctamente")
            if (user.rol == "Admin") {
                req.session.admin = true
                res.status(200).send("Usuario Admin logueado correctamente")
            } else {
                res.status(200).send("Usuario logueado correctamente")
            }
        } else {
            res.status(401).send("Usuario o contraseña no validos")
        }
    } catch (e) {
        res.status(500).send("Error al loguear usuario", e)
    }

})

sessionRouter.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password, age, rol } = req.body
        const findUser = await userModel.findOne({ email: email })
        if (findUser) {
            res.status(400).send("Ya existe un usuario con este mail")
        } else {
            await userModel.create({ first_name, last_name, email, age, password, rol })
            res.status(200).send("Usuario creado correctamente")
        }

    } catch (e) {
        res.status(500).send("Error al registrar users: ", e)
    }
})


sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.status(200).redirect("/")
    })
})

export default sessionRouter