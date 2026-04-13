import LoginForm from "../../../components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="login-container"
      style={{
        background:
          "linear-gradient(135deg, #f0f4f8 0%, #f5f0e8 50%, #f0f4f8 100%)",
        position: "relative",
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full">
        <div className="login-card">
          {/* Header with decorative border */}
          <div className="login-header" style={{ position: "relative" }}>
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white opacity-50"></div>

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
