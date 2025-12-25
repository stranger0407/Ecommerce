import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { RegisterRequest } from '@/types';
import { Server, Mail, Lock, User, Phone, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui';

const Register = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterRequest & { confirmPassword: string }>();

  const password = watch('password');

  const onSubmit = async (data: RegisterRequest & { confirmPassword: string }) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      const response = await authService.register(registerData);
      login(response);
      toast.success('Welcome to Mahalaxmi Enterprise!');
      navigate('/');
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.response?.data?.error || 'Registration failed. Please try again.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    'Track orders in real-time',
    'Save multiple shipping addresses',
    'Faster checkout experience',
    'Exclusive member discounts',
    'Priority customer support',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Server className="h-7 w-7 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold">Mahalaxmi</span>
              <span className="text-xl font-light text-primary-400 ml-1">Enterprise</span>
            </div>
          </Link>
          
          <h1 className="text-4xl font-bold mb-6">
            Join India's Largest Enterprise Hardware Community
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Create your account and unlock exclusive benefits for enterprise customers.
          </p>

          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-green-400" />
                </div>
                <span className="text-gray-300">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-800"
                />
              ))}
            </div>
            <p className="text-sm text-gray-400">
              Join <span className="text-white font-semibold">10,000+</span> happy customers
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <Server className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Mahalaxmi</span>
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-2 text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in here
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: { value: 2, message: 'Minimum 2 characters' },
                    })}
                    type="text"
                    className="input-field pl-11"
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: { value: 2, message: 'Minimum 2 characters' },
                  })}
                  type="text"
                  className="input-field"
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  className="input-field pl-11"
                  placeholder="john.doe@company.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-gray-400">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('phone')}
                  type="tel"
                  className="input-field pl-11"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  })}
                  type="password"
                  className="input-field pl-11"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  type="password"
                  className="input-field pl-11"
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="flex items-start pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 mt-0.5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              Create Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
