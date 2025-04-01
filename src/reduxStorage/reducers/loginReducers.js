const INITIAL_STATE = {
    phone: "",
    password: "",
    confirmPassword: "",
    referral: "",
    name: "",
    loginType: 0,
    userOtp: "",
    formStep: 0,
  };
  
  const loginReducers = (state = INITIAL_STATE, action) => {
    // console.log("State Reducers", action);
    switch (action.type) {
      case "PHONE":
        return {
          ...state,
          phone: action.payload,
        };
      case "PASSWORD":
        return {
          ...state,
          password: action.payload,
        };
      case "CONFIRMPASSWORD":
        return {
          ...state,
          confirmPassword: action.payload,
        };
  
      case "REFERRAL":
        return {
          ...state,
          referral: action.payload,
        };
      case "NAME":
        return {
          ...state,
          name: action.payload,
        };
      case "LOGINTYPE":
        return {
          ...state,
          loginType: action.payload,
        };
      case "USEROTP":
        return {
          ...state,
          userOtp: action.payload,
        };
      case "FORMSTEP":
        return {
          ...state,
          formStep: action.payload,
        };
  
      default:
        return state;
    }
  };
  export default loginReducers;
  