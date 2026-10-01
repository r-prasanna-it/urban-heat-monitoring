const sampleUsers = [
  {
    email: 'admin@gmail.com',
    password: 'admin123',
  },
];

const sampleHotspots = [
  {
    location: 'Central Commercial District',
    temperature: 41.5,
    severity: 'High',
    date: new Date('2026-05-15'),
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    location: 'North Industrial Corridor',
    temperature: 43.2,
    severity: 'High',
    date: new Date('2026-05-18'),
    latitude: 13.0358,
    longitude: 77.597,
  },
  {
    location: 'Tech Valley Junction',
    temperature: 38.0,
    severity: 'Medium',
    date: new Date('2026-05-20'),
    latitude: 12.9279,
    longitude: 77.6271,
  },
  {
    location: 'Old Town Market Square',
    temperature: 39.4,
    severity: 'Medium',
    date: new Date('2026-05-22'),
    latitude: 12.9611,
    longitude: 77.575,
  },
  {
    location: 'East Riverside Boulevard',
    temperature: 34.2,
    severity: 'Low',
    date: new Date('2026-05-25'),
    latitude: 12.985,
    longitude: 77.665,
  },
];

const sampleGreenCover = [
  {
    location: 'Botanical Gardens Sector',
    greenCoverPercentage: 68.5,
    numberOfTrees: 14500,
    status: 'Good',
  },
  {
    location: 'University Campus Zone',
    greenCoverPercentage: 54.0,
    numberOfTrees: 9200,
    status: 'Good',
  },
  {
    location: 'South Residential Ward',
    greenCoverPercentage: 32.5,
    numberOfTrees: 4100,
    status: 'Moderate',
  },
  {
    location: 'Central Commercial District',
    greenCoverPercentage: 11.2,
    numberOfTrees: 850,
    status: 'Low',
  },
  {
    location: 'North Industrial Corridor',
    greenCoverPercentage: 8.4,
    numberOfTrees: 420,
    status: 'Low',
  },
];

const sampleWeatherStations = [
  {
    stationName: 'Downtown MET-01',
    location: 'Central Commercial District',
    temperature: 40.8,
    humidity: 28,
    status: 'Active',
  },
  {
    stationName: 'Suburban Aero-02',
    location: 'South Residential Ward',
    temperature: 33.5,
    humidity: 45,
    status: 'Active',
  },
  {
    stationName: 'EcoPark Sentinel-03',
    location: 'Botanical Gardens Sector',
    temperature: 29.8,
    humidity: 62,
    status: 'Active',
  },
  {
    stationName: 'Industrial Perimeter-04',
    location: 'North Industrial Corridor',
    temperature: 42.1,
    humidity: 24,
    status: 'Inactive',
  },
];

const sampleCoolingInitiatives = [
  {
    initiativeName: 'Urban Forestry Green Corridor',
    location: 'North Industrial Corridor',
    type: 'Tree Plantation',
    status: 'Ongoing',
    startDate: new Date('2026-01-10'),
  },
  {
    initiativeName: 'Civic Center Cool Roof Coating',
    location: 'Central Commercial District',
    type: 'Cool Roof',
    status: 'Completed',
    startDate: new Date('2025-11-05'),
  },
  {
    initiativeName: 'Metro Plaza Water Mist Kiosks',
    location: 'Old Town Market Square',
    type: 'Water Mist Station',
    status: 'Ongoing',
    startDate: new Date('2026-03-01'),
  },
  {
    initiativeName: 'Eco-Community Public Park',
    location: 'South Residential Ward',
    type: 'Public Park',
    status: 'Planned',
    startDate: new Date('2026-06-15'),
  },
  {
    initiativeName: 'Solar Reflective School Roofs',
    location: 'Tech Valley Junction',
    type: 'Cool Roof',
    status: 'Planned',
    startDate: new Date('2026-07-01'),
  },
];

module.exports = {
  sampleUsers,
  sampleHotspots,
  sampleGreenCover,
  sampleWeatherStations,
  sampleCoolingInitiatives,
};
