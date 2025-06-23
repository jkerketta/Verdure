import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const CheckEmailPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Check Your Email</h1>
          <p className="text-gray-600 mt-2 mb-6">
            We've sent a confirmation link to your email address. Please click the link to activate your account.
          </p>
          <p className="text-sm text-gray-500">
            Once confirmed, you can log in.
          </p>
          <div className="mt-6">
            <Link 
              to="/login" 
              className="text-green-600 hover:text-green-500 font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckEmailPage; 