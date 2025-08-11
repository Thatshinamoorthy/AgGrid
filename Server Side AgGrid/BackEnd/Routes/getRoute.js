const express = require('express');
const { getUsers, addUsers, updateUsers, deleteUsers } = require('../Controllers/userController');
const router = express.Router();

router.get("/users",getUsers);
router.post("/add-user",addUsers);
router.put("/update-user",updateUsers);
router.delete("/del-user",deleteUsers);

module.exports = router;