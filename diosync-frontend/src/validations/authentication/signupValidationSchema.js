import * as Yup from 'yup';

export const signupValidationSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  user_type: Yup.string().required('User type is required'),
  agreeToTerms: Yup.bool()
    .oneOf([true], 'You must agree to the terms and conditions')
    .required('Agreement to terms is required'),
});
