// California Defensible Space Compliance Database
// Based on California Fire Safe regulations

import { PlantInfo } from '@/types'

export interface ComplianceItem {
  name: string
  category: 'plant' | 'material' | 'storage' | 'structure'
  status: 'compliant' | 'violation' | 'warning'
  description: string
  zone: 'zone-0' | 'zone-1' | 'zone-2' // 0-5ft, 5-30ft, 30-100ft
  severity: 'high' | 'medium' | 'low'
  remediation?: string
}

// 🌿 PLANT DATABASE
// Red List = High fire risk, avoid within 30ft of structure
// Green List = Fire-resistant, recommended for landscaping

export const PLANT_DATABASE: PlantInfo[] = [
  // 🔴 RED LIST - High Fire Risk
  { name: 'Juniper', category: 'Red List', reason: 'Highly flammable foliage, oils', substitutes: ['Succulents', 'Ice Plant'] },
  { name: 'Cypress', category: 'Red List', reason: 'Resin-laden, burns quickly', substitutes: ['Manzanita', 'Ceanothus'] },
  { name: 'Pine Trees', category: 'Red List', reason: 'Needles and sap are highly flammable', substitutes: ['Oak', 'Maple'] },
  { name: 'Eucalyptus', category: 'Red List', reason: 'Oil-rich leaves, sheds bark', substitutes: ['Toyon', 'Coffeeberry'] },
  { name: 'Acacia', category: 'Red List', reason: 'Highly flammable seed pods', substitutes: ['Ceanothus', 'Native grasses'] },
  { name: 'Bamboo', category: 'Red List', reason: 'Highly flammable, spreads rapidly', substitutes: ['Ornamental grasses', 'Ferns'] },
  { name: 'Russian Olive', category: 'Red List', reason: 'Highly flammable', substitutes: ['Native shrubs'] },
  { name: 'English Ivy', category: 'Red List', reason: 'Climbing ivy can carry fire up walls', substitutes: ['Wisteria (maintained)'] },
  { name: 'Pampas Grass', category: 'Red List', reason: 'Highly flammable foliage', substitutes: ['Muhly Grass', 'Blue Oat Grass'] },
  { name: 'Cedar', category: 'Red List', reason: 'Resin-rich, burns intensely', substitutes: ['Manzanita', 'Coffeeberry'] },
  { name: 'Fir', category: 'Red List', reason: 'Needles and sap are highly flammable', substitutes: ['Coast Live Oak'] },
  { name: 'Spruce', category: 'Red List', reason: 'Resin-laden needles', substitutes: ['Magnolia', 'Dogwood'] },
  
  // 🟢 GREEN LIST - Fire Resistant
  { name: 'Succulents', category: 'Green List', reason: 'High water content, fire-resistant', substitutes: [] },
  { name: 'Cacti', category: 'Green List', reason: 'High water content', substitutes: [] },
  { name: 'Agave', category: 'Green List', reason: 'Fire-resistant, low flammability', substitutes: [] },
  { name: 'Aloe Vera', category: 'Green List', reason: 'Fire-resistant succulent', substitutes: [] },
  { name: 'Ice Plant', category: 'Green List', reason: 'Moisture-rich groundcover', substitutes: [] },
  { name: 'Lantana', category: 'Green List', reason: 'Fire-resistant when healthy', substitutes: [] },
  { name: 'Oleander', category: 'Green List', reason: 'Fire-resistant when maintained', substitutes: [] },
  { name: 'Rockrose', category: 'Green List', reason: 'Low flammability', substitutes: [] },
  { name: 'Manzanita', category: 'Green List', reason: 'California native, fire-adapted', substitutes: [] },
  { name: 'Ceanothus', category: 'Green List', reason: 'California native, low flammability', substitutes: [] },
  { name: 'Native Grasses', category: 'Green List', reason: 'Fire-resistant California natives', substitutes: [] },
  { name: 'Herbs (rosemary, lavender)', category: 'Green List', reason: 'Low flammability, aromatic oils deter fire', substitutes: [] },
  { name: 'Muhly Grass', category: 'Green List', reason: 'Fire-resistant ornamental grass', substitutes: [] },
  { name: 'Blue Oat Grass', category: 'Green List', reason: 'Fire-resistant', substitutes: [] },
  { name: 'Toyon', category: 'Green List', reason: 'California native, fire-adapted', substitutes: [] },
  { name: 'Coffeeberry', category: 'Green List', reason: 'California native, low flammability', substitutes: [] },
]

