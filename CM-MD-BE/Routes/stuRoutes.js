const express = require('express');
const { GetStuData,addStuData,deleteStuData,updateStuData } = require('../Controller/StudentsController');
const router = express.Router();

router.get("/get-students",GetStuData);
router.post("/add-student",addStuData);
router.put("/update-student",updateStuData);
router.delete("/delete-student",deleteStuData);

module.exports = router;