import dotenv from 'dotenv';
dotenv.config({path:`./env/.env.${process.env.Node_ENV}`})

const Key = {
    PORT: process.env.PORT,
    MONGOURI: process.env.MONGOURI,
    SITE_URL : process.env.FRONTURL,
    SECRET_KEY: process.env.SECRET_KEY,
    SITE_NAME : process.env.SITE_NAME,
    EMAIL: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    MOBILE: /^[+]{1}(?:[0-9\-\(\)\/\.]\s?){6, 15}[0-9]{1}$/,
    MOBILENO: /^(\+)?[0-9\s-]{6,15}$/,
    PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
    DATE: /^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/,
    USER_PROFILE : './public/userprofile',
    ACCESS_TOKEN_LIFE : process.env.ACCESS_TOKEN_LIFE,
    TWILIOID : process.env.TWILIOID,
    TWILIOPASS : process.env.TWILIOPASS,
    TWILLO_VERIFY_SID : process.env.TWILLO_VERIFY_SID,
}

Key.keyEnvBased = {
    emailGateway: {
        fromMail: process.env.EMAILUSER,
        nodemailer: {
            host: "smtp.zeptomail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAILUSER,
                pass: process.env.EMAILPASS
            }
        }
    }
}

export default Key;