// Simulated API functions for the Gemini Clone app

export interface Country {
  code: string;
  name: string;
  dial_code: string;
}

// Simulate sending OTP
export const simulateSendOTP = async (phone: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate success (in real app, this would call actual API)
  console.log(`OTP sent to ${phone}`);
};

// Simulate verifying OTP
export const simulateVerifyOTP = async (otp: string): Promise<boolean> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate verification (in real app, this would call actual API)
  // For demo purposes, accept any 6-digit code
  return /^\d{6}$/.test(otp);
};

// Simulate AI response
export const simulateAIResponse = async (message: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate AI responses based on message content
  const responses = [
    "That's an interesting question! Let me think about that...",
    "I understand what you're asking. Here's what I can tell you...",
    "Great question! Based on my knowledge, I would say...",
    "I'm here to help! Let me provide you with some information...",
    "That's a fascinating topic. Here's my perspective...",
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return `${randomResponse}\n\nThis is a simulated response. In a real application, this would be an actual AI response based on your message: "${message}"`;
};

// Fetch countries data
export const fetchCountries = async (): Promise<Country[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a list of countries with their dial codes
  return [
    { code: 'US', name: 'United States', dial_code: '+1' },
    { code: 'CA', name: 'Canada', dial_code: '+1' },
    { code: 'GB', name: 'United Kingdom', dial_code: '+44' },
    { code: 'IN', name: 'India', dial_code: '+91' },
    { code: 'AU', name: 'Australia', dial_code: '+61' },
    { code: 'DE', name: 'Germany', dial_code: '+49' },
    { code: 'FR', name: 'France', dial_code: '+33' },
    { code: 'JP', name: 'Japan', dial_code: '+81' },
    { code: 'BR', name: 'Brazil', dial_code: '+55' },
    { code: 'MX', name: 'Mexico', dial_code: '+52' },
    { code: 'IT', name: 'Italy', dial_code: '+39' },
    { code: 'ES', name: 'Spain', dial_code: '+34' },
    { code: 'NL', name: 'Netherlands', dial_code: '+31' },
    { code: 'SE', name: 'Sweden', dial_code: '+46' },
    { code: 'NO', name: 'Norway', dial_code: '+47' },
    { code: 'DK', name: 'Denmark', dial_code: '+45' },
    { code: 'FI', name: 'Finland', dial_code: '+358' },
    { code: 'CH', name: 'Switzerland', dial_code: '+41' },
    { code: 'AT', name: 'Austria', dial_code: '+43' },
    { code: 'BE', name: 'Belgium', dial_code: '+32' },
  ];
}; 