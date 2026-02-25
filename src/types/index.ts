// Jurisdiction Options
export enum JurisdictionMode {
  SAN_DIEGO = 'San Diego_LRA',
  CALIFORNIA_SRA = 'California_SRA'
}

// Compliance Status
export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  VIOLATION = 'VIOLATION',
  WARNING = 'WARNING'
}

// Severity Levels
export type HazardSeverity = 'high' | 'medium' | 'low';

// Insurance Tiers
export type InsurabilityTier = 
  | 'PREFERRED'      // Score 0-2: Standard admitted market
  | 'STANDARD'       // Score 3-4: Admitted market
  | 'NON_STANDARD'   // Score 5-6: Surplus lines
  | 'HIGH_RISK'      // Score 7-8: FAIR Plan likely
  | 'UNINSURABLE';   // Score 9-10: FAIR Plan only

// Plant Database Entry
export interface PlantInfo {
  name: string;
  scientificName?: string;
  category: 'Red List' | 'Green List';
  reason: string;
  substitutes?: string[];
}

// User (Supabase Auth)
export interface User {
  id: string;
  email: string;
  created_at: string;
  subscription_tier: 'free' | 'premium';
  subscription_expires_at?: string;
}

// Property (for multi-property tracking)
export interface Property {
  id: string;
  user_id: string;
  address: string;
  jurisdiction: JurisdictionMode;
  created_at: string;
  last_audit_at?: string;
}

// Report History Entry
export interface ReportHistoryEntry {
  id: string;
  property_id: string;
  report: ComplianceReport;
  created_at: string;
  pdf_url?: string; // Supabase storage URL
}

// Email Send Record
export interface EmailRecord {
  id: string;
  report_id: string;
  recipient_email: string;
  sent_at: string;
  status: 'sent' | 'failed' | 'pending';
}

// Fire Hazard Data (GIS/Location Info)
export interface FireHazardData {
  fhsZ_classification: 'VHFHSZ' | 'HFHSZ' | 'MFHSZ' | 'NON-WUI';
  responsibility_area: 'SRA' | 'LRA' | 'FRA';
  insurance_tier: InsurabilityTier;
  fair_plan_eligible: boolean;
  fire_protection_class: string;  // ISO 1-10
  distance_to_fire_station_miles: number;
  nearest_fire_station: string;
}

// Structure Hardening Assessment
export interface StructureHardeningReport {
  roof_material: string;
  roof_condition: 'Good' | 'Fair' | 'Poor';
  roof_rating: 'A' | 'B' | 'C' | 'Unrated';
  siding_material: string;
  siding_fire_resistance: 'High' | 'Moderate' | 'Low' | 'None';
  eave_type: 'Boxed' | 'Open' | 'Vented';
  window_specs: string;
  vent_mesh_size: '1/8 inch' | '1/16 inch' | 'Non-compliant (>1/8")' | 'Unknown';
  chimney_spark_arrestor: boolean;
}

// Remediation Action Item
export interface RemediationAction {
  id: string;
  priority: 1 | 2 | 3;
  title: string;
  description: string;
  diy_feasible: boolean;
  diy_difficulty: 'Easy' | 'Moderate' | 'Difficult';
  cost_estimate: string;
  insurance_impact_score: number;  // Points removed from risk score
}

// Hazard Location (for image overlay)
export interface HazardLocation {
  box_2d: [number, number, number, number];  // [ymin, xmin, ymax, xmax] normalized 0-1000
  label: string;
  severity: HazardSeverity;
}

// Main Compliance Report
export interface ComplianceReport {
  scan_id: string;
  jurisdiction_mode: JurisdictionMode;
  zone_0_status: ComplianceStatus;
  hazards_detected: string[];
  hazard_locations: HazardLocation[];
  insurance_risk_score: number;
  fire_hazard_data: FireHazardData;
  fair_plan_eligible: boolean;
  structure_hardening: StructureHardeningReport;
  summary: string;
  remediation_plan: RemediationAction[];
  imageUrls?: string[];
  timestamp: string;
  address?: string;
}

// Plant Database Entry
export interface PlantInfo {
  name: string;
  scientificName?: string;
  category: 'Red List' | 'Green List';
  reason: string;
  substitutes?: string[];
}

// User (Supabase Auth - for future use)
export interface User {
  id: string;
  email: string;
  created_at: string;
  subscription_tier: 'free' | 'premium';
  subscription_expires_at?: string;
}

// Property (for multi-property tracking)
export interface Property {
  id: string;
  user_id: string;
  address: string;
  jurisdiction: JurisdictionMode;
  created_at: string;
  last_audit_at?: string;
}

// Report History Entry
export interface ReportHistoryEntry {
  id: string;
  property_id: string;
  report: ComplianceReport;
  created_at: string;
  pdf_url?: string;
}

// Photo Slot
export interface PhotoSlot {
  id: string;
  label: string;
  file?: File;
  previewUrl?: string;
  compressedBase64?: string;
}
