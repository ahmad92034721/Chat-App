import { useState } from "react";
import { Link } from "react-router-dom";
import { signupUser } from "../../apiCalls/auth";
import type { RegisterUserPayload } from "../../models/user";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { hideLoader, showLoader } from "../../redux/loaderSlice";

function SignUp() {
  const dispatch = useDispatch();
  const [user, setUser] = useState<RegisterUserPayload>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const onFormSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      dispatch(showLoader());
      const response = await signupUser(user);
      dispatch(hideLoader());
      toast.success(response.message);
    } catch (error: any) {
      dispatch(hideLoader());
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );
    }
  };
  return (
    <div className="page">
      <div className="container-back-img"></div>
      <div className="container-back-color"></div>
      <div className="card">
        <div className="card-title">
          <h1>Create Account</h1>
        </div>
        <div className="form">
          <form action="" onSubmit={onFormSubmit}>
            <div className="user-name">
              <input
                className="forum-input"
                type="text"
                placeholder="First Name"
                value={user.firstName}
                onChange={(e) =>
                  setUser({ ...user, firstName: e.target.value })
                }
                required
              />
              <input
                className="forum-input"
                type="text"
                placeholder="Last Name"
                value={user.lastName}
                onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                required
              />
            </div>
            <input
              className="forum-input"
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            />
            <input
              className="forum-input"
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            />
            <button className="button">Sign Up</button>
          </form>
        </div>
        <div className="card-bottom">
          <span>
            Already have an account?
            <Link to="/login">Login Here</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
export default SignUp;
