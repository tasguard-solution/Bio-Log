import React, { useState } from 'react';
import { NIGERIAN_STATES } from '../data/states';
import { supabase } from '../lib/supabase';
import { MonnifyPaymentModal } from '../components/MonnifyPaymentModal';
import { CheckCircle2, ShieldCheck, School } from 'lucide-react';

export function SchoolRegistrationScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    stateId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [registeredSchoolId, setRegisteredSchoolId] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedState = NIGERIAN_STATES.find(s => s.id === formData.stateId);
  const monthlyPrice = selectedState ? selectedState.monthlyPrice : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!selectedState) {
      setError('Please select a state');
      setIsSubmitting(false);
      return;
    }

    try {
      let schoolId = null;

      // 1. Insert into Supabase
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          state: selectedState.name,
        }])
        .select()
        .single();

      if (schoolError) {
        // If duplicate email, fetch existing school ID so payment testing can proceed seamlessly
        if (schoolError.code === '23505' || schoolError.message?.includes('unique constraint')) {
          const { data: existingSchool } = await supabase
            .from('schools')
            .select('id')
            .eq('email', formData.email)
            .single();

          if (existingSchool) {
            schoolId = existingSchool.id;
          } else {
            throw schoolError;
          }
        } else {
          throw schoolError;
        }
      } else {
        schoolId = schoolData.id;
      }

      setRegisteredSchoolId(schoolId);
      
      // 2. Trigger Payment Modal
      setShowPayment(true);
    } catch (err: any) {
      console.error('Registration Error:', err);
      setError(err.message || 'Failed to register school.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (response: any) => {
    if (response.status === 'SUCCESS' && registeredSchoolId) {
      try {
        // Calculate next month
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        // Record Subscription in Supabase
        const { error: subError } = await supabase
          .from('subscriptions')
          .insert([{
            school_id: registeredSchoolId,
            status: 'active',
            amount: monthlyPrice,
            current_period_end: nextMonth.toISOString()
          }]);

        if (subError) throw subError;

        setSuccess(true);
      } catch (err) {
        console.error('Error saving subscription:', err);
        setError('Payment was successful, but failed to activate subscription. Please contact support.');
      }
    }
  };

  if (success) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-surface-container-low p-8">
        <div className="bg-surface p-12 rounded-3xl shadow-sm border border-surface-container-high max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-primary mb-4">Welcome Aboard!</h2>
          <p className="text-on-surface-variant mb-8">
            Your school's registration and payment were successful. You now have full access to Bio Log for the next 30 days.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary-container transition-colors w-full"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-surface-container-low overflow-y-auto">
      <div className="max-w-4xl mx-auto py-12 px-6">
        
        <div className="mb-10 text-center">
          <h1 className="font-serif text-4xl font-bold text-primary mb-4">School Registration</h1>
          <p className="text-on-surface-variant text-lg">Join hundreds of schools using our interactive biology platform.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <div className="bg-surface p-8 rounded-2xl shadow-sm border border-surface-container-high">
            <h2 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
              <School className="w-5 h-5 text-primary" />
              School Details
            </h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">School Name</label>
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-surface-container border border-surface-container-highest rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="e.g. King's College"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Official Email</label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-surface-container border border-surface-container-highest rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="admin@school.edu.ng"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Phone Number</label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-surface-container border border-surface-container-highest rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="0800 000 0000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Address</label>
                <input
                  required
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-surface-container border border-surface-container-highest rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="123 Education Way"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">State</label>
                <select
                  required
                  name="stateId"
                  value={formData.stateId}
                  onChange={handleChange}
                  className="w-full bg-surface-container border border-surface-container-highest rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="">Select your State</option>
                  {NIGERIAN_STATES.map(state => (
                    <option key={state.id} value={state.id}>{state.name}</option>
                  ))}
                </select>
                <p className="text-xs text-on-surface-variant mt-1.5">
                  Pricing is automatically adjusted based on economic zones to ensure affordability across Nigeria.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !formData.stateId}
                className="w-full mt-4 px-6 py-3 bg-primary text-on-primary rounded-xl font-medium hover:bg-primary-container disabled:opacity-50 transition-colors shadow-sm"
              >
                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </form>
          </div>

          {/* Right Column: Pricing Summary */}
          <div>
            <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 h-full flex flex-col">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-primary mb-6">Subscription Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span>Unlimited access for all students</span>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span>Full 3D visualization library</span>
                  </div>
                  <div className="flex items-center gap-3 text-on-surface-variant">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span>Teacher administration dashboard</span>
                  </div>
                </div>

                <div className="bg-surface p-6 rounded-xl border border-surface-container-highest">
                  <div className="text-sm text-on-surface-variant mb-1">Monthly Fee</div>
                  {selectedState ? (
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-serif font-bold text-primary">
                        ₦{monthlyPrice.toLocaleString()}
                      </span>
                      <span className="text-on-surface-variant mb-1">/mo</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-medium text-on-surface-variant opacity-50">
                      Select state to view
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-on-surface-variant bg-surface p-3 rounded-lg border border-surface-container">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                Secured by Monnify
              </div>
            </div>
          </div>
        </div>
      </div>

      <MonnifyPaymentModal 
        isOpen={showPayment}
        amount={monthlyPrice}
        customerName={formData.name}
        customerEmail={formData.email}
        paymentDescription={`Monthly Subscription for ${formData.name}`}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
