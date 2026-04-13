import LoginForm from "../../../components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-slate-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header with decorative border */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 px-6 py-8 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white opacity-50"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white opacity-50"></div>

            <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
              Avyakta
            </h1>
            <p className="text-amber-50 text-sm font-medium">
              The Living Traditions
            </p>
            <div className="mt-4 flex justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-white opacity-70"></div>
              <div className="w-2 h-2 rounded-full bg-white opacity-100"></div>
              <div className="w-2 h-2 rounded-full bg-white opacity-70"></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome Back
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Join our community of creativity and tradition
            </p>

            <LoginForm />
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-slate-50 to-amber-50 px-8 py-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>

        {/* Decorative bottom text */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-xs">
            Where our stories meet and our joy multiplies
          </p>
        </div>
      </div>
    </div>
  );
}
