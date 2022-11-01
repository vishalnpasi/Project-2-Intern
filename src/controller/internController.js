const internModel = require('../models/internModel')
const collegeModel = require('../models/collegeModel');

const isValid = function(value) {
    if(typeof (value) == "undefined" || typeof (value) == null) return false
    if(typeof (value) == "string" && (value).trim().length == 0)return false
    return true
}   
const regName = /^[A-Z a-z]+$/
const regforNo = /^[6-9]\d{9}$/

const regforemail =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const createIntern = async function (req, res) {
    try {
        
        res.setHeader("Access-Control-Allow-Origin","*")

        if(Object.keys(req.body).length==0) return res.status(400).send({ status: false, message: "Data Not given" })
        
        const { name, mobile, email, collegeName } = req.body

        if (!isValid(name)) return res.status(400).send({ status: false, message: "name is mandatory" })
        if(!regName.test(name)) return res.status(400).send({ status: false, message: "name is invalid" })

        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is mandatory" })
        if(!regforemail.test(email)) return res.status(400).send({ status: false, message: "email is invalid" })
        
        let foundEmail = await internModel.findOne({email:email})
        if(foundEmail) return res.status(400).send({ status: false, message: "Email is already exist" })

        if (!isValid(mobile) ) return res.status(400).send({ status: false, message: "Mobile is mandatory" })
        if(!regforNo.test(mobile)) return res.status(400).send({ status: false, message: "Mobile is invalid" })

        let foundMobile = await internModel.findOne({mobile:mobile})
        if(foundMobile) return res.status(400).send({ status: false, message: "Mobile Number is already exist" })

        if (!isValid(collegeName)) return res.status(400).send({ status: false, message: "collegeName is mandatory" })

        let collegeDetails = await collegeModel.findOne({ name: collegeName })
        if (!collegeDetails) return res.status(400).send({ status: false, message: "college is not exist" })

        req.body.collegeId = collegeDetails._id

        let savedData = await internModel.create(req.body)

        return res.status(201).send({ status: true, data: savedData })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports = { createIntern }