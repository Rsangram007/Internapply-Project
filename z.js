const collegeDetails = async (req, res) => {
    try {
        let collegeName = req.query.collegeName;
        if (!collegeName) return res.status(400).send({ status: false, message: "Enter College Name" });
        if (validString.test(collegeName)) return res.status(400).send({ status: false, message: "Enter a valid college name" })

        let getCollegeData = await collegeModel.findOne({ name: collegeName, isDeleted: false }).select({ name: 1, fullName: 1, logoLink: 1 });
        if (!getCollegeData) return res.status(404).send({ status: false, message: "College not found! check the name and try again" });

        let data = getCollegeData._doc

        let getInterns = await Interns.find({ collegeId: data._id, isDeleted: false }).select({ name: 1, email: 1, mobile: 1 });
        if (!getInterns) return res.status(404).send({ status: false, message: "No interns available" });

        delete (data._id);
        data.interests = getInterns;

        res.status(200).send({ status: true, message: "All okk", data: data });
    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
