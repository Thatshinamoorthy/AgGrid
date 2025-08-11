import axios from 'axios';

const getStudentsData = async ()=>{
    try {
        const res = await axios.get("http://localhost:5000/student/get-students");
        const {data} = res;
        if(!data?.data) return {error:"Data not Found..!"}
        return {data:data?.data,message:data?.message}
    } catch (error) {
        return {error:error?.response?.data?.message}
    }
}

const addStudentsData = async (stuData)=>{
    try {
        const res = await axios.post("http://localhost:5000/student/add-student",stuData)
        const {data}=res;
        if(!data) return {error:"Somthing went wrong..!"};
        return {message:data?.message}
    } catch (error) {
        return {error:error?.response?.data?.message}
    }
}

const updateStudentData = async (stuData)=>{
    try {
        const res = await axios.put("http://localhost:5000/student/update-student",stuData);
        const {data} = res;
        if(!data) return {error:"Somthing went wrong..!"};
        return {message:data?.message}
    } catch (error) {
        return {error:error?.response?.data?.message}
    }
}

const deleteStudentData = async (stuID)=>{
    try {
        const res = await axios.delete("http://localhost:5000/student/delete-student",{data:{student_id:stuID}});
        const {data} = res;
        if(!data) return {error:"Somthing went wrong..!"};
        return {message:data?.message}
    } catch (error) {
        return {error:error?.response?.data?.message};
    }
}
export {getStudentsData,addStudentsData,deleteStudentData,updateStudentData};