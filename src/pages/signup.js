import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Link } from "react-router-dom";
import axios from "axios";
const registerUrl='https://n1i8b10t8i.execute-api.ap-south-1.amazonaws.com/prod/register'

function SignUp() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordError, setpasswordError] = useState("");
  const [emailError, setemailError] = useState("");
  const [Message, setMessage] = useState("");
  
  const handleValidation = (event) => {
    console.log('Inside Validation:',password, email)
    let formIsValid = true;

    if (!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
      formIsValid = false;
      setemailError("Email Not Valid");
      return false;
    } else {
      setemailError("");
      formIsValid = true;
    }

    if (!password.match(/^[a-zA-Z0-9]{5,22}$/)) {
      formIsValid = false;
      setpasswordError(
        "Only Letters and digits and length must best min 5 Chracters and Max 22 Chracters"
      );
      return false;
    } else {
      setpasswordError("");
      formIsValid = true;
    }

    console.log('Inside Validation:',formIsValid)
    return formIsValid;
  };

  const loginSubmit = (e) => {
    e.preventDefault();
    handleValidation();
    const requestBody={
        email:email,
        password:password
    }
    axios.post(registerUrl,requestBody).then(res=>{
        setMessage('Registration SuccessFul');
    }).catch(error=>{
        console.log('Error:',error);
        if(error.response.status===401)
        setMessage(error.response.data.message)
        else if(error.response.status===403)
        setMessage(error.response.data.message)
        else
        setMessage("Sorry server is not responding... Please try again later")
    })
  };

  return (
    <div className="Auth-form-container">
    <form className="Auth-form" onSubmit={loginSubmit}>
      <div className="Auth-form-content">
        <h3 className="Auth-form-title">Sign Up</h3>
        <div className="form-group mt-3">
          <label>Email address</label>
          <input
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="form-control mt-1"
            placeholder="Enter email"
          />            
          <small id="emailHelp" className="text-danger form-text">
          {emailError}
        </small>
        </div>
        <div className="form-group mt-3">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            className="form-control mt-1"
            placeholder="Enter password"
          />      
          <small id="passworderror" className="text-danger form-text">
          {passwordError}
        </small>
        </div>
        <div className="d-grid gap-2 mt-3">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
        <p className="forgot-password text-right mt-2">
        <Link to="/login">Already have an account?</Link>
        </p>
        <p color="red">{Message}</p>
      </div>
    </form>
  </div>
  );
}
export default SignUp;