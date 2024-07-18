

import { isEmpty } from './common';

/**
 * 
 * @param { table - table Name, findData - find Data ,Seldata - Selected Data} data 
 * @usage  this function used for Find a specific single data from Data base
 * @returns {status : true or false , data : findData or null , success : success or error}
 */

export const Findone = async (data) => {
    const { table, findData, Seldata } = data;
    try {
        let findonedata = await table.findOne(findData, Seldata ?? {})
        return {
            status: !isEmpty(findonedata) ? true : false,
            data: !isEmpty(findonedata) ? findonedata : null,
            success: !isEmpty(findonedata) ? "success" : "error"
        };
    } catch (e) {
        return { status: false, message: e.toString(), success: "error" };
    }
};

/**
 * 
 * @param { table - table Name, findData - find Data ,Seldata - Selected Data , count - true or false,  sort - sortData , limit - number , skip - number} data 
 * @usage  this function used for Find data from Data base
 * @returns {status : true or false , data : findData or null , success : success or error}
 */

export const Find = async (data) => {
    const { table, findData, SelData, count, sort, limit, skip } = data;
    SelData = SelData ?? SelData;
    try {
        let finddata = {};
        if (count) {
            finddata = await table.find(findData).count();
        }
        else {
            finddata = await table.find(findData, SelData).sort(sort ?? {}).skip(skip ?? 0).limit(limit ?? Number.MAX_SAFE_INTEGER)
        }

        return {
            status: !isEmpty(finddata) ? true : false,
            success: !isEmpty(finddata) ? "success" : 'error',
            data: !isEmpty(finddata) ? finddata : [],
        };
    } catch (e) {
        return { status: false, success: "error", message: e.toString() };
    }
};

/**
 * 
 * @param { table - table Name ,deldata - find data for which one was Deleted} data 
 * @usage  this function used for Delete a specify data from Data base
 * @returns {status : true or false , data : findData or null , success : success or error}
 */

export const FindOneAndDelete = async (data) => {
    try {
        const { table, deldata } = data
        let updatedata = await table.findOneAndDelete(deldata);
        return {
            status: updatedata ? true : false,
            message: updatedata ? "Update Successfully" : "Nothing To Update.. Try Again",
            data: updatedata,
        };
    }
    catch (err) {
        console.log(" FindOneAndDelete err", err);
        return {
            status: false,
            message: "Nothing To Update.. Try Again",
            success: "error"
        };
    }

}

/**
 * 
 * @param { table - table Name ,findData - find Data which one was update, UpdateData - which data was update, push - true or false ,pull - true or false , (push and pull - for array Data update)} data 
 * @usage  this function used for update data in Data base
 * @returns {status : true or false , data : findData or null , success : success or error}
 */

export const UpdateMany = async (data) => {
    const { table, findData, UpdateData, push, pull } = data;
    try {
        let updatedata = await table.updateMany(findData, { ...UpdateData, ...(push ? { $push: push } : {}), ...(pull ? { $pull: pull } : {}) }, { new: true });
        return {
            status: updatedata ? true : false,
            message: updatedata ? "Update Successfully" : "Nothing To Update.. Try Again",
            data: updatedata,
            success: updatedata ? "success" : 'error'
        };
    } catch (e) {
        return { status: false, message: e.toString(), success: "error" };
    }
};

/**
 * 
 * @param { table - table Name ,findData - find Data which one was update, UpdateData - which data was update, push - true or false ,pull - true or false , (push and pull - for array Data update)} data 
 * @usage  this function used for update data in Data base
 * @returns {status : true or false , data : findData or null , success : success or error}
 */

export const FindOneAndUpdate = async (data) => {
    const { table, findData, UpdateData, push, pull } = data;
    // console.log("adminfindupdate",data);

    try {
        // console.log( { ...{$set: UpdateData} ,...(push ? {$push:push} : {}),...(pull ? {$pull:pull} : {})})
        console.log("FindOneAndUpdateFindOneAndUpdate", JSON.stringify(data, null, 2))
        let updatedata = await table.findOneAndUpdate(findData, { ...(UpdateData ? { '$set': UpdateData } : {}), ...(push ? { $push: push } : {}), ...(pull ? { $pull: pull } : {}) }, { new: true });
        console.log("updatedata", updatedata)
        return {
            status: updatedata ? true : false,
            message: updatedata ? "Update Successfully" : "Nothing To Update.. Try Again",
            data: updatedata,
            success: updatedata ? "success" : "error"
        };
    } catch (e) {
        return { success: "error", message: e.message.toString(), status: false };
    }
};

/**
 * 
 * @param { table - table Name ,createData - what data was create} data 
 * @usage  this function used for save data in Data base
 * @returns {status : true or false , data : findData or null , success : success or error}
 */

export const Save = async (data) => {
    const { table, createData } = data;
    try {
        let saveData = new table(createData);
        let record = await saveData.save();
        return {
            status: record ? true : false,
            message: !isEmpty(record) ? "Create Successfully !!!" : null,
            data: !isEmpty(record) ? record : null,
            success: !isEmpty(record) ? "success" : "true"
        };
    } catch (e) {
        console.log('errrorrr', e)
        return { status: false, message: e.toString(), success: "error" };
    }
};

/**
 * 
 * @param { table - table Name ,query - what query data was aggregate} data 
 * @usage  this function used for save data in Data base
 * @returns {status : true or false , data : findData or null , success : success or error}
 */

export const aggregate = async (data) => {
    const { table, query } = data
    try {
        let finddata = await table.aggregate(query)
        return {
            status: !isEmpty(finddata) ? true : false,
            data: !isEmpty(finddata) ? finddata : null,
            success: !isEmpty(finddata) ? "success" : "error"
        };
    } catch (e) {
        console.log("agg_err", e);
        return { status: false, message: e.toString(), success: "error" };
    }
}