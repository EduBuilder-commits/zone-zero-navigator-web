// California Defensible Space Compliance Database
// Based on California Fire Safe regulations

export interface ComplianceItem {
  name: string
  category: 'plant' | 'material' | 'storage' | 'structure'
  status: 'compliant' | 'violation' | 'warning'
  description: string
  zone: 'zone-0' | 'zone-1' | 'zone-2' // 0-5ft, 5-30ft, 30-100ft
  severity: 'high' | 'medium' | 'low'
  remediation?: string
}

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
  }
]

// Plants that are generally COMPLIANT (fire-resistant)
export const COMPLIANT_PLANTS = [
  'Succulents',
  'Cacti',
  'Agave',
  'Aloe Vera',
  'Ice Plant',
  'Lantana',
  'Oleander (but maintainable)',
  'Rockrose',
  'Manzanita',
  'Ceanothus',
  'Native grasses',
  'Fruit trees (maintained)',
  'Herbs (rosemary, lavender)'
]

// High-risk plants (should be avoided within 30ft)
export const HIGH_RISK_PLANTS = [
  'Juniper',
  'Cypress',
  'Pine trees',
  'Eucalyptus',
  'Acacia',
  'Bamboo',
  'Russian Olive',
  'English Ivy',
  'Pampas Grass',
  'Cedar'
]

// Compliance checklist
export const COMPLIANCE_CHECKLIST = {
  zone0: [
    'No combustible materials within 5ft of structure',
    'Gutters clear of debris',
    'No storage against exterior walls',
    'No dead vegetation or leaf litter',
    'Non-combustible walkway materials',
    'Clear vents with 1/8" mesh'
  ],
  zone1: [
    'Fire-resistant plants only',
    'Spacing between plants per FPZ guidelines',
    'Dead vegetation removed',
    'Lawn maintained',
    'Chain link or non-combustible fencing'
  ],
  zone2: [
    'Grass mowed to 4" max',
    'Dead trees removed',
    'Clear access for fire vehicles',
    'Address visible from street'
  ]
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
