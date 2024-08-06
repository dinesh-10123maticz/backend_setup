import CryptoJS, { AES, enc } from "crypto-js";
import bcrypt from 'bcrypt';

/* image and video compression setup */
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
import sharp from "sharp";

/* OTP generator */
import { TOTP } from "totp-generator";

/* twilio for send sms configration */
const client = require('twilio')(Config.TWILIOID, Config.TWILIOPASS);

import { trycatch } from "./errorhandling";


/**
 * 
 * @param {Data which one was Encrypt - (object or String)} data 
 * @param {User's secret_key or common secret_key} sec_key 
 * @usage Function used for Encrypt a data
 * @returns {encData}
 */

export const Encryptdata = (data, sec_key) => {
  try {
    const encJson = CryptoJS.AES.encrypt(JSON.stringify(data), sec_key ?? Config.SECRET_KEY).toString();
    const encData = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(encJson)
    );
    return encData;
  }
  catch (err) {
    console.log('Encrypt err', err);
    return {}
  }
}


/**
 * 
 * @param {Data which one was Encrypt - (object or String)} data 
 * @param {User's secret_key or common secret_key} sec_key
 * @param {key for decrypt single word} key 
 * @returns {}
 */

export const Decryptdata = (data, sec_key, key) => {
  try {
    if (isEmpty(data)) {
      return data
    }
    if (key) {
      return CryptoJS.AES.decrypt(data, sec_key ?? Config.SECRET_KEY).toString(CryptoJS.enc.Utf8)
    }
    else {

      let decData = CryptoJS.enc.Base64.parse(data)?.toString(CryptoJS.enc.Utf8);
      let bytes = CryptoJS.AES.decrypt(decData, sec_key ?? Config.SECRET_KEY).toString(CryptoJS.enc.Utf8);

      return JSON.parse(bytes)
    }
  }
  catch (e) {
    return data
  }
}

/**
 * 
 * @param {type  - phone or email } type 
 * @param {data - phone number or email} data 
 * @returns 
 */

export const sendOtp = async(type, data)=> {
  let retData = {};
  let random = await otpgenerate();
  const newotp = random;

  let html = "<p>Your OTP is {{otp}}</p>";
  html = html.replace("{{otp}}", newotp);
  let resp;
  if (type === "phone") {
    resp = SendOtptomobile(data);
  } else {
    resp = await SendMail(data, html, "Verification OTP");
  }

  let fid = type == "phone" ? { phone: data } : { email: data };
  const updatepwd = await FindOneAndUpdate({
    Db: Users,
    findData: fid,
    UpdateData: { otp: newotp, registered: true },
  });

  let status = resp ? true : false;

  return status;
}

/**
 * 
 * @param {email for send OTP} Email 
 * @param {which content was send} html 
 * @param {subject of email} subject 
 * @returns 
 */
export const SendMail = async (Email, html, subject) => {
   
  const smtp = await nodemailer.createTransport(
      Config.keyEnvBased.emailGateway.nodemailer
  );

  const message = {
      to: Email,
      from: Config.keyEnvBased.emailGateway.fromMail,
      subject: subject,
      html: html,
  }
  console.log('message', message)
 let mail= await smtp.sendMail(message)
 console.log("mail",mail);
 if(mail.response.includes('250') && !isEmpty(mail.messageId)){
  return true
 }
 else{
   return false
 }
}

/**
 * 
 * @param {mobile number for send OTP} mobile 
 * @returns 
 */
export const SendOtptomobile = async (mobile) => {
  return await client.verify.v2
      .services(Config.TWILLO_VERIFY_SID)
      .verifications.create({ to: mobile, channel: "sms" });
}

/**
 * 
 * @param {mobile number of sended otp} mobile 
 * @param {sended OTP} otp 
 * @returns 
 */

export const verifyOTP  = async (mobile,otp) => {
  try{
      console.log(mobile , otp , Config.TWILLO_VERIFY_SID)
      const verificationCheck = await client.verify.v2.services(Config.TWILLO_VERIFY_SID)
      .verificationChecks
      .create({to: mobile, code: otp})
      console.log("Verification check successful:", verificationCheck);
      return verificationCheck
  }catch(error){

      if (error.status === 404 && error.code === 20404) {
          console.error("Twilio Verify service not found or verification check endpoint not found.");
      } else {
          console.error(error)
      }
   
  }
  
}

export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

  export const ImageAdd = trycatch(async (data) => {
    const { path, filename, file } = data;
    let blobData = String(file?.mimetype).includes("image") &&  await axios.get(file, { responseType: 'arraybuffer' }) 
    await CreateDir({ path, from: 'Directory Create' });
    await file?.mv(path + filename);
    await compress_file_upload([{
      filename : filename,
      path : path + filename,
      file : String(file?.mimetype).includes("image") ? {
      data: Buffer.from(blobData, "utf-8"), name: "compressed", mimetype: response.headers["content-type"]
    } : "" ,
    fie_path : path + filename
  }])
    
    return filename;
  });

  export const compress_file_upload = async (compress_file) => {

    if (compress_file) {
      let newSend = await Promise.all(
        compress_file.map(async (item) => {
          const { data, name, mimetype } = item.files;
          // await fs.mkdir(item.path, { recursive: true }, async function () {
          var nftimg = await fs.promises.mkdir(item.path, { recursive: true })
          // var tokenname = await data.files.mv(data.path + data.filename)
          if (String(mimetype).includes("image")) {
            sharp(data, { animated: true })
              .webp({ quality: 80 })
              .toFile(item.path + item.filename)
              .then(() => {
                return true;
              })
              .catch((e) => {
                return false;
              });
            return item.filename;
          }
          if (
            String(mimetype).includes("audio") ||
            String(mimetype).includes("video")
          ) {
            var datvi = await ffmpeg(item.fie_path)
              .setStartTime("00:00:01")
              .setDuration(10)
              .output(item.path + item.filename)
              .on("end", function (err) {
                if (!err) {
                  return true;
                }
              })
              .on("error", function (err) {
                return false;
              })
              .run();
            return item.filename;
          }
          // });
          return item.filename;
  
  
        })
      );
      return newSend.pop();
    }
  };

