import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Building2, CreditCard, CalendarClock, Activity, Link2, Check, UploadCloud, FileBox, Trash2, Loader2, Lock, Unlock, Play } from 'lucide-react';
import { ORGANISMS } from '../data';

interface SuperAdminPortalProps {
  loginMode: 'free' | 'demo' | 'locked';
  onUpdateLoginMode: (mode: 'free' | 'demo' | 'locked') => void;
}
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

export function SuperAdminPortal({ loginMode, onUpdateLoginMode }: SuperAdminPortalProps) {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Asset upload state
  const [uploading, setUploading] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState(ORGANISMS[0].id);
  const [assetType, setAssetType] = useState<'3d' | '2d' | 'sketchfab'>('3d');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sketchfabInput, setSketchfabInput] = useState('');
  const [uploadError, setUploadError] = useState('');

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
        const [schoolsRes, subsRes, assetsRes] = await Promise.all([
          supabase.from('schools').select('*').order('created_at', { ascending: false }),
          supabase.from('subscriptions').select('*'),
          supabase.from('school_assets').select('*').is('school_id', null).order('created_at', { ascending: false })
        ]);
        
        if (schoolsRes.error) throw schoolsRes.error;
        if (subsRes.error) throw subsRes.error;

        setSchools(schoolsRes.data || []);
        setSubscriptions(subsRes.data || []);
        setAssets(assetsRes.data || []);
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const handleUpload = async () => {
    if (assetType !== 'sketchfab' && !selectedFile) return;
    if (assetType === 'sketchfab' && !sketchfabInput) return;
    
    setUploading(true);
    setUploadError('');

    try {
      if (assetType === 'sketchfab') {
        const match = sketchfabInput.match(/([a-f0-9]{32})/i);
        const uid = match ? match[1] : sketchfabInput;

        const { error: dbError } = await supabase
          .from('school_assets')
          .insert([{
            school_id: null,
            organism_id: selectedOrgId,
            asset_type: '3d', // Bypass DB constraint which may only allow 3d/2d
            file_path: 'sketchfab', // Marker for Sketchfab
            public_url: uid
          }]);

        if (dbError) throw dbError;
        setSketchfabInput('');
      } else {
        const fileExt = selectedFile!.name.split('.').pop();
        const fileName = `global/${selectedOrgId}/${Date.now()}.${fileExt}`;

        // Upload to Storage
      const { error: storageError } = await supabase.storage
        .from('school-assets')
        .upload(fileName, selectedFile);

      if (storageError) throw storageError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('school-assets')
        .getPublicUrl(fileName);

        const { error: dbError } = await supabase
          .from('school_assets')
          .insert([{
            school_id: null,
            organism_id: selectedOrgId,
            asset_type: assetType,
            file_path: fileName,
            public_url: publicUrl
          }]);

        if (dbError) throw dbError;
        setSelectedFile(null);
        (document.getElementById('file-upload') as HTMLInputElement).value = '';
      }

      // Refresh assets
      const { data: assetRows } = await supabase
        .from('school_assets')
        .select('*')
        .is('school_id', null)
        .order('created_at', { ascending: false });
      setAssets(assetRows || []);
      
    } catch (err: any) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Failed to upload asset');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAsset = async (assetId: string, filePath: string) => {
    if (!confirm('Are you sure you want to delete this global asset?')) return;
    
    try {
      if (filePath) {
        await supabase.storage.from('school-assets').remove([filePath]);
      }
      await supabase.from('school_assets').delete().eq('id', assetId);
      
      setAssets(assets.filter(a => a.id !== assetId));
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete asset');
    }
  };

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

        {/* Login Mode Selector */}
        <div className="bg-surface rounded-2xl shadow-sm border border-surface-container-high p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${
                loginMode === 'locked' ? 'bg-red-100 text-red-600' :
                loginMode === 'demo' ? 'bg-amber-100 text-amber-600' :
                'bg-green-100 text-green-600'
              }`}>
                {loginMode === 'locked' ? <Lock className="w-6 h-6" /> :
                 loginMode === 'demo' ? <Play className="w-6 h-6" /> :
                 <Unlock className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">
                  Login Access
                </h3>
                <p className="text-sm text-on-surface-variant">
                  {loginMode === 'locked' && 'Locked — login is disabled'}
                  {loginMode === 'demo' && 'Demo — pre-filled credentials, read-only'}
                  {loginMode === 'free' && 'Free — normal login for everyone'}
                </p>
              </div>
            </div>
            <div className="flex p-1 bg-surface-container-low rounded-xl border border-outline-variant/30">
              {(['free', 'demo', 'locked'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => onUpdateLoginMode(mode)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all capitalize ${
                    loginMode === mode
                      ? mode === 'locked' ? 'bg-red-500 text-white shadow-sm'
                        : mode === 'demo' ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-green-500 text-white shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {mode === 'free' && <Unlock className="w-3.5 h-3.5 inline mr-1.5" />}
                  {mode === 'demo' && <Play className="w-3.5 h-3.5 inline mr-1.5" />}
                  {mode === 'locked' && <Lock className="w-3.5 h-3.5 inline mr-1.5" />}
                  {mode}
                </button>
              ))}
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

        {/* Global Asset Management */}
        <div className="mt-8 bg-surface rounded-2xl shadow-sm border border-surface-container-high p-6">
          <h2 className="text-xl font-bold text-on-surface mb-1">Manage Global 3D & 2D Assets</h2>
          <p className="text-sm text-on-surface-variant mb-6">
            Upload custom .glb 3D models or images that will be available to all schools by default.
          </p>
          
          <div className="space-y-4 mb-8 bg-surface-container-low p-5 rounded-xl border border-surface-container-highest max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Organism</label>
                <select
                  value={selectedOrgId}
                  onChange={e => setSelectedOrgId(e.target.value)}
                  className="w-full bg-surface border border-surface-container-highest rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-primary"
                >
                  {ORGANISMS.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Asset Type</label>
                <select
                  value={assetType}
                  onChange={e => setAssetType(e.target.value as '3d' | '2d' | 'sketchfab')}
                  className="w-full bg-surface border border-surface-container-highest rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:border-primary"
                >
                  <option value="3d">3D Model (.glb)</option>
                  <option value="2d">2D Image (.png, .jpg)</option>
                  <option value="sketchfab">Sketchfab URL</option>
                </select>
              </div>
            </div>

            {assetType === 'sketchfab' ? (
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">Sketchfab URL or ID</label>
                <input
                  type="text"
                  value={sketchfabInput}
                  onChange={e => setSketchfabInput(e.target.value)}
                  placeholder="https://sketchfab.com/3d-models/..."
                  className="w-full bg-surface border border-surface-container-highest rounded-lg py-2 px-3 text-sm"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">File</label>
                <input
                  id="file-upload"
                  type="file"
                  accept={assetType === '3d' ? '.glb' : 'image/png, image/jpeg'}
                  onChange={e => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full bg-surface border border-surface-container-highest rounded-lg py-2 px-3 text-sm"
                />
              </div>
            )}

            {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}

            <button
              onClick={handleUpload}
              disabled={uploading || (assetType === 'sketchfab' ? !sketchfabInput : !selectedFile)}
              className="w-full py-2.5 bg-secondary text-on-secondary rounded-lg font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {uploading ? 'Uploading...' : 'Upload Global Asset'}
            </button>
          </div>

          <h3 className="font-medium text-sm text-on-surface mb-3">Global Assets</h3>
          {assets.length === 0 ? (
            <p className="text-sm text-on-surface-variant italic">No global assets uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {assets.map(asset => {
                const orgName = ORGANISMS.find(o => o.id === asset.organism_id)?.name;
                return (
                  <div key={asset.id} className="flex items-center justify-between p-3 bg-surface-container-lowest border border-surface-container-highest rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileBox className="w-8 h-8 text-secondary/50" />
                      <div>
                        <p className="text-sm font-medium text-on-surface">{orgName}</p>
                        <p className="text-xs text-on-surface-variant uppercase">
                          {asset.file_path === 'sketchfab' ? 'Sketchfab' : asset.asset_type} Asset
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAsset(asset.id, asset.file_path)}
                      className="p-2 text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
