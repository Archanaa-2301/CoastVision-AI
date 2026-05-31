import fs from 'fs';
import path from 'path';
import { User, Location, Upload, Report, AIAnalysis } from '../src/types';

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Helper to generate a random boundary box
const generateFeatureBox = (label: string, x: number, y: number, w: number, h: number, type: 'sediment' | 'heritage' | 'erosion' | 'mineral', confidence: number) => ({
  id: Math.random().toString(36).substr(2, 9),
  label,
  box: [x, y, w, h] as [number, number, number, number],
  type,
  confidence
});

// A helper to generate realistic analysis data
const mockAnalysis = (siteName: string, config: {
  stability: number;
  erosion: number;
  archeo: number;
  density: number;
  variation: number;
}): AIAnalysis => {
  const status: 'Stable' | 'Moderate Risk' | 'High Risk' = 
    config.stability > 70 ? 'Stable' : 
    config.stability >= 40 ? 'Moderate Risk' : 'High Risk';

  let observations = '';
  let recommendedAction = '';

  if (config.stability < 40) {
    observations = `Critical stability concerns detected at ${siteName}. Substantial erosion patterns identified along the shoreline margin, characterized by rapid beach-scarp development. High frequency of heavy mineral deposits suggests active wave sorting.`;
    recommendedAction = 'Deploy immediate breakwaters, restrict intensive human activities, and establish continuous georeferenced camera tracking.';
  } else if (config.stability < 70) {
    observations = `Moderate sediment activity noted at ${siteName}. Wave-induced sorting has led to a heterogeneous distribution of grain sizes. Minor erosion scarps are appearing at the high-tide line.`;
    recommendedAction = 'Increase monitoring frequency to bi-weekly. Conduct seasonal topographic profiling and restrict shoreline sand extraction.';
  } else {
    observations = `Excellent shoreline health at ${siteName}. Stable grain distribution with a balanced sediment budget constraint. High proportion of coarse-grained quartz sand preserves beach resilience against swell and coastal currents.`;
    recommendedAction = 'Continue monthly routine monitoring. Support conservation of natural sand dunes and verify seasonal variations.';
  }

  if (config.archeo > 60) {
    observations += ` CRITICAL ARCHAEOLOGICAL FINDING: Visual signatures indicate potential historical remnants or ceramic scatter of archaeological interest within the intertidal zone.`;
    recommendedAction += ' Alert the state archaeology department immediately. Enforce buffer zone and conduct non-invasive magnetic gradient surveys.';
  }

  // Calculate realistic scientific sediment parameters
  const averageGrainSize = parseFloat(((100 - config.density) / 100 * 1.5 + 0.18 + Math.random() * 0.1).toFixed(2));
  const grainDensity = Math.round(config.density * 2.8 + 45); // grains/cm2
  
  // Percentages totaling 100%
  let fineSandPercentage = Math.max(5, Math.min(85, Math.round(config.density * 0.7)));
  let coarseSandPercentage = Math.max(5, Math.min(85, Math.round((100 - config.density) * 0.7)));
  if (fineSandPercentage + coarseSandPercentage > 90) {
    const scale = 90 / (fineSandPercentage + coarseSandPercentage);
    fineSandPercentage = Math.round(fineSandPercentage * scale);
    coarseSandPercentage = Math.round(coarseSandPercentage * scale);
  }
  const mediumSandPercentage = 100 - fineSandPercentage - coarseSandPercentage;
  const sedimentUniformity = parseFloat((1.5 + (config.variation / 25) + Math.random() * 0.3).toFixed(2));

  // Cumulative diameters ensuring d10 < d30 < d50 < d60 < d90
  const d50 = averageGrainSize;
  const d10 = parseFloat((d50 * 0.32 + Math.random() * 0.03).toFixed(2));
  const d30 = parseFloat((d50 * 0.58 + Math.random() * 0.04).toFixed(2));
  const d60 = parseFloat((d50 * 1.22 + Math.random() * 0.05).toFixed(2));
  const d90 = parseFloat((d50 * 2.05 + Math.random() * 0.08).toFixed(2));

  return {
    grainDensityScore: config.density,
    coastalStabilityScore: config.stability,
    erosionRiskScore: config.erosion,
    sedimentVariationScore: config.variation,
    archaeologicalRelevanceScore: config.archeo,
    confidenceScore: 92,
    colorComposition: [
      { color: '#EFCF9A', percentage: Math.round(config.density * 0.7), label: 'Quartz & Feldspar Sand (Light Beige)' },
      { color: '#5C5441', percentage: Math.round((100 - config.density) * 0.6), label: 'Heavy Minerals & Magnetite (Dark Slate)' },
      { color: '#DCD4C4', percentage: Math.round((100 - (config.density * 0.7 + (100 - config.density) * 0.6))), label: 'Biogenic Carbonate Shell Fragments (White)' }
    ],
    observations,
    recommendedAction,
    overallStatus: status,
    averageGrainSize,
    grainDensity,
    fineSandPercentage,
    mediumSandPercentage,
    coarseSandPercentage,
    sedimentUniformity,
    d10,
    d30,
    d50,
    d60,
    d90,
    detectedFeatures: [
      generateFeatureBox('Quartz Grain Accumulation', 20, 15, 30, 25, 'sediment', 96),
      generateFeatureBox('Beach Scarp Indicator', 55, 40, 25, 45, 'erosion', 89),
      ...(config.archeo > 50 ? [
        generateFeatureBox('Submerged Ceramic Sherd Highlight', 40, 30, 12, 12, 'heritage' as const, 94)
      ] : []),
      generateFeatureBox('Shell Specimen', 70, 75, 10, 10, 'sediment', 91)
    ]
  };
};

