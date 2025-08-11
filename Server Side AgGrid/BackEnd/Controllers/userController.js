const users = require("../Models/usersSchema.js");

const getUsers = async (req, res) => {
  try {
    const start = parseInt(req.query.startRow || "0");
    const end = parseInt(req.query.endRow || "50");
    const sortField = req.query.sortField;
    const sortOrder = req.query.sortOrder;
    const filterModel = JSON.parse(req.query.filterModel || "{}");

    function applyFilters(filterModel) {
      let query = {};
      if (filterModel.age) {
        const filter = filterModel.age;
        if (filter.type === "greaterThan") {
          query.age = { $gt: Number(filter.filter) };
        }
      }
      if (filterModel.name) {
        const filter = filterModel.name;
        if (filter.type === "startsWith") {
          query.name = { $regex: "^" + filter.filter, $options: "i" };
        }
        if(filter.type === "equals"){
          query.name = filter.filter
        }
      }
      return query;
    }

    const query = applyFilters(filterModel);
    const totalCount = await users.countDocuments(query);

    let dbQuery = users.find(query);

    if (sortField && sortOrder) {
      dbQuery = dbQuery.sort({ [sortField]: sortOrder === "asc" ? 1 : -1 });
    }

    const filteredData = await dbQuery.skip(start).limit(end - start);

    if (!filteredData.length) {
      return res.status(404).json({
        success: false,
        message: "Data Not Found..",
      });
    }

    res.status(200).json({
      success: true,
      message: "Data got Successfully...",
      data: filteredData,
      totalCount,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// const getUsers = async (req, res) => {
//   try {
//     const start = parseInt(req.query.startRow || "0");
//     const end = parseInt(req.query.endRow || "50");
//     const sortField = req.query.sortField;
//     const sortOrder = req.query.sortOrder;
//     const filterModel = JSON.parse(req.query.filterModel || "{}");
//     const groupKeys = JSON.parse(req.query.groupKeys || "[]");
//     const rowGroupCols = JSON.parse(req.query.rowGroupCols || "[]");

//     // Helper: Apply AG Grid-style filtering
//     function applyFilters(filterModel) {
//       let query = {};
//       if (filterModel.age) {
//         const filter = filterModel.age;
//         if (filter.type === "greaterThan") {
//           query.age = { $gt: Number(filter.filter) };
//         }
//       }
//       if (filterModel.name) {
//         const filter = filterModel.name;
//         if (filter.type === "startsWith") {
//           query.name = { $regex: "^" + filter.filter, $options: "i" };
//         } else if (filter.type === "equals") {
//           query.name = filter.filter;
//         }
//       }
//       return query;
//     }

//     // Construct MongoDB query
//     const query = applyFilters(filterModel);

//     // Add group keys to query to filter deeper levels
//     for (let i = 0; i < groupKeys.length; i++) {
//       const colId = rowGroupCols[i].field;
//       query[colId] = groupKeys[i];
//     }

//     const currentGroupLevel = groupKeys.length;
//     const isGrouping = rowGroupCols.length > currentGroupLevel;

//     // If still in grouping level
//     if (isGrouping) {
//       const groupCol = rowGroupCols[currentGroupLevel].field;
//       const groups = await users.distinct(groupCol, query);
//       const groupedRows = groups.map((key) => ({ group: true, key }));
//       return res.status(200).json({
//         success: true,
//         message:"User Data Got Successfully..",
//         data: groupedRows,
//         totalCount: groups.length,
//       });
//     }

//     // Final level: return leaf data
//     let dbQuery = users.find(query);
//     if (sortField && sortOrder) {
//       dbQuery = dbQuery.sort({ [sortField]: sortOrder === "asc" ? 1 : -1 });
//     }

//     const filteredData = await dbQuery.skip(start).limit(end - start);
//     const totalCount = await users.countDocuments(query);

//     res.status(200).json({
//       success: true,
//       message: "User Data Got Successfully..",
//       data: filteredData,
//       totalCount,
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };


const addUsers = async(req,res)=>{
    try {
        const {name,email,id,age} = req?.body;
        if(!name||!email||!age||!id){
            return res.status(400).json({
                success: false,
                message: "Please fill all fields..",
            });
        }
        const findUser = await users.findOne({id});
        if(findUser){
            return res.status(400).json({
                success:false,
                message:"User already exist..",
            })
        }
        const addUserData = await users.insertOne({name,email,id,age});
        res.status(200).json({
            success:true,
            message:"User Data Added Successfully..",
            data:addUserData
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message||"Something went wrong.."
        })
    }
}

const updateUsers = async (req, res) => {
    try {
        const {name,email,id,age}=req?.body;
        if(!id){
            return res.status(400).json({
                success:false,
                message:"id is missing.."
            })
        }
        const findUser = await users.findOne({id});
        if(!findUser){
            return res.status(400).json({
                success:false,
                message:"User Not Found with this id.."
            })
        }
        const updateUserData = await users.updateOne({id},{$set:{id,name,email,age}});
        res.status(200).json({
            success:true,
            message:"User Updated Successfully..",
            data:updateUserData
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error?.message||"Something went wrong.."
        })
    }
}

const deleteUsers = async (req, res) => {
    try {
        const {id} = req?.body;
        if(!id){
            return res.status(400).json({
                success:false,
                message:"id is missing.."
            })
        }
        const findUser = await users.findOne({id});
        if(!findUser){
            return res.status(400).json({
                success:false,
                message:"User Not Found.."
            })
        }
        const deleteUserData = await users.deleteOne({id});
        res.status(200).json({
            success:true,
            message:"User Deleted Successfully..",
            data:deleteUserData
        })
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error?.message||"Something went wrong.."
        })
    }
}

module.exports = {addUsers,getUsers,deleteUsers,updateUsers};