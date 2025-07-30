'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { phoneSchema, otpSchema, nameSchema } from '@/lib/validations';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setLoading, setOtpSent, setOtpVerified, setError, login } from '@/lib/slices/authSlice';
import { simulateSendOTP, simulateVerifyOTP, fetchCountries, Country } from '@/lib/api';
import { generateId } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { Phone, MessageSquare, ArrowRight, Loader2, ChevronDown } from 'lucide-react';

type PhoneFormData = {
  countryCode: string;
  phone: string;
};

type OtpFormData = {
  otp: string;
};

type NameFormData = {
  name: string;
};

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const { isLoading, otpSent, otpVerified } = useAppSelector((state) => state.auth);
  const [countries, setCountries] = useState<Country[]>([]);
  const [phoneData, setPhoneData] = useState<PhoneFormData | null>(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      countryCode: '+1',
      phone: '',
    },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: '',
    },
  });

  const nameForm = useForm<NameFormData>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: '',
    },
  });

  // Load countries on component mount
  useEffect(() => {
    fetchCountries().then((countriesData) => {
      setCountries(countriesData);
      const defaultCountry = countriesData.find(c => c.dial_code === '+1') || countriesData[0];
      setSelectedCountry(defaultCountry);
    });
  }, []);

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onPhoneSubmit = async (data: PhoneFormData) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const fullPhone = `${data.countryCode}${data.phone}`;
      await simulateSendOTP(fullPhone);
      setPhoneData(data);
      dispatch(setOtpSent(true));
      toast.success('OTP sent successfully!');
    } catch {
      dispatch(setError('Failed to send OTP'));
      toast.error('Failed to send OTP');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onOtpSubmit = async (data: OtpFormData) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const isValid = await simulateVerifyOTP(data.otp);
      if (isValid) {
        dispatch(setOtpVerified(true));
        toast.success('OTP verified successfully!');
      } else {
        dispatch(setError('Invalid OTP'));
        toast.error('Invalid OTP');
      }
    } catch {
      dispatch(setError('Failed to verify OTP'));
      toast.error('Failed to verify OTP');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onNameSubmit = async (data: NameFormData) => {
    if (!phoneData) return;

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const user = {
        id: generateId(),
        phone: `${phoneData.countryCode}${phoneData.phone}`,
        countryCode: phoneData.countryCode,
        name: data.name,
      };

      dispatch(login(user));
      toast.success('Welcome to Gemini Clone!');
    } catch {
      dispatch(setError('Failed to complete registration'));
      toast.error('Failed to complete registration');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const resendOTP = async () => {
    if (!phoneData) return;

    dispatch(setLoading(true));
    try {
      const fullPhone = `${phoneData.countryCode}${phoneData.phone}`;
      await simulateSendOTP(fullPhone);
      toast.success('OTP resent successfully!');
    } catch {
      toast.error('Failed to resend OTP');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    phoneForm.setValue('countryCode', country.dial_code);
    setShowCountryDropdown(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 transition-colors duration-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-2 transition-colors duration-200">
              Welcome to Gemini Clone
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg transition-colors duration-200">
              Your AI conversation companion
            </p>
          </div>

          {!otpSent ? (
            <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 transition-colors duration-200">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="flex">
                    {/* Country Code Dropdown */}
                    <div className="relative flex-shrink-0" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                        className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-l-xl text-slate-900 dark:text-white text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-200 min-w-[100px]"
                      >
                        <span>{selectedCountry?.dial_code || '+1'}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      
                      {showCountryDropdown && (
                        <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl shadow-xl z-10">
                          {countries.map((country) => (
                            <button
                              key={country.code}
                              type="button"
                              onClick={() => handleCountrySelect(country)}
                              className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors duration-200 flex items-center justify-between"
                            >
                              <span className="text-slate-900 dark:text-white">{country.name}</span>
                              <span className="text-slate-500 dark:text-slate-400">{country.dial_code}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Phone Input */}
                    <input
                      type="tel"
                      {...phoneForm.register('phone')}
                      placeholder="Enter phone number"
                      className="flex-1 px-4 py-3 border border-l-0 border-slate-300 dark:border-slate-600 rounded-r-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 dark:placeholder-slate-400 transition-colors duration-200"
                    />
                  </div>
                  {phoneForm.formState.errors.phone && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{phoneForm.formState.errors.phone.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Phone className="w-5 h-5" />
                )}
                <span className="text-lg">{isLoading ? 'Sending OTP...' : 'Send OTP'}</span>
              </button>
            </form>
          ) : !otpVerified ? (
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 transition-colors duration-200">
                  Enter OTP
                </label>
                <input
                  type="text"
                  {...otpForm.register('otp')}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full px-4 py-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-lg text-center font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 dark:placeholder-slate-400 transition-colors duration-200"
                />
                {otpForm.formState.errors.otp && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{otpForm.formState.errors.otp.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MessageSquare className="w-5 h-5" />
                )}
                <span className="text-lg">{isLoading ? 'Verifying...' : 'Verify OTP'}</span>
              </button>

              <button
                type="button"
                onClick={resendOTP}
                disabled={isLoading}
                className="w-full text-blue-600 hover:text-blue-700 disabled:text-slate-400 text-sm font-medium py-3 transition-colors duration-200"
              >
                Resend OTP
              </button>
            </form>
          ) : (
            <form onSubmit={nameForm.handleSubmit(onNameSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 transition-colors duration-200">
                  Your Name
                </label>
                <input
                  type="text"
                  {...nameForm.register('name')}
                  placeholder="Enter your name"
                  className="w-full px-4 py-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-500 dark:placeholder-slate-400 transition-colors duration-200"
                />
                {nameForm.formState.errors.name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{nameForm.formState.errors.name.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ArrowRight className="w-5 h-5" />
                )}
                <span className="text-lg">{isLoading ? 'Setting up...' : 'Get Started'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 