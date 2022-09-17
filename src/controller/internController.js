const collegeModel = require("../models/CollegeModel");
const internsModel = require("../models/internsModel");




const createIntern = async (req, res) => {
    try {
        let data = req.body
        let {name , mobile , email, collegeName} = data
        if (Object.keys(data).length == 0) { return res.status(400).send({ status: false, msg: "please enter intern details in body for creating" }) }

        if (!name) { return res.status(400).send({ status: false, msg: "name is required" }) }
        if (!mobile) { return res.status(400).send({ status: false, msg: "mobile is required" }) }
        if (!email) { return res.status(400).send({ status: false, msg: "email is required" }) }
        if (!collegeName) { return res.status(400).send({ status: false, msg: "collegeName is required" }) }


        let validString = /^[a-zA-Z]+([_ -]?[a-zA-Z])*$/
        if (!validString.test(name)) { return res.status(400).send({ status: false, msg: "name should be In A-Z or a-z " }) }


        let validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (!validEmail.test(email)) {
            return res.status(400).send({ status: false, msg: "please enter email in  correct format  e.g  xyz@abc.com" })
        }
    
        let emailExist = await internsModel.findOne({ email: email })

        if (emailExist) { return res.status(400).send({ status: false, msg: `This ${email} email is already exits pls sign In` }) }


        let validNumber = /^[6-9]{1}[0-9]{9}$/

        if (!validNumber.test(mobile)) { return res.status(400).send({ status: false, msg: " please enter 10 digit IND mobile number 🇮🇳" }) }
        let numberUnique = await internsModel.findOne({ mobile: mobile })
        if (numberUnique) { return res.status(400).send({ status: false, msg: `This ${mobile} number already exist` }) }


        let collegeDetails = await collegeModel.findOne({$or: [{ name: collegeName },{fullName : collegeName}]}).select({ _id: 1 })
        if (!collegeDetails) { return res.status(404).send({ status: false, msg: `No college found with college name ${collegeName}` }) }

        data["collegeId"] = collegeDetails._id

        delete data["collegeName"]

        const intern = await internsModel.create(data)

        res.status(201).send({ status: true, data: intern })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createIntern }