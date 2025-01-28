import { Link, useNavigate, useRouteError } from "react-router-dom";

const Error = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  return (
    <div className="container">
      {error.status == 401 && (
        <div className="d-flex align-items-center justify-content-center vh-100">
          <div className="text-center">
            <h1 className="display-1 fw-bold">401</h1>
            <p className="fs-3">
              <span className="text-danger">Oops!</span>
            </p>
            <p className="lead">You aren't authorized to see this.</p>
            <button
              className="btn"
              style={{ backgroundColor: "#1A2138", color: "white" }}
              onClick={() => {
                navigate(-1);
              }}
            >
              Go back
            </button>
          </div>
        </div>
      )}
      {error.status == 403 && (
        <div className="d-flex align-items-center justify-content-center vh-100">
          <div className="text-center">
            <h1 className="display-1 fw-bold">403</h1>
            <p className="fs-3">
              <span className="text-danger">Oops!</span>
            </p>
            <p className="lead">Forbidden.</p>
            <button
              className="btn"
              style={{ backgroundColor: "#1A2138", color: "white" }}
              onClick={() => {
                navigate(-1);
              }}
            >
              Go back
            </button>
          </div>
        </div>
      )}
      {error.status == 404 && (
        <div className="d-flex align-items-center justify-content-center vh-100">
          <div className="text-center">
            <h1 className="display-1 fw-bold">404</h1>
            <p className="fs-3">
              <span className="text-danger">Oops!</span> Page not found.
            </p>
            <p className="lead">The page you’re looking for doesn’t exist.</p>
            <button
              className="btn"
              style={{ backgroundColor: "#f57c00", color: "white" }}
              onClick={() => {
                navigate(-1);
              }}
            >
              Go back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Error;
