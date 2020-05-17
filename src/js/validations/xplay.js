export default [
    { 
        field: 'description', 
        method: 'isEmpty', 
        validWhen: false, 
        message: 'Please provide a description.'
    },
    { 
        field: 'phone_number', 
        method: 'isEmpty', 
        validWhen: false, 
        message: 'Please enter your phone number.'
    },
    { 
        field: 'email_id', 
        method: 'isEmpty', 
        validWhen: false, 
        message: 'Please enter your email address.' 
    },
    { 
        field: 'email_id',
        method: 'isEmail', 
        validWhen: true, 
        message: 'Please enter a valid email address.'
    }
]