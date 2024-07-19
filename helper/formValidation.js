/* config file */
import config from '../config/config'
import { isEmpty } from './common'

export const formValidation = async (data) => {
    try {
        let error = {}
        if (isEmpty(data.Email)) {
            error.Email = "Email is required"
        } if (!(config.EMAIL.test(data.Email))) {
            error.Email = "Invalid email format"
        } if (isEmpty(data.ConfirmPassword)) {
            error.ConfirmPassword = "Password is required"
        }  if (isEmpty(data.FirstName)) {
            error.FirstName = "FirstName is required"
        } if (isEmpty(data.LastName)) {
            error.LastName = "LastName is required"
        } if (isEmpty(data?.phone)){
            error.phone = "Phone Number is required"
        } if (!isEmpty(data?.phone) && config.MOBILENO.test(data?.phone)){
            error.phone = "Phone Number invalid format"
        } 
        return Object.keys(error)?.length > 0 ? { status: false, msg: "form validation failed" , success : "error" , data : error } : { status: true, msg: "form validation succedd" , success : "success" , data : error }
    } catch (e) {
        console.log("formValidation_err", e);
    }
}