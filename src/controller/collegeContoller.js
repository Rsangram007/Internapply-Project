const collegeModel = require("../models/CollegeModel");
const internsModel = require("../models/internsModel");


const regname = /^[a-zA-Z]+([_-]?[a-zA-Z])*$/
const regfname = /^[a-zA-Z,'.\s]{0,150}$/

let urlreg = /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i

const createCollege = async (req, res) => {
  try {
    let data = req.body;

    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide data" })

    const { name, fullName, logoLink ,isDeleted} = data

    if (!name) return res.status(400).send({ status: false, message: "please provide name" })

    if (typeof (name) != "string") return res.status(400).send({ status: false, message: "pls provide name in string type" })
    
    const isValidName = function (value) {
      if (!(value === value.toLowerCase())) {
          return false
      }
      return true
  }

    if (!isValidName(name))
      return res.status(400).send({status: false,msg: "Invalid-CollegeName-Try name with lowerCase abbrivation"});

    
    if (!regname.test(name.trim())) return res.status(400).send({ status: false, message: "plese provide the name without space" })
    let nmdata = await collegeModel.findOne({ name: name })
    if (nmdata) return res.status(400).send({ status: false, message: "this name is already present" })

    if (!fullName) return res.status(400).send({ status: false, message: "please provide fullname" })
    if (typeof (fullName) != "string") return res.status(400).send({ status: false, message: "pls provide fullname in string type" })
    if (!regfname.test(fullName.trim())) return res.status(400).send({ status: false, message: "plese provide fullname, only single space allowed " })

    if (!logoLink) return res.status(400).send({ status: false, message: "please provide logolink" })
    if (typeof (logoLink) != "string") return res.status(400).send({ status: false, message: "pls provide logolink in string type" })
    if (!urlreg.test(logoLink)) return res.status(400).send({ status: false, message: "plese provide logolink in a correct format" })

    if(isDeleted){
      if(typeof(isDeleted) != "boolean") return res.status(400).send({ status: false, message: "pls provide isdeleted in boolean type" })
    }

    const datas = await collegeModel.create(data);
    return res.status(201).send({ status: true, data: datas });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};


//----------------------------⭐GET/collegeDetails⭐----------------------------//

const getCollegeDetails = async (req, res) => {
  try {
    const clgName = req.query;
    let { collegeName } = req.query;

     console.log(collegeName);
    if (!collegeName)return res.status(400).send({ status: false, message: "CollgeName is required" });

    if (Object.keys(clgName).length > 1)
      return res.status(400).send({ status: false, msg: "enter single query" });

    const isValidName = function (value) {
      if (!(value === value.toLowerCase())){
        return false;}  
        return true;
    };

    if (!isValidName(collegeName))
      return res.status(400).send({status: false,msg: "Invalid-CollegeName-Try name with lowerCase abbrivation"});


  const collegename = await collegeModel.findOne({ name: collegeName });

    if (!collegename)return res.status(404).send({ status: false, message: "This College not Found in the Collection"});

    const { name, fullName, logoLink } = collegename;

    const intern = await internsModel.find({ collegeId: collegename._id })
      .select({ name: 1, email: 1, mobile: 1 });

    const data = {
      name: name,
      fullName: fullName,
      logoLink: logoLink,
      interns: intern.length ? intern.length: { msg: "0 application from this collge" }};

    return res.status(200).send({ status: true, data: data })}

  catch (err) {return res.status(500).send({ status: false, message: err.message }); }
};



module.exports = { createCollege, getCollegeDetails };
