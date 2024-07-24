import { errorhandleCallback } from "../../../helper/errorhandling";

/**
  * @swagger
  * /v1/user/register:
  *  post:
  *     tags:
  *     - USER API
  *     summary:
  *         Registeration API 
  *     description:
  *         This API checks the email address that user entered.If user already loged in it throws respose like Email / Phone Number already Exist
  *         if it's not exist API saves the user data and returns otp
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               emailId:
  *                 type: string
  *                 example: sample@gmail.com
  *               mobileNumber:
  *                 type: string
  *                 example: +9197655653534
  *     responses:
  *      200:
  *        description: Success
  *      404:
  *        description: Not Found
  *      422:
  *        description : Validation Error
  *      401:
  *        description : un Autherized
  *      500:
  *        description: Server Error
  */
export const register = errorhandleCallback(async (req, res)=>{
    //code
})