
import morgan from 'morgan'
import { Decryptdata,Encryptdata } from '../helper/common';
import logger from './logger';
import { AuthendicateRequest } from '../helper/tokenvalidation';

export const setResponseBody = (req, res, next) => {
    const oldWrite = res.send,
        oldEnd = res.end,
        chunks = [];
    res.send = function (chunk) {
        chunks.push(Buffer.from(chunk));
        oldWrite.apply(res, arguments);
    };
    res.end = function (chunk) {
        if (chunk) {
            chunks.push(Buffer.from(chunk));
        }
        const body = Buffer.concat(chunks).toString('utf8');
        res.__custombody__ = body;
        oldEnd.apply(res, arguments);
    };
    next();
};


morgan.token('request-data', function (req, res) { return JSON.stringify({[req?.body ? 'body' : req.qery ? 'query' : 'params']:req?.body??req?.query??req?.params},null,2) });
morgan.token('response-data', function (req, res,next) { 
    let jwtToken = req.headers.authorization
    let verify = AuthendicateRequest(jwtToken)
    let sec_key = Decryptdata(verify?.sec_key, config.SECRET_KEY)
    return JSON.stringify(Decryptdata(res?.['__custombody__'],sec_key),null,2)
});


const morganfile = morgan("user-agent: :user-agent -- remote-addr: :remote-addr --remote-user :remote-user [:date[web]]  -- status: :status -- res[content-length]: :res[content-length] -- response-time ms: :response-time ms -- methodName: :method -- url: :url -- request-data: :request-data -- response-data: :response-data",
{
  stream: {
    // Configure Morgan to use our custom logger with the http severity
    write: (message) => logger.http(message.trim()),
  },
}
)

export default morganfile;