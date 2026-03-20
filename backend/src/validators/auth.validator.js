import {body,validationResult} from "express-validator"





export const validate=(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next()
}

export const registervaliator=[
    body("username")
    .notEmpty().withMessage("username is required")
    .isString().withMessage("username must be a string")
    .isLength({min:3,max:20}).withMessage("username must be between 3 and 20 characters"),
    body("email")
    .notEmpty().withMessage("email is required")
    .isEmail().withMessage("invalid email format"),
    body("password")
    .notEmpty().withMessage("password is required")
    .isLength({min:6,max:20}).withMessage("password must be between 6 and 20 characters")
    .custom((value) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumber = /\d/.test(value);
        const hasSpecialChar = /[^a-zA-Z0-9]/.test(value);
        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            throw new Error("password must contain at least one uppercase, one lowercase, one number, and one special character");
        }
        return true;
}),
    body("fullname")
    .notEmpty().withMessage("fullname is required")
    .isString().withMessage("fullname must be a string")
    .isLength({min:3,max:20}).withMessage("fullname must be between 3 and 20 characters"),

    validate,
]

export const loginvalidator=[
    body("email")
    .notEmpty().withMessage("email is required")
    .isEmail().withMessage("invalid email format"),
    body("password")
    .notEmpty().withMessage("password is required")
    .isLength({min:6,max:20}).withMessage("password must be between 6 and 20 characters"),
    validate,
]