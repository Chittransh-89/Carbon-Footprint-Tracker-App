// ============================================
// This files stores data only
// No calculation is There
// Another files imports data from here
// ============================================


// we wrote "export" because
// other files wants data of this file
// export = Data should go outside


// ============================================
// Emission Factors - Standard Environmental Data
// Source: IPCC, EPA, Carbon Trust 2023
// ============================================

export const EMISSION_FACTORS = {

   // ── TRANSPORT ──────────────────────────────
  // Unit: kg CO2 per km
  // Means: On 1km how much kg co2 will emit?
  // Source: IPCC 2023 data
  transport: {
    car_petrol:           0.21,  // Petrol car = Greater Pollution
    car_diesel:           0.17,  // Diesel less pollution
    car_electric:         0.05,  // Electric =  Least carbon footprint(but electricity also CO2)
    bike:                 0.00,  // Cycle/walk = zero pollution 
    motorcycle:           0.103, // Petrol motorcycle better than car but worse than bus
    bus:                  0.089, // Public transport = Best option for people
    train:                0.041, // Train = Mostly efficient
    flight_domestic:      0.255, // Flight = Greatest carbon footprint per km
    flight_international: 0.195, // International less carbon footprint (Big plane, More people)
  },


  // ── ELECTRICITY ────────────────────────────
  // Unit: kg CO2 per kWh
  // In india , electricity is made mostly from coal
  // that's why it has more factor
  // India grid average
  electricity: {
    india_grid: 0.82,
  },

   // ── DIET ───────────────────────────────────
  // Unit: kg CO2 per day
  // Meat Production releases mostly co2
  // Because: Animal feed, transport, methane gas

  diet: {
    vegan:       2.89,  // least carbon footprints - only plants
    vegetarian:  3.81,  // little more - dairy include
    pescatarian: 5.15,  // Fish include
    meat_low:    5.63,  // sometimes meat
    meat_medium: 7.19,  // Regular meat
    meat_high:   10.24, // daily havy meat - Greatest Carbon footprint
  },

    // ── SHOPPING ───────────────────────────────
  // Unit: kg CO2 per month
  // Manufacturing + packaging + delivery = CO2

  shopping: {
    minimal:  10, // Only needs of items  
    moderate: 30, // Normal shopping
    heavy:    70, // Greater online/offline shopping
  },

  gas: {
    lpg_cylinder: 42,   // kg CO2 per cylinder (fully used)
    png_per_scm:  2,    // kg CO2 per SCM (Standard Cubic Meter)
    png_rate:     50,   // ₹ per SCM (default Indian rate)
  },
};

// ============================================
// National & Global Averages (kg CO2 per month)
// ============================================

// ── AVERAGES ───────────────────────────────────
// It will be used for the comparison in the dashboard
// Unit: kg CO2 per month

export const AVERAGES = {
  india:              125, // Average Indian monthly footprint
  global:             375, // Average global monthly footprint
  sustainable_target:  83, // 1 tonne per year = 83 kg per month
                           // This target for all the world
};

// ============================================
// Real World Impact Comparisons
// ============================================
// For the comparison of dry numbers from real world
// We show in Dashboard - Relatable to the user

export const IMPACT_COMPARISONS = {
  trees_per_kg:         0.06, // 1 kg CO2 = 0.06 Like trees cutted down
                               // (1 tree 16kg CO2/year absorb karta hai)
  km_car_per_kg:        4.76, // 1 kg CO2 = Like petrol In car 4.76 km 
  phone_charges_per_kg: 121,  // 1 kg CO2 = Like 121 times phone charge 
};

// Proper Presentation
// Trees

// 1 tree in 1 year = absorbs 16 kg CO2
// So 1 kg CO2 = how many trees?
// 1 ÷ 16 = 0.0625 ≈ 0.06 trees

// Meaning:
// 1 kg CO2 produced   = wasted work of 0.06 trees
// 150 kg CO2 produced = 150 × 0.06 = 9 trees wasted

// Car
// Petrol car = 0.21 kg CO2 per km
// So 1 kg CO2 = how many km?
// 1 ÷ 0.21 = 4.76 km

// Meaning:
// 1 kg CO2   = driving 4.76 km in a petrol car
// 150 kg CO2 = 150 × 4.76 = 714 km driven

// Phone

// 1 phone charge = 0.00826 kg CO2
// So 1 kg CO2 = how many charges?
// 1 ÷ 0.00826 = 121 times

// Meaning:
// 1 kg CO2   = charging phone 121 times
// 150 kg CO2 = 150 × 121 = 18,150 charges


// ============================================
// Carbon Level Classification
// ============================================

// we tell user that on which level he has
export const CARBON_LEVELS = {
  excellent: { max: 83,  label: "Excellent 🌱", color: "#16a34a" },
  good:      { max: 125, label: "Good 👍",      color: "#84cc16" },
  moderate:  { max: 250, label: "Moderate ⚠️",  color: "#f59e0b" },
  high:      { max: 375, label: "High 🔴",      color: "#ef4444" },
  critical:  { max: Infinity, label: "Critical 🚨", color: "#7f1d1d" },
  // Infinity means the number greater than 375
};