// Seed Locations
const SEED_LOCATIONS: Location[] = [
  {
    id: 'loc-1',
    name: 'Marina Beach',
    beachName: 'Marina',
    state: 'Tamil Nadu',
    district: 'Chennai',
    latitude: 13.0500,
    longitude: 80.2824,
    description: 'One of the longest urban beaches in the world, displaying massive sand deposition but facing critical seasonal surf inflation and mild erosion at its northern margins.',
    zones: [
      { id: 'zone-1a', name: 'Zone A (North Light)', description: 'Subsurface sand monitoring', stabilityScore: 78, erosionRisk: 'Stable', lastAnalysisDate: '2026-05-20' },
      { id: 'zone-1b', name: 'Zone B (Triumph Statue)', description: 'High tourist movement area', stabilityScore: 65, erosionRisk: 'Moderate Risk', lastAnalysisDate: '2026-05-22' },
      { id: 'zone-1c', name: 'Zone C (Gandhi Statue)', description: 'Central recreational segment', stabilityScore: 72, erosionRisk: 'Stable', lastAnalysisDate: '2026-05-24' },
      { id: 'zone-1d', name: 'Zone D (Marina Shore)', description: 'Erosion prone seawall border', stabilityScore: 35, erosionRisk: 'High Risk', lastAnalysisDate: '2026-05-28' }
    ]
  },
  {
    id: 'loc-2',
    name: 'Mahabalipuram Coastal Zone',
    beachName: 'Mahabalipuram Shore Beach',
    state: 'Tamil Nadu',
    district: 'Chengalpattu',
    latitude: 12.6208,
    longitude: 80.1945,
    description: 'A UNESCO World Heritage maritime site of extreme archaeological relevance. Displays intense seasonal sand migration exposing historical bricks & pottery sherds near the Shore Temple.',
    zones: [
      { id: 'zone-2a', name: 'Zone A (Shore Temple North)', description: 'Immediate beach fronting monument', stabilityScore: 45, erosionRisk: 'Moderate Risk', lastAnalysisDate: '2026-05-29' },
      { id: 'zone-2b', name: 'Zone B (Ancient Port Basin)', description: 'Erosion zone showing brick segments', stabilityScore: 38, erosionRisk: 'High Risk', lastAnalysisDate: '2026-05-29' },
      { id: 'zone-2c', name: 'Zone C (Fisherman Beach)', description: 'Coarser quartz sediment basin', stabilityScore: 82, erosionRisk: 'Stable', lastAnalysisDate: '2026-05-15' },
      { id: 'zone-2d', name: 'Zone D (Southern Bluffs)', description: 'Hard rocky cliff-sand contact', stabilityScore: 88, erosionRisk: 'Stable', lastAnalysisDate: '2026-05-18' }
    ]
  },
  {
    id: 'loc-3',
    name: 'Kanyakumari Confluence',
    beachName: 'Kanyakumari Beach',
    state: 'Tamil Nadu',
    district: 'Kanyakumari',
    latitude: 8.0883,
    longitude: 77.5385,
    description: 'Confluence of three water bodies. Known for its multi-colored mineral sands, containing rich deposits of monazite, zircon, and garnet with high heavy metal counts.',
    zones: [
      { id: 'zone-3a', name: 'Zone A (Vivekanand Rock-facing)', description: 'High energy rocky beach sand', stabilityScore: 68, erosionRisk: 'Moderate Risk', lastAnalysisDate: '2026-05-25' },
      { id: 'zone-3b', name: 'Zone B (Sunset Point)', description: 'Multi-colored granular sand bay', stabilityScore: 74, erosionRisk: 'Stable', lastAnalysisDate: '2026-05-26' },
      { id: 'zone-3c', name: 'Zone C (Tri-Sea Confluence)', description: 'Siltation-heavy sediment layer', stabilityScore: 59, erosionRisk: 'Moderate Risk', lastAnalysisDate: '2026-05-12' }
    ]
  },
  {
    id: 'loc-4',
    name: 'Rameswaram Island Coast',
    beachName: 'Dhanushkodi Beach',
    state: 'Tamil Nadu',
    district: 'Rameswaram',
    latitude: 9.2876,
    longitude: 79.3129,
    description: 'Dynamic barrier spit environment connecting India to Adams Bridge. High vulnerability to tropical cyclones with dramatic sediment shifting exposing ruins of the drowned town.',
    zones: [
      { id: 'zone-4a', name: 'Zone A (Dhanushkodi Ruined Church)', description: 'Exposed historical foundations', stabilityScore: 32, erosionRisk: 'High Risk', lastAnalysisDate: '2026-05-21' },
      { id: 'zone-4b', name: 'Zone B (Adams Bridge Spit)', description: 'High tidal sand bar', stabilityScore: 89, erosionRisk: 'Stable', lastAnalysisDate: '2026-05-20' }
    ]
  },
  {
    id: 'loc-5',
    name: 'Puducherry Promenade',
    beachName: 'Rock Beach & Veerampattinam',
    state: 'Puducherry',
    district: 'Puducherry',
    latitude: 11.9416,
    longitude: 79.8083,
    description: 'Subject to intense artificial shoreline reconstruction. Veerampattinam beach shows rich archaeological remnants of ancient Indo-Roman trade port Arikamedu nearby.',
    zones: [
      { id: 'zone-5a', name: 'Zone A (Veerampattinam Shore)', description: 'Arikamedu river mouth contact', stabilityScore: 52, erosionRisk: 'Moderate Risk', lastAnalysisDate: '2026-05-15' },
      { id: 'zone-5b', name: 'Zone B (Promenade Beach Front)', description: 'Groyne-protected nourishment site', stabilityScore: 70, erosionRisk: 'Stable', lastAnalysisDate: '2026-05-22' }
    ]
  },
  {
    id: 'loc-6',
    name: 'Kochi Fort Beach',
    beachName: 'Fort Kochi Beach',
    state: 'Kerala',
    district: 'Ernakulam',
    latitude: 9.9312,
    longitude: 76.2673,
    description: 'Sub-tidal mudbank phenomena and maritime heritage site. Highly threatened by navigational dredging of Cochin Port channel nearby, destroying natural littoral wash.',
    zones: [
      { id: 'zone-6a', name: 'Zone A (Chinese Fishing Nets)', description: 'Critical erosion and silt area', stabilityScore: 41, erosionRisk: 'Moderate Risk', lastAnalysisDate: '2026-05-24' }
    ]
  },
  {
    id: 'loc-7',
    name: 'Goa Coastal Slopes',
    beachName: 'Anjuna Beach',
    state: 'Goa',
    district: 'North Goa',
    latitude: 15.2993,
    longitude: 73.7710,
    description: 'Famous lateritic cliffs framing sandy bays. Under increasing pressure from heavy tourism, sea wall reinforcements, and seasonal monsoon beach sand wash-out.',
    zones: [
      { id: 'zone-7a', name: 'Zone A (Anjuna Laterite Bay)', description: 'Reddish sand shoreline interface', stabilityScore: 75, erosionRisk: 'Stable', lastAnalysisDate: '2026-05-25' },
      { id: 'zone-7b', name: 'Zone B (Northern Rocky Shore)', description: 'Erosion prone tourist pathways', stabilityScore: 48, erosionRisk: 'Moderate Risk', lastAnalysisDate: '2026-05-27' }
    ]
  },
  {
    id: 'loc-8',
    name: 'Visakhapatnam RK Coast',
    beachName: 'Rama Krishna Beach',
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    latitude: 17.6868,
    longitude: 83.2185,
    description: 'Experiencing catastrophic nourishment deficiencies due to harbour breakwater positioning. Visakhapatnam beaches show frequent localized storm breaches.',
    zones: [
      { id: 'zone-8a', name: 'Zone A (Kursura Submarine Front)', description: 'Highly dynamic sand wave front', stabilityScore: 36, erosionRisk: 'High Risk', lastAnalysisDate: '2026-05-28' }
    ]
  },
  {
    id: 'loc-9',
    name: 'Mumbai Chowpatty',
    beachName: 'Girgaon Chowpatty',
    state: 'Maharashtra',
    district: 'Mumbai City',
    latitude: 18.9543,
    longitude: 72.8124,
    description: 'Intertidal sand shelf in the heart of Mumbai. High organic silt contribution and intensive cleaning schedules skewing sediment structure analysis.',
    zones: [
      { id: 'zone-9a', name: 'Zone A (Marine Drive Contact)', description: 'Fine clayey-sand deposits', stabilityScore: 81, erosionRisk: 'Stable', lastAnalysisDate: '2026-05-21' }
    ]
  },
  {
    id: 'loc-10',
    name: 'Digha Estuary',
    beachName: 'Old Digha Flat Beach',
    state: 'West Bengal',
    district: 'Purba Medinipur',
    latitude: 21.6266,
    longitude: 87.5074,
    description: 'Flat, hard beaches with active clay beds. Very low gradient shoreline heavily influenced by mega-estuarial silt feed from the Hooghly-Ganges discharge system.',
    zones: [
      { id: 'zone-10a', name: 'Zone A (Seawall Pier)', description: 'Concrete walled shoreline erosion', stabilityScore: 39, erosionRisk: 'High Risk', lastAnalysisDate: '2026-05-27' }
    ]
  }
];