export const CreateDir = trycatch(async (path) => {
  if (!fs.existsSync(path?.path)) {
    await makeDir(path?.path, { recursive: true });
  }
});

export const Deleteimage = trycatch(async (data) => {
  const { path, filename, file } = data
  if (fs.existsSync(path?.path)) {
    await fs.unlink(path)
    return 'deleted'
  }
})

export const Pwdtohash = trycatch(async (data) => {
  let hash = await bcrypt.hash(data, 5)
  return hash;
})

export const Verifybcrypt = trycatch(async (pwd, hash) => {
  let compare = await bcrypt.compare(pwd, hash)
  return compare;
})

export const otpgenerate = trycatch(async () => {
  const { otp } = TOTP.generate("JBSWY3DPEHPK3PXP", { digits: 6 })
  console.log(otp);
  return otp;
})

export const Jsontoedit = trycatch(async (data) => {
  return JSON.parse(JSON.stringify(data))
})

export const ispassword = (password) => {
  if (!isEmpty(password) && Config.PASSWORD.test(password)) return true
}
export const isemail = (email) => {
  if (!isEmpty(email) && Config.EMAIL.test(email)) return true
}
export const ismobile = (mobileno) => {
  if (!isEmpty(mobileno) && Config.MOBILENO.test(mobileno)) return true
}

export const useridgen = trycatch(async () => {
  let findby_userid;
  var minm = 10000;
  var maxm = 99999;
  let id;
  do {
    id = Math.floor(Math.random() * (maxm - minm + 1)) + minm
    findby_userid = await Findone({ Db: User, findData: { userid: id }, dataalone: true })
  } while (!isEmpty(findby_userid))
  return id
})

export const refcodegen = trycatch(async () => {
  let findby_userid;
  var minm = 10000;
  var maxm = 99999;
  let id;
  do {
    id = Math.floor(Math.random() * (maxm - minm + 1)) + minm
    findby_userid = await Findone({ Db: User, findData: { refcode: id }, dataalone: true })
  } while (!isEmpty(findby_userid))
  return id
})

export const Tofixed = trycatch(
  async (data, fixed) => {
    let num = Number(data).toFixed(isEmpty(fixed) ? 2 : Number(fixed))
    return num
  }
)

export const Toprecition = trycatch(
  async (data, fixed) => {
    let num = Number(data).toPrecision(isEmpty(fixed) ? 2 : Number(fixed))
    return num
  }
)

/**
 * 
 * @param {status - true (or) false} status 
 * @param {success - "success" (or) "error"} success 
 * @param {msg - "Message data that send to the user"} msg 
 * @param {data - data that send to the user} data 
 * @returns 
 */
export const getResData = (status, success, msg, data) => {
  console.log('getResData : retData-->', { status, success, msg, data })
  return { status, success, msg, data }
}

/**
 * 
 * @param {length of key} length 
 * @returns encrypted Key
 */
export const Str_Random = async (length) => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789@#$';

  // Loop to generate characters for the specified length
  for (let i = 0; i < length; i++) {
    const randomInd = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomInd);
  }
  console.log('result-->', result, Encryptdata(result, config.SECRET_KEY))
  return Encryptdata(result, config.SECRET_KEY);
}

/**
 * 
 * @param {error object} err 
 * @param {*} res 
 * @param {*} next 
 */
export const sendResponse = async (err, res, next) => {
  try {
    console.log('Errs on send Response---->', err);
    if (isEmpty(err)) {
      next()
    } else {
      // return true
      res.status(200).json(Encryptdata({ status: false, msg: "fields required", data: err, success: "error" }, config.SECRET_KEY))
    }
  } catch (err) {
    console.log("🚀 ~ sendResponse ~ err:", err)
  }

}

export const ImgEmpty = (data) => {
  try {
    return (
      (typeof (data) == 'object' && !data?.type) ||
      data === undefined ||
      data == "undefined" ||
      data === null ||
      (typeof data === 'string' && data.trim().length === 0) ||
      (typeof data === 'string' && data === '0') ||
      (typeof data === 'number' && data === 0)
    )
  }
  catch (err) {
    console.log('ImgUrl_error', err)
    return false
  }
}

export const makeArr = (data) => {
  try {
    if (isEmpty(data)) return []

    if (data?.length) return data
    else return [data]

  } catch (e) {
    console.log('Error on makeArr---->', e);
    return []
  }
}

export const parseJson = (data) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    console.log('ERRRob=nparses---->',e);
    return data;
  }
}