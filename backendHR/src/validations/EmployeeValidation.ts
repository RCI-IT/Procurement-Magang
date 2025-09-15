import Joi from "joi";

const EmployeeValidation = Joi.object({
    employeeNumber: Joi.string().required(),
    image: Joi.string(),
    idCardNumber: Joi.string().min(16).max(16).pattern(/^\d+$/).required(),
    fullName: Joi.string().required(),
    birth: Joi.string().required(),
    birthDate: Joi.date().iso().required(),
    gender: Joi.string().required(),
    religion: Joi.string().alphanum().required(),
    address: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(9).max(13).pattern(/^[+\d]+$/).required(),
    education: Joi.string().required(),
    school: Joi.string().required(),
    major: Joi.string(),
    position: Joi.string().required(),
    salary: Joi.number().required(),
    status: Joi.string(),
    hireDate: Joi.date().iso(),
    leaveDate: Joi.date().iso(),
    resignDate: Joi.date().iso(),
    document: {
        idCard: Joi.string(),
        taxCard: Joi.string().allow(null),
        familyCard: Joi.string(),
        diploma: Joi.string()
    }
})

export default EmployeeValidation