// Rich Sample Uploads
const SEED_UPLOADS: Upload[] = [
  {
    id: 'upload-1',
    siteName: 'Mahabalipuram Coastal Zone',
    beachName: 'Shore Temple North',
    state: 'Tamil Nadu',
    district: 'Chengalpattu',
    latitude: 12.6208,
    longitude: 80.1945,
    dateCollected: '2026-05-29',
    notes: 'Exposed brick structures from potential Pallava beach port foundations visible at low tide. Fine black magnetite deposits found mixed with coarse quartz grains.',
    imageUrl: 'https://images.unsplash.com/photo-1621574539437-4b7cb63120b8?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-05-29T10:15:00.000Z',
    analysis: mockAnalysis('Mahabalipuram Shore Temple North', { stability: 45, erosion: 65, archeo: 85, density: 42, variation: 74 })
  },
  {
    id: 'upload-2',
    siteName: 'Mahabalipuram Coastal Zone',
    beachName: 'Ancient Port Basin',
    state: 'Tamil Nadu',
    district: 'Chengalpattu',
    latitude: 12.6205,
    longitude: 80.1940,
    dateCollected: '2026-05-29',
    notes: 'Sand sample collected near active tidal scarp 100m south of temple monument. Clear structural sorting.',
    imageUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-05-29T11:40:00.000Z',
    analysis: mockAnalysis('Mahabalipuram Ancient Port Basin', { stability: 38, erosion: 78, archeo: 75, density: 31, variation: 66 })
  },
  {
    id: 'upload-3',
    siteName: 'Anjuna Beach Coast',
    beachName: 'Anjuna Laterite Bay',
    state: 'Goa',
    district: 'North Goa',
    latitude: 15.2993,
    longitude: 73.7710,
    dateCollected: '2026-05-25',
    notes: 'Beige quartz sand sample containing distinctive reddish lateritic soil washout from neighboring headland.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-05-25T14:30:00.000Z',
    analysis: mockAnalysis('Anjuna Laterite Bay', { stability: 75, erosion: 25, archeo: 15, density: 78, variation: 45 })
  },
  {
    id: 'upload-4',
    siteName: 'Marina Beach Lights',
    beachName: 'Marina North Segment',
    state: 'Tamil Nadu',
    district: 'Chennai',
    latitude: 13.0531,
    longitude: 80.2829,
    dateCollected: '2026-05-24',
    notes: 'Well-sorted silicate sand with rich shiny quartz granules. Highly stable dune remnants analysed.',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df056fb49785?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-05-24T08:00:00.000Z',
    analysis: mockAnalysis('Marina North Segment', { stability: 72, erosion: 30, archeo: 8, density: 85, variation: 52 })
  },
  {
    id: 'upload-5',
    siteName: 'Kanyakumari Confluence',
    beachName: 'Vivekanand Shore',
    state: 'Tamil Nadu',
    district: 'Kanyakumari',
    latitude: 8.0883,
    longitude: 77.5385,
    dateCollected: '2026-05-25',
    notes: 'Striking multi-colored mineral sand sample. Contains high concentrations of heavy garnet minerals.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-05-25T16:45:00.004Z',
    analysis: mockAnalysis('Vivekanand Shore', { stability: 68, erosion: 42, archeo: 38, density: 60, variation: 85 })
  },
  {
    id: 'upload-6',
    siteName: 'Dhanushkodi Ruins',
    beachName: 'Dhanushkodi Spit',
    state: 'Tamil Nadu',
    district: 'Rameswaram',
    latitude: 9.2876,
    longitude: 79.3129,
    dateCollected: '2026-05-21',
    notes: 'Collected right next to submerged railway track masonry. Severe washing, fine sand grains dominating.',
    imageUrl: 'https://images.unsplash.com/photo-1520116468419-a5240b786689?auto=format&fit=crop&q=80&w=800',
    createdAt: '2026-05-21T09:20:00.000Z',
    analysis: mockAnalysis('Dhanushkodi Spit', { stability: 32, erosion: 85, archeo: 55, density: 24, variation: 41 })
  }
];

