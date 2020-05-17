// import validator from 'validator';

const passwordMatch = (confirmation, state) => (state.newPassword === confirmation)

export default {

	email_rules : [
		{ 
			field: 'newEmail', 
			method: 'isEmpty', 
			validWhen: false, 
			message: 'Please enter the new email address.' 
		},
		{ 
			field: 'newEmail',
			method: 'isEmail', 
			validWhen: true, 
			message: 'Please enter a valid email address.'
		}
	],

	password_rules : [   
		{ 
			field: 'password', 
			method: 'isEmpty', 
			validWhen: false, 
			message: 'Please enter the current password.'
		},
		{ 
			field: 'newPassword', 
			method: 'isEmpty', 
			validWhen: false, 
			message: 'Please enter the new password.'
		},
		{ 
			field: 'newPassword', 
			method: 'isLength', 
			args: [{min: 8, max: undefined}],
			validWhen: true, 
			message: 'Password should have at least 8 characters'
		},
		{ 
			field: 'confirmPassword', 
			method: 'isEmpty', 
			validWhen: false, 
			message: 'Please confirm the new password.'
		},
		{ 
			field: 'confirmPassword', 
			method: passwordMatch,   // passing a custom function here
			validWhen: true, 
			message: 'Passwords do not match.'
		}
	],
}