import Joi from "joi";

const CertificationValidation = Joi.object({
  certificate: Joi.string(),
  // image: Joi.string().uri().optional().allow(null),
  employeeId: Joi.string().required(), // @unique biasanya dicek di DB
  qualification: Joi.string().required(),
  subQualification: Joi.string().required(),
  certificateNo: Joi.string().optional().allow(null),
  registrationNo: Joi.string().optional().allow(null),
  level: Joi.number().integer().optional().allow(null),
  issueDate: Joi.date().required(),
  expireDate: Joi.date().greater(Joi.ref("issueDate")).required(),
  status: Joi.string().valid("TERPAKAI", "BELUM").required(),
  company: Joi.string().optional().allow(null),
  documentLink: Joi.string().uri().optional().allow(null),
  account: Joi.string().optional().allow(null),
  password: Joi.string().optional().allow(null),
  sbu: Joi.string().optional().allow(null),
});

export default CertificationValidation;