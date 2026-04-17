import LoginForm from "../../../components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100 font-sans overflow-hidden">
      {/* Background Pattern - Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-12 w-96 h-96 bg-white rounded-full opacity-20 mix-blend-overlay blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-12 -left-12 w-80 h-80 bg-white rounded-full opacity-20 mix-blend-overlay blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-32 right-20 w-72 h-72 bg-white rounded-full opacity-20 mix-blend-overlay blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md px-6 md:px-4">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="relative px-8 py-12 bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white text-center overflow-hidden">
            {/* Decorative Corners */}
            <div className="absolute top-3 left-3 w-12 h-12 border-t-2 border-l-2 border-white border-opacity-30 rounded-tl"></div>
            <div className="absolute bottom-3 right-3 w-12 h-12 border-b-2 border-r-2 border-white border-opacity-30 rounded-br"></div>

            <h1 className="text-4xl font-bold tracking-wider mb-1">Avyakta</h1>
            <p className="text-sm font-light tracking-wide opacity-95">The Living Traditions</p>
            
            {/* Decorative Dots */}
            <div className="flex justify-center gap-2 mt-4">
              <div className="w-2 h-2 bg-white rounded-full opacity-80 hover:opacity-100 hover:scale-125 transition-all"></div>
              <div className="w-2 h-2 bg-white rounded-full opacity-80 hover:opacity-100 hover:scale-125 transition-all"></div>
              <div className="w-2 h-2 bg-white rounded-full opacity-80 hover:opacity-100 hover:scale-125 transition-all"></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-9">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-sm text-gray-600 mb-6">Join our community of creativity and tradition</p>

            <LoginForm />
          </div>

          {/* Footer */}
          <div className="px-8 py-5 bg-gray-50 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-600 leading-relaxed">
              By signing in, you agree to our{" "}
              <a href="#" className="text-blue-600 font-semibold hover:text-purple-600 transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 font-semibold hover:text-purple-600 transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
