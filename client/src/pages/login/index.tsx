import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { LoginUserPayload } from "../../models/user";
import { loginUser } from "../../apiCalls/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSlice";
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState<LoginUserPayload>({
    email: '',
    password: ''
  });

  const onFormSubmit = async (event:  React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
          dispatch(showLoader());
          const response = await loginUser(user);
          toast.success(response.message);
          dispatch(hideLoader())
          if(response.success)
          {
            localStorage.setItem("token", response.token);
            navigate('/', {replace: true});
          }
        } catch (error: any) {
            dispatch(hideLoader())
          toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
        }
  }

  return (
    <div className="page">
      <div className="container-back-image"></div>
      <div className="container-back-color"></div>
      <div className="card">
        <div className="card-title card-title-login">
          <h1>Login Here</h1>
        </div>
        <div className="form">
          <form action="" onSubmit= {onFormSubmit}>
            <input className="forum-input" type="email" placeholder="Email" value={user.email} onChange = {(e) => setUser({...user, email: e.target.value})}/>
            <input className="forum-input" type="password" placeholder="Password" value={user.password} onChange = {(e) => setUser({...user, password: e.target.value})}/>
            <button className="button">Login</button>
          </form>
        </div>
        <div className="card-bottom">
          <span>
            Don't have an account yet?
            <Link to='/signup'>Signup Here</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
export default Login;
