import * as jwt from "jsonwebtoken"


/* Config file */
import config from '../config/config'

/* Common functions */
import { Decryptdata, isEmpty } from "./common";

/**
 * 
 * @param { value, lifeTime, key }  
 * @param { this function is used for generate Token } res 
 */
export const UseToken = async (value, key) => {

    try {
        const token = jwt.sign(
            value,
            key,
            {
                algorithm: "HS256",
                expiresIn: config.ACCESS_TOKEN_LIFE,
            }
        );
        return token;
    } catch (err) {
        console.log("token_err", err)
    }
}


/**
 * 
 * @param { token, key }  
 * @param { this function is used to Check ValidateToken  } res 
 */
export const UseValidateToken = async (token, key) => {

    try {
        const decoded = jwt.verify(token, key);
        return decoded
    } catch (err) {
        console.error("UseValidateToken", err)
        return null
    }


}

/**
 * 
 * @param { jwtToken }  jwtToken
 * @param { this function is used for AuthendicateRequest }  
 * @usage  All Api checkout authentication
 */
export const AuthendicateRequest = async (jwtToken) => {
    try {

        if (isEmpty(jwtToken) && jwtToken.includes("Bearer ")) {
            return { status: false, msg: "Authentication Token Required or Invalid" }
        }

        jwtToken = jwtToken.replace("Bearer ", "")
        const validate = await UseValidateToken(jwtToken, config.SECRET_KEY);

        if (!validate) {
            return { status: false, msg: "please authenticate" }
        }

    } catch (err) {
        return { status: false, msg: err.toString() }
    }
}

/**
 * 
 * @param { jwt Auth token} jwtToken 
 * @function { this function used for get Secret key from  JWT Token}
 * @returns {sec_key}
 */

export const getSecretkeyFromJWT = async (jwtToken) => {
    let sec_key="";
    if (isEmpty(jwtToken)) {
        return { status: false, success: "error", msg: "Authentication token required" ,data : sec_key }
    }
    else {
        /* JWT VERIFY AND GET SEC_KEY */
        let verify = AuthendicateRequest(jwtToken)

        /* Get a secret Key from JWT  */
        if (!verify?.status) return { status: false, success: "error", msg: verify?.msg, data: {}}
        return { status: true, success: "success", msg: "JWT verified and Get secret Key", data: verify?.data }

    }

}