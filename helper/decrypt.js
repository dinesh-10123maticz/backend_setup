
/* JWT VERIFY FUNC */
import { getSecretkeyFromJWT } from "./tokenvalidation";
/* Config file */
import config from '../config/config'
/* Common Functions */
import { Decryptdata, Encryptdata, getResData } from "./common";

/**
 * 
 * @param {reqest Data} req 
 * @param {response instance} res 
 * @param {next instance} next 
 * @returns will go next function
 */

export const DecryptRequest = async (req, res, next) => {
    try {
        let sec_key;
        let tokenData;
        /* Except JWT verify Routes */
        const allowurl = ['/register', '/login'];

        if (allowurl.includes(req.url)) {
            sec_key = config.SECRET_KEY;
        }
        else {
            /* Get a secret Key from JWT  */
            tokenData = await getSecretkeyFromJWT(req.headers.authorization)
            if (tokenData?.status) {
                sec_key = tokenData?.data;
            }
            else {
                return res.sendStatus(401).json(tokenData)
            }
        }


        /* GET METHOD */
        if (req.query?.data) {
            req.query = { sec_key, walletAddress: tokenData?.data?.walletAddress, _id: tokenData?.data?._id, ...Decryptdata(req.query.data, sec_key) };
            return next()
        }


        /* POST METHOD */
        let data = { sec_key, walletAddress: tokenData?.data?.walletAddress, _id: tokenData?.data?._id }
        if (req.body.data && Object.keys(req.body).length <= 1) {
            req.body = Decryptdata(req?.body?.data, sec_key);
        } else if (!isEmpty(req?.body)) {
            await Promise.all(Object.keys(req?.body).map(async (val) => {
                data[val] = Decryptdata(req?.body[val], sec_key)
            }))
            req.body = data
        }
        return next()
    } catch (err) {
        console.log('DecryptRequest_err-->', err)
        return res.status(500).send(Encryptdata(getResData(false, "error", "Auth failed", {}), config.sec_key))
    }
}