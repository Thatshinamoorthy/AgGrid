const stuData = require("../Models/StuModel");

const GetStuData = async (req, res) => {
  try {
    const stuDetails = await stuData.find({}).lean();
    if (!stuDetails) {
      return res.status(404).json({
        success: false,
        message: "Data Not Found..!",
        data: null,
      });
    }
    res.status(200).json({
      success: true,
      message: "Student Data Got Successfully..!",
      data: stuDetails,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Somthing went wrong..!",
    });
  }
};

const addStuData = async (req, res) => {
  try {
    const { student_id, name, std, gender, attendance_percentage, club } =
      req.body;
    if (
      !student_id ||
      !name ||
      !std ||
      !gender ||
      !attendance_percentage ||
      !club
    ) {
      return res.status(400).json({
        success: false,
        message: "All Data Required..!",
        data: null,
      });
    }
    const existStu = await stuData.findOne({ student_id: student_id });
    if (existStu) {
      return res.status(400).json({
        success: false,
        message: "Student exist with same Student ID",
        data: null,
      });
    }
    const updateStu = await stuData.create(req.body);
    res.status(200).json({
      success: true,
      message: "Student Data Added Successfully..!",
      data: updateStu,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong..!",
    });
  }
};

const updateStuData = async (req, res) => {
  try {
    const { student_id, name, std, gender, attendance_percentage, club } =
      req.body;
    if (
      !student_id ||
      !name ||
      !std ||
      !gender ||
      !attendance_percentage ||
      !club
    ) {
      return res.status(400).json({
        success: false,
        message: "All Data Required..!",
        data: null,
      });
    }
    const stu = await stuData.findOne({ student_id: student_id });
    if (!stu) {
      return res.status(400).json({
        success: false,
        message: "Student Doesn't Exist..!",
        data: null,
      });
    }
    const updatedStu = await stuData.updateOne(
      { student_id: student_id },
      { $set: req.body }
    );
    res.status(200).json({
      success: true,
      message: "Student Data Updated Successfully..!",
      data: updatedStu,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Something went wrong..!",
      data: null,
    });
  }
};

const deleteStuData = async (req, res) => {
  try {
    const { student_id } = req.body;
    if (!student_id) {
      return res.status(400).json({
        success: false,
        message: "Student ID is missing..!",
        data: null,
      });
    }
    const existStu = await stuData.findOne({ student_id: student_id });
    if (!existStu) {
      return res.status(400).json({
        success: false,
        message: "Student Does not Exist..!",
        data: null,
      });
    }
    const updatedStu = await stuData.deleteOne({ student_id: student_id });
    res.status(200).json({
      success: true,
      message: "Student Detail Deleted Successfully..!",
      data: updatedStu,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "something went wrong..!",
      data: null,
    });
  }
};

module.exports = { GetStuData, addStuData, deleteStuData, updateStuData };
