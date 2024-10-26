import { useState, useEffect,React } from "react";
import "./login.css";
import { VStack } from "@chakra-ui/layout";

import axios from "axios";
function App() {
  const initialValues = {name: "", password: "",mobile:"",moodleid:"" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    
    
    const {data}= await axios.post("http://localhost:500/api/signup",formValues
  )
console.log(data);};

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  }, [formErrors]);
  const validate = (values) => {
    const errors = {};
   
    
    const mobileregex = new RegExp(/(0|91)?[6-9][0-9]{9}/);
    // const moodleidregEx = /([0-9]{8})/;
    const usernameregex= /^[A-Za-z][A-Za-z0-9_]{7,29}$/;

    if (!values.name) {
      errors.name = "Username is required!";
    }else if (!usernameregex.test(values.name)) {
      errors.name= 
      "This is not a valid username!";
    }
    
    if (!values.mobile) {
      errors.mobile = "mobile is required!";
    } else if (!mobileregex.test(values.mobile)) {
      errors.mobile= "This is not a valid mobile Number!";
    }
    if (!values.moodleid) {
      errors.moodleid = "moodleid is required!";
    } 
    
    
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 4) {
      errors.password = "Password must be more than 4 characters";
    } else if (values.password.length > 10) {
      errors.password = "Password cannot exceed more than 10 characters";
    }
    return errors;
  };

  return (
    <VStack spacing="5px">
      {Object.keys(formErrors).length === 0 && isSubmit ? (
        <div className="ui message success">Signed in successfully</div>
      ) : (
        <pre>{JSON.stringify(formValues, undefined, 2)}</pre>
      )}

      <form onSubmit={handleSubmit}>
        <h1>Signup Form</h1>
        <div className="ui divider"></div>
        <div className="ui form">
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              name="name"
              placeholder="name"
              value={formValues.name}
              onChange={handleChange}
            />
          </div>
          <p>{formErrors.name}</p>
          <div className="field">
            <label>Mobile</label>
            <input
              type="text"
              name="mobile"
              placeholder="mobile"
              value={formValues.mobile}
              onChange={handleChange}
            />
          </div>
          <p>{formErrors.mobile}</p>
          <div className="field">
            <label>Moodleid</label>
            <input
              type="moodleid"
              name="moodleid"
              placeholder="moodleid"
              value={formValues.moodleid}
              onChange={handleChange}
            />
          </div>
           <p>{formErrors.moodleid}</p>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formValues.password}
              onChange={handleChange}
            />
          </div>
          <p>{formErrors.password}</p>
          <button className="fluid ui button blue">Submit</button>
        </div>
       
      </form>
    </VStack>
  );
}

export default App;