// Items that are VIOLATIONS within 5ft (Zone 0)
export const ZONE_0_VIOLATIONS: ComplianceItem[] = [
  {
    name: 'Wood Mulch',
    category: 'material',
    status: 'violation',
    description: 'Combustible wood mulch within 5ft of structure',
    zone: 'zone-0',
    severity: 'high',
    remediation: 'Replace with non-combustible gravel or hardscape'
  },
  {
    name: 'Firewood Stack',
    category: 'storage',
    status: 'violation',
    description: 'Firewood stored against or within 5ft of structure',
    zone: 'zone-0',
    severity: 'high',
    remediation: 'Move firewood at least 30ft from structure'
  },
  {
    name: 'Combustible Patio Furniture',
    category: 'storage',
    status: 'violation',
    description: 'Wooden or plastic patio furniture within 5ft',
    zone: 'zone-0',
    severity: 'medium',
    remediation: 'Replace with non-combustible furniture or move 5ft+ away'
  },
  {
    name: 'Dead Vegetation',
    category: 'plant',
    status: 'violation',
    description: 'Dead plants, leaves, or debris within 5ft',
    zone: 'zone-0',
    severity: 'high',
    remediation: 'Remove all dead vegetation immediately'
  },
  {
    name: 'Wooden Fencing',
    category: 'structure',
    status: 'violation',
    description: 'Combustible fencing attached to structure within 5ft',
    zone: 'zone-0',
    severity: 'high',
    remediation: 'Replace with non-combustible fencing or maintain 5ft gap'
  },
  {
    name: 'Storage Items',
    category: 'storage',
    status: 'violation',
    description: 'Boxes, containers, or combustible storage within 5ft',
    zone: 'zone-0',
    severity: 'medium',
    remediation: 'Remove all storage from 5ft zone'
  },
  {
    name: 'Bark Mulch',
    category: 'material',
    status: 'violation',
    description: 'Bark or shredded wood mulch within 5ft',
    zone: 'zone-0',
    severity: 'high',
    remediation: 'Replace with 1/4" gravel or non-combustible material'
  },
  {
    name: 'Wood Chips',
    category: 'material',
    status: 'violation',
    description: 'Wood chips or playground mulch within 5ft',
    zone: 'zone-0',
    severity: 'high',
    remediation: 'Replace with non-combustible material'
  },
  {
    name: 'Propane Tank',
    category: 'storage',
    status: 'violation',
    description: 'Propane tank within 10ft of structure',
    zone: 'zone-0',
    severity: 'high',
    remediation: 'Relocate propane tank minimum 10ft from structure'
  },
  {
    name: 'Gas Grill',
    category: 'storage',
    status: 'violation',
    description: 'Gas grill within 10ft of structure',
    zone: 'zone-0',
    severity: 'medium',
    remediation: 'Relocate grill minimum 10ft from structure'
  }
]

// Compliance checklist
export const COMPLIANCE_CHECKLIST = {
  zone0: [
    'No combustible materials within 5ft of structure',
    'Gutters clear of debris',
    'No storage against exterior walls',
    'No dead vegetation or leaf litter',
    'Non-combustible walkway materials',
    'Clear vents with 1/8" mesh',
    'No propane tanks within 10ft',
    'No gas grills within 10ft'
  ],
  zone1: [
    'Fire-resistant plants only (Green List)',
    'Spacing between plants per FPZ guidelines',
    'Dead vegetation removed',
    'Lawn maintained',
    'Chain link or non-combustible fencing',
    'No high-risk plants (Red List)'
  ],
  zone2: [
    'Grass mowed to 4" max',
    'Dead trees removed',
    'Clear access for fire vehicles',
    'Address visible from street'
  ]
}

// Search plants
export function searchPlants(query: string): PlantInfo[] {
  const lowerQuery = query.toLowerCase()
  return PLANT_DATABASE.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.scientificName?.toLowerCase().includes(lowerQuery)
  )
}

// Get plants by category
export function getPlantsByCategory(category: 'Red List' | 'Green List'): PlantInfo[] {
  return PLANT_DATABASE.filter(p => p.category === category)
}

// Analyze image for compliance items
export function analyzeForCompliance(imageDescription: string): ComplianceItem[] {
  const findings: ComplianceItem[] = []
  const lowerDesc = imageDescription.toLowerCase()
  
  // Check for violations
  ZONE_0_VIOLATIONS.forEach(item => {
    if (lowerDesc.includes(item.name.toLowerCase()) || 
        lowerDesc.includes(item.description.toLowerCase())) {
      findings.push(item)
    }
  })
  
  return findings
}
