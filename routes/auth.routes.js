const router = require("express").Router()
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const UserModel = require("../models/User.model")
const {isAuthenticated} = require("../middlewares/jwt.middleware")


router.post("/signup", async (req, res) => {
    const salt = bcryptjs.genSaltSync(12);
    const hashedPassword = bcryptjs.hashSync(req.body.password, salt);
    const hashedUser = {
        ...req.body,
        password: hashedPassword,
    };

    UserModel.create(hashedUser)
        .then((newUser) => {
            console.log("User created!! Yay!");
            res.status(201).json({ message: "User created!! Yay!" });
        })
        .catch((error) => {
            console.log("Something went wrong", error);
            res.status(500).json(error);
        });
})


router.post("/login", async (req, res) => {
    try {
        const foundUser = await UserModel.findOne({email: req.body.email})
        console.log(foundUser)
        if(!foundUser) {
            res.status(400).json({error: "User does not exist"})
        } else {
            const frontendPassword = req.body.password
            const passwordHashedInDB = foundUser.password
            const passwordMatch = bcryptjs.compareSync(
                frontendPassword,
                passwordHashedInDB
            )

            if(!passwordMatch) {
                res.status(400).json({error: "Password does not match"})
            } else {
                const data = {_id: foundUser._id, username: foundUser.username}
                const authToken = jwt.sign(data, process.env.TOKEN_SECRET, {
                    //check the implementation of algorithm     algorithm: "H2S56",
                    expiresIn: "12h"
                })
                res.status(200).json({message: "successfully logged in", authToken})
            }
        }
    }
    catch(error){
        res.status(500).json(error)
    }
})


router.get("/profile/:userId", (req, res) => {
    UserModel.findById(req.params.userId)
    .then(currentUser => {
        const userCopy = currentUser 
        userCopy.password = null 

        res.status(200).json(userCopy)
    })
    .catch( error => {
        res.status(500).json(error)
    })
})

router.get("/verify", isAuthenticated,  async (req, res) => {
console.log("here in the verify route")
res.status(200).json({message: "token is valid", payload: req.payload})
})
   


module.exports = router 