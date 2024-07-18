
/* COMMON Func */
import { Encryptdata } from "./common";
import { getSecretkeyFromJWT } from "./tokenvalidation";


export const errorhandleCallback = (callback) => {
    return async (req, res, next) => {
      try {
        return await callback(req, res, next);
      } catch (error) {
        console.log("errorhandleCallback == "+ error) 
        if(res){
          const {data} = await getSecretkeyFromJWT(req.headers.authorization)
          res.send(Encryptdata({
            error: error,
            status: false,
            data: null,
            msg: `${"From api" + error.toString()}`,
          },data))
        } else{
          return {
            error: error,
            success: false,
            data: null,
            msg: `${"From api" + error.toString()}`,
          }
        }
    
        
        
      }
    };
  };

  export const trycatch = (callback) => {
    return async (data,data2,data3,data4) => {
      try {
        return await callback(data,data2,data3,data4);
      } catch (error) {
        console.log("try_catch_statement",error.message,error?.cause,error.toString())
        return ""
      }
    };
  };