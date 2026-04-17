import LoginForm from "../../../components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="login-container">
      {/* Background Pattern */}
      <div className="login-background">
        <div className="login-blob login-blob-1"></div>
        <div className="login-blob login-blob-2"></div>
        <div className="login-blob login-blob-3"></div>
      </div>

      {/* Main Container */}
      <div className="login-main">
        <div className="login-card">
          {/* Header with decorative border */}
          <div className="login-header">
            {/* Decorative elements */}
            <div className="login-corner-tl"></div>
            <div className="login-corner-br"></div>

            <h1>Avyakta</h1>
            <p>The Living Traditions</p>
            <div className="login-dots">
              <div className="login-dot"></div>
              <div className="login-dot"></div>
              <div className="login-dot"></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="login-content">
            <h2>Welcome Back</h2>
            <p>Join our community of creativity and tradition</p>

            <LoginForm />
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p>
              By signing in, you agree to our <a href="#">Terms of Service</a>{" "}
              and <a href="#">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
