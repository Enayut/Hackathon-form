'use client';

import { useState, ChangeEvent, FormEvent } from 'react';

type TeammateData = {
  name: string;
  uid: string;
  branch: string;
  diet: string;
  tShirt: boolean;
};

type FormData = {
  leaderName: string;
  leaderUID: string;
  leaderBranch: string;
  leaderDiet: string;
  teamName: string;
  leaderTShirt: boolean;
  teammates: TeammateData[];
  paymentProof: boolean;
};

export default function Home() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const [formData, setFormData] = useState<FormData>({
    leaderName: '',
    leaderUID: '',
    leaderBranch: '',
    leaderDiet: 'Veg',
    teamName: '',
    leaderTShirt: false,
    teammates: [
      { name: '', uid: '', branch: '', diet: 'Veg', tShirt: false },
      { name: '', uid: '', branch: '', diet: 'Veg', tShirt: false },
      { name: '', uid: '', branch: '', diet: 'Veg', tShirt: false },
    ],
    paymentProof: false,
  });

  // Form validation
  const validateStep = (currentStep: number): boolean => {
    switch (currentStep) {
      case 1:
        return (
          formData.leaderName.trim() !== '' &&
          formData.leaderUID.trim() !== '' &&
          formData.leaderBranch.trim() !== '' &&
          formData.teamName.trim() !== ''
        );
      case 2:
        return formData.teammates[0].name.trim() !== '' && 
               formData.teammates[0].uid.trim() !== '' && 
               formData.teammates[0].branch.trim() !== '';
      case 3:
        return formData.teammates[1].name.trim() !== '' && 
               formData.teammates[1].uid.trim() !== '' && 
               formData.teammates[1].branch.trim() !== '';
      case 4:
        return formData.teammates[2].name.trim() !== '' && 
               formData.teammates[2].uid.trim() !== '' && 
               formData.teammates[2].branch.trim() !== '';
      default:
        return true;
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    // Handle nested teammate fields
    if (name.startsWith('teammate')) {
      const [, index, field] = name.split('-');
      const teammateIndex = parseInt(index, 10);
      
      setFormData(prev => {
        const updatedTeammates = [...prev.teammates];
        if (field === 'tShirt') {
          updatedTeammates[teammateIndex] = {
            ...updatedTeammates[teammateIndex],
            tShirt: checked as boolean,
          };
        } else {
          updatedTeammates[teammateIndex] = {
            ...updatedTeammates[teammateIndex],
            [field]: value,
          };
        }
        return { ...prev, teammates: updatedTeammates };
      });
    } else {
      // Handle leader fields
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      alert('Please fill in all required fields before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format data as URL parameters to avoid CORS issues
      const params = new URLSearchParams();
      
      // Add all form fields as URL parameters
      // Leader info as individual parameters
      params.append('leaderName', formData.leaderName);
      params.append('leaderUID', formData.leaderUID);
      params.append('leaderBranch', formData.leaderBranch);
      params.append('leaderDiet', formData.leaderDiet);
      params.append('teamName', formData.teamName);
      params.append('leaderTShirt', formData.leaderTShirt ? 'true' : 'false');
      
      // Teammates info as a JSON string
      params.append('teammates', JSON.stringify(formData.teammates));
      
      params.append('paymentProof', formData.paymentProof ? 'true' : 'false');
      
      // Create the URL with the query parameters
      const url = `${process.env.SERVER_URL}?${params.toString()}`;
      console.log({url});
      const response = await fetch(url, {
        method: 'GET', // Using GET with query parameters
        mode: 'no-cors'// This is important for Google Apps Script
      });
      
      // Since we're using no-cors, we can't read the response
      // We'll assume success if there's no error thrown
      if(response.ok){
        console.log("Hurrayy!!!");
      }
      setSubmissionStatus({ 
        success: true, 
        message: 'Registration submitted successfully. Thank you!' 
      });
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionStatus({ 
        success: false, 
        message: 'An error occurred during submission. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Team Leader Information</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Team Name *</label>
                <input
                  type="text"
                  name="teamName"
                  value={formData.teamName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium">Leader Name *</label>
                <input
                  type="text"
                  name="leaderName"
                  value={formData.leaderName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium">Leader UID *</label>
                <input
                  type="text"
                  name="leaderUID"
                  value={formData.leaderUID}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium">Branch *</label>
                <input
                  type="text"
                  name="leaderBranch"
                  value={formData.leaderBranch}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium">Diet Preference</label>
                <select
                  name="leaderDiet"
                  value={formData.leaderDiet}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                >
                  <option value="Veg">Vegetarian</option>
                  <option value="Non-Veg">Non-Vegetarian</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="leaderTShirt"
                  checked={formData.leaderTShirt}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  T-Shirt Required?
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Next
              </button>
            </div>
          </div>
        );
        
      case 2:
      case 3:
      case 4:
        const teammateIndex = step - 2;
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Teammate {teammateIndex + 1} Information</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Name *</label>
                <input
                  type="text"
                  name={`teammate-${teammateIndex}-name`}
                  value={formData.teammates[teammateIndex].name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium">UID *</label>
                <input
                  type="text"
                  name={`teammate-${teammateIndex}-uid`}
                  value={formData.teammates[teammateIndex].uid}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium">Branch *</label>
                <input
                  type="text"
                  name={`teammate-${teammateIndex}-branch`}
                  value={formData.teammates[teammateIndex].branch}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium">Diet Preference</label>
                <select
                  name={`teammate-${teammateIndex}-diet`}
                  value={formData.teammates[teammateIndex].diet}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
                >
                  <option value="Veg">Vegetarian</option>
                  <option value="Non-Veg">Non-Vegetarian</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name={`teammate-${teammateIndex}-tShirt`}
                  checked={formData.teammates[teammateIndex].tShirt}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  T-Shirt Required?
                </label>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Previous
              </button>
              {step < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Next
                </button>
              ) : null}
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Payment Information</h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="paymentProof"
                  checked={formData.paymentProof}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  I confirm that I have made the payment
                </label>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-md">
                <p className="text-sm text-yellow-700">
                  Please make the payment to UPI ID: <strong>csi.hackathon@okicici</strong> and keep the screenshot ready.
                </p>
                <p className="text-sm text-yellow-700 mt-2">
                  <strong>Registration Fee Details:</strong><br />
                  • Team Registration: ₹400<br />
                  • T-Shirt (Optional): ₹250 per person
                </p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevStep}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Previous
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={isSubmitting || !formData.paymentProof}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (submissionStatus.success) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Registration Successful!</h2>
            <p className="mt-2 text-gray-600">{submissionStatus.message}</p>
            <p className="mt-4 text-sm text-gray-500">
              An email confirmation will be sent shortly. If you don not receive it within 24 hours, please contact us.
            </p>
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register Another Team
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  } else if (submissionStatus.message) {
    // Show error message if there's an error
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Registration Failed</h2>
            <p className="mt-2 text-gray-600">{submissionStatus.message}</p>
            <div className="mt-6">
              <button
                onClick={() => setSubmissionStatus({})}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Team Registration</h1>
          <p className="text-gray-600">Complete the form to register your team</p>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={`flex-1 border-t-4 ${
                  i <= step ? 'border-blue-500' : 'border-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Leader</span>
            <span>Member 1</span>
            <span>Member 2</span>
            <span>Member 3</span>
            <span>Payment</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          {renderStep()}
        </form>
      </div>
    </main>
  );
}