// Initial Reports
const SEED_REPORTS: Report[] = [
  {
    id: 'rep-1',
    uploadId: 'upload-1',
    title: 'Geospatial Sand Analysis and Shoreline Heritage Report: Mahabalipuram Site 1',
    siteName: 'Mahabalipuram Coastal Zone',
    beachName: 'Shore Temple North',
    dateGenerated: '2026-05-30',
    metrics: {
      coastalStability: 45,
      erosionRisk: 65,
      archaeologicalRelevance: 85,
      grainDensity: 42
    },
    observations: 'The analytical assessment of the Mahabalipuram coastal sample confirms highly problematic shoreline regression. The presence of magnetite suggests sorting of heavy minerals due to robust local backwash of breaking waves. Most critically, visual analysis confirms the presence of historic Pallava-era clay masonry segments within the high-water line, which are being fast degraded by salt encrustation and wave impacts.',
    recommendations: [
      'Establish immediate non-structural bio-groynes around the archaeological boundary.',
      'Declare custom heritage shoreline protection zone within 200m radius of major temple masonry.',
      'Transition sand monitoring schedule to daily photogrammetric capture.'
    ],
    preparedBy: 'Dr. Evelyn Carter, Coastal Heritage Council'
  }
];

export class DBEngine {
  private users: any[] = [];
  private locations: Location[] = [];
  private uploads: Upload[] = [];
  private reports: Report[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const data = JSON.parse(raw);
        this.users = data.users || [];
        this.locations = data.locations || [];
        this.uploads = data.uploads || [];
        this.reports = data.reports || [];
      } catch (err) {
        console.error('Error reading db.json, generating default database:', err);
        this.loadDefaultSeed();
      }
    } else {
      this.loadDefaultSeed();
    }
  }

  private loadDefaultSeed() {
    this.users = [
      {
        id: 'u-1',
        username: 'admin',
        email: 'admin@coastalvision.edu',
        password: 'admin', // Simple clear text for demo deployment login
        role: 'archaeologist',
        createdAt: '2026-01-01T00:00:00.000Z'
      },
      {
        id: 'u-2',
        username: 'student',
        email: 'student@coastalvision.edu',
        password: 'student',
        role: 'student',
        createdAt: '2026-02-15T00:00:00.000Z'
      }
    ];
    this.locations = SEED_LOCATIONS;
    this.uploads = SEED_UPLOADS;
    this.reports = SEED_REPORTS;
    this.save();
  }

  public save() {
    const data = {
      users: this.users,
      locations: this.locations,
      uploads: this.uploads,
      reports: this.reports
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  }

  // Auth Operations
  public findUserByEmail(email: string) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: any) {
    user.id = 'u-' + Math.random().toString(36).substr(2, 9);
    user.createdAt = new Date().toISOString();
    this.users.push(user);
    this.save();
    return user;
  }

  // Location Operations
  public getLocations() {
    return this.locations;
  }

  public updateZoneStability(locationId: string, zoneId: string, score: number) {
    const loc = this.locations.find(l => l.id === locationId);
    if (loc) {
      const zone = loc.zones.find(z => z.id === zoneId);
      if (zone) {
        zone.stabilityScore = score;
        zone.erosionRisk = score > 70 ? 'Stable' : score >= 40 ? 'Moderate Risk' : 'High Risk';
        zone.lastAnalysisDate = new Date().toISOString().split('T')[0];
        this.save();
      }
    }
  }

  // Upload/Analysis Operations
  public getUploads() {
    return this.uploads;
  }

  public addUpload(upload: Upload) {
    this.uploads.unshift(upload);

    // Sync zone state if we uploaded a fresh image for an existing site
    let matchingLoc = this.locations.find(l => l.name.toLowerCase() === upload.siteName.toLowerCase());
    if (!matchingLoc) {
      // Automatic site registration on GIS Coastal Map
      matchingLoc = {
        id: 'loc-' + Math.random().toString(36).substr(2, 9),
        name: upload.siteName,
        beachName: upload.beachName,
        state: upload.state || 'Unknown State',
        district: upload.district || 'Unknown District',
        latitude: upload.latitude,
        longitude: upload.longitude,
        description: upload.notes || `Newly registered monitoring station at ${upload.beachName}.`,
        zones: [
          {
            id: 'zone-' + Math.random().toString(36).substr(2, 9),
            name: 'Zone A',
            description: 'Automated monitoring zone',
            stabilityScore: upload.analysis?.coastalStabilityScore || 50,
            erosionRisk: upload.analysis?.overallStatus || 'Moderate Risk',
            lastAnalysisDate: upload.dateCollected
          }
        ]
      };
      this.locations.push(matchingLoc);
    } else if (upload.analysis) {
      // Find matching monitoring zone or add it
      let zone = matchingLoc.zones.find(z => upload.notes.includes(z.name) || upload.beachName.includes(z.name));
      if (!zone && matchingLoc.zones.length > 0) {
        // Update first zone as dynamic simulation target
        zone = matchingLoc.zones[0];
      }
      if (zone) {
        zone.stabilityScore = upload.analysis.coastalStabilityScore;
        zone.erosionRisk = upload.analysis.overallStatus;
        zone.lastAnalysisDate = upload.dateCollected;
      }
    }

    this.save();
    return upload;
  }

  // Reports Operations
  public getReports() {
    return this.reports;
  }

  public addReport(report: Report) {
    this.reports.unshift(report);
    this.save();
    return report;
  }
}

export const dbStore = new DBEngine();
