import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Building2, CreditCard, CalendarClock, Activity, Link2, Check } from 'lucide-react';

interface SchoolData {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  created_at: string;
}

interface SubscriptionData {
  id: string;
  school_id: string;
  status: string;
  amount: number;
  current_period_end: string;
}

export function SuperAdminPortal() {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const baseUrl = window.location.origin;

  const copyJoinLink = (schoolId: string) => {
    const link = `${baseUrl}/join?school=${schoolId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(schoolId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [schoolsRes, subsRes] = await Promise.all([
          supabase.from('schools').select('*').order('created_at', { ascending: false }),
          supabase.from('subscriptions').select('*')
        ]);
        
        if (schoolsRes.error) throw schoolsRes.error;
        if (subsRes.error) throw subsRes.error;

        setSchools(schoolsRes.data || []);
        setSubscriptions(subsRes.data || []);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant">Loading portal data...</div>;
  }

  const activeSubs = subscriptions.filter(s => s.status === 'active').length;
  const totalRevenue = subscriptions.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="flex-1 p-8 bg-surface-container-low overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-3xl font-bold text-primary mb-8">Super Admin Portal</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface p-6 rounded-2xl shadow-sm border border-surface-container-high">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-primary-container text-on-primary-container rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-on-surface-variant">Total Schools</div>
                <div className="text-2xl font-bold text-on-surface">{schools.length}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface p-6 rounded-2xl shadow-sm border border-surface-container-high">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-green-100 text-green-700 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-on-surface-variant">Active Subscriptions</div>
                <div className="text-2xl font-bold text-on-surface">{activeSubs}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface p-6 rounded-2xl shadow-sm border border-surface-container-high">
            <div className="flex items-center gap-4 mb-2">
              <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-on-surface-variant">Total Revenue</div>
                <div className="text-2xl font-bold text-on-surface">₦{totalRevenue.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl shadow-sm border border-surface-container-high overflow-hidden">
          <div className="p-6 border-b border-surface-container-high">
            <h2 className="text-xl font-bold text-on-surface">Registered Schools</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-surface-container-high">
                  <th className="py-4 px-6 text-xs font-semibold text-outline uppercase tracking-wider">School Details</th>
                  <th className="py-4 px-6 text-xs font-semibold text-outline uppercase tracking-wider">State</th>
                  <th className="py-4 px-6 text-xs font-semibold text-outline uppercase tracking-wider">Subscription</th>
                  <th className="py-4 px-6 text-xs font-semibold text-outline uppercase tracking-wider">Expires</th>
                  <th className="py-4 px-6 text-xs font-semibold text-outline uppercase tracking-wider">Student Join Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high">
                {schools.map(school => {
                  const sub = subscriptions.find(s => s.school_id === school.id);
                  const isActive = sub?.status === 'active';
                  
                  return (
                    <tr key={school.id} className="hover:bg-surface-container-lowest transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-medium text-on-surface">{school.name}</div>
                        <div className="text-sm text-on-surface-variant">{school.email}</div>
                        <div className="text-xs text-outline">{school.phone}</div>
                      </td>
                      <td className="py-4 px-6 text-sm text-on-surface-variant">
                        {school.state}
                      </td>
                      <td className="py-4 px-6">
                        {sub ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {isActive ? 'Active' : sub.status} (₦{sub.amount.toLocaleString()})
                          </span>
                        ) : (
                          <span className="text-sm text-outline">No Subscription</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm text-on-surface-variant">
                        {sub?.current_period_end ? (
                          <div className="flex items-center gap-2">
                            <CalendarClock className="w-4 h-4 text-outline" />
                            {new Date(sub.current_period_end).toLocaleDateString()}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => copyJoinLink(school.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            copiedId === school.id
                              ? 'bg-green-100 text-green-700'
                              : 'bg-primary/10 text-primary hover:bg-primary/20'
                          }`}
                        >
                          {copiedId === school.id ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                          {copiedId === school.id ? 'Copied!' : 'Copy Join Link'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {schools.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-on-surface-variant">
                      No schools registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
