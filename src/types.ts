export interface User {
  id: string;
  username: string;
  email: string;
  role: 'archaeologist' | 'researcher' | 'student';
  createdAt: string;
}

export interface MonitoringZone {
  id: string;
  name: string; // e.g., 'Zone A', 'Zone B'
  description: string;
  stabilityScore: number;
  erosionRisk: 'Stable' | 'Moderate Risk' | 'High Risk';
  lastAnalysisDate: string;
}

export interface Location {
  id: string;
  name: string; // e.g. 'Marina Beach', 'Mahabalipuram'
  beachName: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  description: string;
  zones: MonitoringZone[];
}

export interface ColorComposition {
  color: string;
  percentage: number;
  label: string; // e.g., 'Quartz Sand (Light Beige)', 'Heavy Minerals (Black/Dark Slate)', 'Marine Shells (White)'
}

export interface AIAnalysis {
  grainDensityScore: number; // 0 - 100
  coastalStabilityScore: number; // 0 - 100
  erosionRiskScore: number; // 0 - 100
  sedimentVariationScore: number; // 0 - 100
  archaeologicalRelevanceScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  colorComposition: ColorComposition[];
  observations: string;
  recommendedAction: string;
  overallStatus: 'Stable' | 'Moderate Risk' | 'High Risk';
  // Scientific Sand Analysis fields
  averageGrainSize: number;       // in mm, e.g. 0.55
  grainDensity: number;          // in grains/cm2, e.g. 150
  fineSandPercentage: number;    // e.g. 18
  mediumSandPercentage: number;  // e.g. 52
  coarseSandPercentage: number;  // e.g. 30
  sedimentUniformity: number;    // e.g. 2.4 (Cu)
  // Cumulative grain curves
  d10: number; // e.g. 0.18
  d30: number; // e.g. 0.32
  d50: number; // e.g. 0.55
  d60: number; // e.g. 0.68
  d90: number; // e.g. 1.12
  // Bounding box markers to overlay on the image (deprecated/optional)
  detectedFeatures?: {
    id: string;
    label: string; // e.g., 'Medium Grain Quartz', 'Pottery Sherd?', 'Erosion Scarp', 'Shell Fragment'
    box: [number, number, number, number]; // x, y, width, height (percentage)
    type: 'sediment' | 'heritage' | 'erosion' | 'mineral';
    confidence: number;
  }[];
}

export interface Upload {
  id: string;
  siteName: string;
  beachName: string;
  state: string;
  district: string;
  latitude: number;
  longitude: number;
  dateCollected: string;
  notes: string;
  imageUrl: string; // can be base64 or seed image paths
  analysis?: AIAnalysis;
  userId?: string;
  createdAt: string;
}

export interface Report {
  id: string;
  uploadId: string;
  title: string;
  siteName: string;
  beachName: string;
  dateGenerated: string;
  metrics: {
    coastalStability: number;
    erosionRisk: number;
    archaeologicalRelevance: number;
    grainDensity: number;
  };
  observations: string;
  recommendations: string[];
  preparedBy: string;
}
