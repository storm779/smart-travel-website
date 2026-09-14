// Shared destination coordinates used across map components
export const CITY_COORDINATES: Record<string, [number, number]> = {
  // Nepal
  Pokhara: [28.2096, 83.9856],
  Chitwan: [27.5291, 84.3542],
  Kathmandu: [27.7172, 85.324],
  Nepal: [28.3949, 84.124],

  // Southeast Asia
  Bali: [-8.4095, 115.1889],
  Singapore: [1.3521, 103.8198],
  Bangkok: [13.7563, 100.5018],
  Phuket: [7.8804, 98.3923],
  Thailand: [15.87, 100.9925],
  Indonesia: [-0.7893, 113.9213],
  Malaysia: [4.2105, 101.9758],
  "Kuala Lumpur": [3.139, 101.6869],
  Vietnam: [14.0583, 108.2772],
  Hanoi: [21.0285, 105.8542],
  "Ho Chi Minh City": [10.8231, 106.6297],
  "Da Nang": [16.0544, 108.2022],

  // Middle East
  Dubai: [25.2048, 55.2708],
  Maldives: [3.2028, 73.2207],

  // Europe
  Paris: [48.8566, 2.3522],
  London: [51.5074, -0.1278],
  Rome: [41.9028, 12.4964],
  Venice: [45.4408, 12.3155],
  Santorini: [36.3932, 25.4615],
  Istanbul: [41.0082, 28.9784],
  Barcelona: [41.3851, 2.1734],
  Amsterdam: [52.3676, 4.9041],

  // Americas
  "New York": [40.7128, -74.006],
  "Rio de Janeiro": [-22.9068, -43.1729],

  // Asia Pacific
  Tokyo: [35.6762, 139.6503],
  Kyoto: [35.0116, 135.7681],
  Japan: [36.2048, 138.2529],
  Sydney: [-33.8688, 151.2093],

  // Africa
  Cairo: [30.0444, 31.2357],
  "Cape Town": [-33.9249, 18.4241],

  // India — General
  India: [20.5937, 78.9629],
  Delhi: [28.6139, 77.209],

  // India — States (for state-level packages)
  Maharashtra: [19.601, 75.5522],
  "Tamil Nadu": [11.1271, 78.6569],
  "West Bengal": [22.9868, 87.855],
  Gujarat: [22.2587, 71.1924],
  "Himachal Pradesh": [31.8869, 77.1587],
  "Jammu & Kashmir": [33.7782, 76.5762],
  Rajasthan: [27.0238, 74.2179],
  Kerala: [10.8505, 76.2711],
  Goa: [15.4909, 73.8278],
  Ladakh: [34.1526, 77.5771],
  Uttarakhand: [30.0668, 79.0193],
  Karnataka: [15.3173, 75.7139],
  Punjab: [31.1471, 75.3412],
  "Madhya Pradesh": [23.4734, 77.9479],
  Odisha: [20.9517, 85.0985],
  Sikkim: [27.533, 88.5122],
  Meghalaya: [25.467, 91.3662],
  Assam: [26.2006, 92.9376],
  Telangana: [18.1124, 79.0193],
  "Andhra Pradesh": [15.9129, 79.74],
  Chhattisgarh: [21.2787, 81.8661],
  Jharkhand: [23.6102, 85.2799],
  Bihar: [25.0961, 85.3131],
  "Arunachal Pradesh": [28.218, 94.7278],
  Nagaland: [26.1584, 94.5624],
  Mizoram: [23.1645, 92.9376],
  Tripura: [23.9408, 91.9882],
  Manipur: [24.6637, 93.9063],
  Andaman: [11.7401, 92.6586],

  // India — Cities
  Mumbai: [19.076, 72.8777],
  Jaipur: [26.9124, 75.7873],
  Agra: [27.1767, 78.0081],
  Varanasi: [25.3176, 82.9739],
  Shimla: [31.1048, 77.1734],
  Manali: [32.2396, 77.1887],
  Rishikesh: [30.0869, 78.2676],
  Udaipur: [24.5854, 73.7125],
  Darjeeling: [27.041, 88.2663],
  Leh: [34.1526, 77.5771],
  Ooty: [11.4102, 76.695],
  Munnar: [10.0889, 77.0595],
  Coorg: [12.3375, 75.8069],
  Hampi: [15.335, 76.46],
  Mysore: [12.2958, 76.6394],
  Alleppey: [9.4981, 76.3388],
  Pondicherry: [11.9416, 79.8083],
  Jodhpur: [26.2389, 73.0243],
  Amritsar: [31.634, 74.8723],
  Kolkata: [22.5726, 88.3639],
  Chennai: [13.0827, 80.2707],
  Hyderabad: [17.385, 78.4867],
  Bangalore: [12.9716, 77.5946],
  Pune: [18.5204, 73.8567],
  Bhubaneswar: [20.2961, 85.8245],
  Gangtok: [27.3389, 88.6065],
  Shillong: [25.5788, 91.8933],
  Guwahati: [26.1445, 91.7362],
  Imphal: [24.817, 93.9368],
  Aizawl: [23.7271, 92.7176],
  Agartala: [23.8315, 91.2868],
  Kohima: [25.6751, 94.1086],
  Itanagar: [27.0844, 93.6053],
  Tawang: [27.586, 91.8598],
  Ranchi: [23.3441, 85.3096],
  Patna: [25.6093, 85.1376],
  Raipur: [21.2514, 81.6296],
  Bhopal: [23.2599, 77.4126],
  Tirupati: [13.6288, 79.4192],
  Visakhapatnam: [17.6868, 83.2185],

  // Sri Lanka
  "Sri Lanka": [7.8731, 80.7718],
  Colombo: [6.9271, 79.8612],
  Kandy: [7.2906, 80.6337],

  // Bhutan
  Bhutan: [27.5142, 90.4336],
  Thimphu: [27.4728, 89.6393],
  Paro: [27.4287, 89.4164],
};

/**
 * Get coordinates for a destination string.
 * Tries exact match first, then partial match.
 */
export function getCoordinates(destination: string): [number, number] | null {
  if (CITY_COORDINATES[destination]) {
    return CITY_COORDINATES[destination];
  }

  const key = Object.keys(CITY_COORDINATES).find(
    (k) =>
      destination.toLowerCase().includes(k.toLowerCase()) ||
      k.toLowerCase().includes(destination.toLowerCase())
  );

  return key ? CITY_COORDINATES[key] : null;
}
