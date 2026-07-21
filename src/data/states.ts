export interface NigerianState {
  id: string;
  name: string;
  tier: 'High' | 'Medium' | 'Low';
  monthlyPrice: number;
}

// Sample categorization and pricing based on general economic tiers
export const NIGERIAN_STATES: NigerianState[] = [
  { id: 'FC', name: 'Federal Capital Territory', tier: 'High', monthlyPrice: 30000 },
  { id: 'LA', name: 'Lagos', tier: 'High', monthlyPrice: 30000 },
  { id: 'RI', name: 'Rivers', tier: 'High', monthlyPrice: 30000 },
  { id: 'OG', name: 'Ogun', tier: 'Medium', monthlyPrice: 15000 },
  { id: 'KN', name: 'Kano', tier: 'Medium', monthlyPrice: 15000 },
  { id: 'KD', name: 'Kaduna', tier: 'Medium', monthlyPrice: 15000 },
  { id: 'ED', name: 'Edo', tier: 'Medium', monthlyPrice: 15000 },
  { id: 'OY', name: 'Oyo', tier: 'Medium', monthlyPrice: 15000 },
  { id: 'AK', name: 'Akwa Ibom', tier: 'Medium', monthlyPrice: 15000 },
  { id: 'DE', name: 'Delta', tier: 'Medium', monthlyPrice: 15000 },
  { id: 'AB', name: 'Abia', tier: 'Low', monthlyPrice: 5000 },
  { id: 'AD', name: 'Adamawa', tier: 'Low', monthlyPrice: 5000 },
  { id: 'AN', name: 'Anambra', tier: 'Low', monthlyPrice: 5000 },
  { id: 'BA', name: 'Bauchi', tier: 'Low', monthlyPrice: 5000 },
  { id: 'BY', name: 'Bayelsa', tier: 'Low', monthlyPrice: 5000 },
  { id: 'BE', name: 'Benue', tier: 'Low', monthlyPrice: 5000 },
  { id: 'BO', name: 'Borno', tier: 'Low', monthlyPrice: 5000 },
  { id: 'CR', name: 'Cross River', tier: 'Low', monthlyPrice: 5000 },
  { id: 'EB', name: 'Ebonyi', tier: 'Low', monthlyPrice: 5000 },
  { id: 'EK', name: 'Ekiti', tier: 'Low', monthlyPrice: 5000 },
  { id: 'EN', name: 'Enugu', tier: 'Low', monthlyPrice: 5000 },
  { id: 'GO', name: 'Gombe', tier: 'Low', monthlyPrice: 5000 },
  { id: 'IM', name: 'Imo', tier: 'Low', monthlyPrice: 5000 },
  { id: 'JI', name: 'Jigawa', tier: 'Low', monthlyPrice: 5000 },
  { id: 'KT', name: 'Katsina', tier: 'Low', monthlyPrice: 5000 },
  { id: 'KE', name: 'Kebbi', tier: 'Low', monthlyPrice: 5000 },
  { id: 'KO', name: 'Kogi', tier: 'Low', monthlyPrice: 5000 },
  { id: 'KW', name: 'Kwara', tier: 'Low', monthlyPrice: 5000 },
  { id: 'NA', name: 'Nasarawa', tier: 'Low', monthlyPrice: 5000 },
  { id: 'NI', name: 'Niger', tier: 'Low', monthlyPrice: 5000 },
  { id: 'OS', name: 'Osun', tier: 'Low', monthlyPrice: 5000 },
  { id: 'PL', name: 'Plateau', tier: 'Low', monthlyPrice: 5000 },
  { id: 'SO', name: 'Sokoto', tier: 'Low', monthlyPrice: 5000 },
  { id: 'TA', name: 'Taraba', tier: 'Low', monthlyPrice: 5000 },
  { id: 'YO', name: 'Yobe', tier: 'Low', monthlyPrice: 5000 },
  { id: 'ZA', name: 'Zamfara', tier: 'Low', monthlyPrice: 5000 },
].sort((a, b) => a.name.localeCompare(b.name)) as NigerianState[];
