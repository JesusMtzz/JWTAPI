const User = [
    {
        field: "name",
        required: true,
        regex: /\b[A-Za-z]{1,40}\b/
    },
    {
        field: "lastNameP",
        required: true,
        regex: /\b[A-Za-z]{1,40}\b/
    },
    {
        field: "lastNameM",
        required: false,
        regex: /\b[A-Za-z]{1,40}\b/
    },
    {
        field: "phoneNumber",
        required: true,
        regex: /\d{2}[-/]\d{4}[-/]\d{4}/
    },
    {
        field: "email",
        required: false,
        regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    {
        field: "username",
        required: true,
        regex: /^[a-zA-Z0-9]{4,10}$/
    },
    {
        field: "password",
        required: true,
        regex: /^.{0,20}$/
    }
]

const validator = (object) => {
    User.map((el) => {
        if (el.required && !object[el.field]) { throw new Error(`elemento ${el.field} requerido`) }

        if (object[el.field])
            if (!el.regex.test(object[el.field])) {
                throw new Error(`elemento ${el.field} no cumple requisitos o formato`)
            }

    })
};

module.exports = validator;