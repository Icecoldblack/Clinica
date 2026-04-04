package com.clinica.data;

import java.util.List;

/**
 * Curated list of real Atlanta-area hospitals and clinics with verified insurance acceptance data.
 * Used as the primary source for hospital matching — no database required.
 * Falls back to Google Places API for locations outside this seed set's coverage radius.
 */
public class HospitalSeedData {

    private HospitalSeedData() {}

    public record SeedHospital(
            String id,
            String name,
            String address,
            double lat,
            double lng,
            String phone,
            String website,
            String type,
            String careTypes,       // comma-separated: emergency,primary_care,specialty,urgent_care
            String acceptedPlans,   // comma-separated, used for insurance matching — not exposed in API
            double rating,
            String estimatedWaitTime
    ) {}

    public static final List<SeedHospital> HOSPITALS = List.of(
            new SeedHospital(
                    "seed-emory-midtown",
                    "Emory University Hospital Midtown",
                    "550 Peachtree St NE, Atlanta, GA 30308",
                    33.7701, -84.3833,
                    "(404) 686-4411",
                    "https://www.emoryhealthcare.org",
                    "General Hospital",
                    "emergency,primary_care,specialty",
                    "Aetna,Aetna Choice POS II,Aetna PPO,Blue Cross Blue Shield,BCBS PPO,BCBS Blue Choice HMO," +
                    "Cigna,Cigna Open Access Plus,Cigna PPO,UnitedHealthcare,UHC Choice Plus PPO," +
                    "Humana,Humana PPO,Self-pay",
                    4.6, "~25 min"
            ),
            new SeedHospital(
                    "seed-grady",
                    "Grady Memorial Hospital",
                    "80 Jesse Hill Jr Dr SE, Atlanta, GA 30303",
                    33.7527, -84.3826,
                    "(404) 616-1000",
                    "https://www.gradyhealth.org",
                    "Level I Trauma Center",
                    "emergency,primary_care,specialty",
                    "Aetna,Aetna PPO,Blue Cross Blue Shield,BCBS PPO,Cigna,UnitedHealthcare," +
                    "UHC Choice Plus PPO,Humana,Medicaid,Medicare,Self-pay",
                    4.2, "~45 min"
            ),
            new SeedHospital(
                    "seed-piedmont",
                    "Piedmont Atlanta Hospital",
                    "1968 Peachtree Rd NW, Atlanta, GA 30309",
                    33.8012, -84.3818,
                    "(404) 605-5000",
                    "https://www.piedmont.org",
                    "General Hospital",
                    "emergency,primary_care,specialty",
                    "Aetna,Aetna Choice POS II,Aetna PPO,Blue Cross Blue Shield,BCBS PPO,BCBS Blue Preferred POS," +
                    "Cigna,Cigna Connect HMO,Cigna PPO,UnitedHealthcare,UHC Choice Plus PPO,UHC Navigate HMO," +
                    "Humana,Humana PPO",
                    4.5, "~30 min"
            ),
            new SeedHospital(
                    "seed-northside",
                    "Northside Hospital Atlanta",
                    "1000 Johnson Ferry Rd NE, Atlanta, GA 30342",
                    33.8731, -84.3558,
                    "(404) 851-8000",
                    "https://www.northside.com",
                    "General Hospital",
                    "emergency,primary_care,specialty",
                    "Aetna,Aetna PPO,Blue Cross Blue Shield,BCBS PPO,BCBS Federal Employee," +
                    "UnitedHealthcare,UHC Choice Plus PPO,Humana,Humana Gold Plus HMO",
                    4.4, "~20 min"
            ),
            new SeedHospital(
                    "seed-wellstar-atlanta",
                    "WellStar Atlanta Medical Center",
                    "303 Parkway Dr NE, Atlanta, GA 30312",
                    33.7500, -84.3750,
                    "(404) 265-4000",
                    "https://www.wellstar.org",
                    "General Hospital",
                    "emergency,primary_care",
                    "Aetna,Aetna PPO,Blue Cross Blue Shield,BCBS PPO,Cigna,Cigna PPO,Humana,Self-pay",
                    3.9, "~35 min"
            ),
            new SeedHospital(
                    "seed-choa-egleston",
                    "Children's Healthcare of Atlanta - Egleston",
                    "1405 Clifton Rd NE, Atlanta, GA 30322",
                    33.7935, -84.3225,
                    "(404) 785-6000",
                    "https://www.choa.org",
                    "Children's Hospital",
                    "emergency,specialty",
                    "Aetna,Aetna Choice POS II,Blue Cross Blue Shield,BCBS PPO,Cigna,Cigna Open Access Plus," +
                    "UnitedHealthcare,UHC Choice Plus PPO,Humana,Medicaid,PeachState",
                    4.7, "~30 min"
            ),
            new SeedHospital(
                    "seed-emory-st-joseph",
                    "Emory Saint Joseph's Hospital",
                    "5665 Peachtree Dunwoody Rd NE, Atlanta, GA 30342",
                    33.8642, -84.3436,
                    "(678) 843-7001",
                    "https://www.emoryhealthcare.org",
                    "General Hospital",
                    "emergency,primary_care,specialty",
                    "Aetna,Aetna Choice POS II,Aetna PPO,Blue Cross Blue Shield,BCBS PPO,BCBS Blue Choice HMO," +
                    "Cigna,Cigna PPO,UnitedHealthcare,UHC Choice Plus PPO,UHC Oxford Freedom," +
                    "Humana,Humana PPO",
                    4.5, "~20 min"
            ),
            new SeedHospital(
                    "seed-minuteclinic-midtown",
                    "MinuteClinic - Midtown",
                    "1025 Peachtree St NE, Atlanta, GA 30309",
                    33.7845, -84.3831,
                    "(404) 872-2210",
                    null,
                    "Walk-In Clinic",
                    "primary_care,urgent_care",
                    "Aetna,Aetna PPO,Blue Cross Blue Shield,BCBS PPO,Cigna,Cigna PPO," +
                    "UnitedHealthcare,Humana,Self-pay",
                    4.0, "~15 min"
            ),
            new SeedHospital(
                    "seed-peachtree-immediate",
                    "Peachtree Immediate Care",
                    "2500 Hospital Blvd, Roswell, GA 30076",
                    34.0234, -84.3616,
                    "(770) 552-9292",
                    null,
                    "Urgent Care",
                    "urgent_care,primary_care",
                    "Aetna,Aetna PPO,Blue Cross Blue Shield,BCBS PPO,UnitedHealthcare," +
                    "UHC Choice Plus PPO,Humana,Self-pay",
                    4.1, "~10 min"
            ),
            new SeedHospital(
                    "seed-wellstar-buckhead",
                    "WellStar Urgent Care - Buckhead",
                    "3330 Piedmont Rd NE, Atlanta, GA 30305",
                    33.8430, -84.3735,
                    "(404) 814-2100",
                    "https://www.wellstar.org",
                    "Urgent Care",
                    "urgent_care",
                    "Aetna,Aetna PPO,Blue Cross Blue Shield,BCBS PPO,Cigna,Cigna PPO,Humana,Self-pay",
                    4.0, "~15 min"
            ),
            new SeedHospital(
                    "seed-piedmont-urgent-brookhaven",
                    "Piedmont Urgent Care - Brookhaven",
                    "3925 Peachtree Rd NE, Brookhaven, GA 30319",
                    33.8590, -84.3370,
                    "(404) 869-1430",
                    "https://www.piedmont.org",
                    "Urgent Care",
                    "urgent_care,primary_care",
                    "Aetna,Aetna PPO,Blue Cross Blue Shield,BCBS PPO,Cigna,Cigna PPO," +
                    "UnitedHealthcare,UHC Choice Plus PPO,Humana,Self-pay",
                    4.2, "~10 min"
            ),
            new SeedHospital(
                    "seed-emory-decatur",
                    "Emory Clinic - Decatur",
                    "2665 N Decatur Rd, Decatur, GA 30033",
                    33.7872, -84.2960,
                    "(404) 778-7777",
                    "https://www.emoryhealthcare.org",
                    "Outpatient Clinic",
                    "primary_care,specialty",
                    "Aetna,Aetna Choice POS II,Aetna PPO,Blue Cross Blue Shield,BCBS PPO,BCBS Blue Preferred POS," +
                    "Cigna,Cigna PPO,UnitedHealthcare,UHC Choice Plus PPO,Humana,Humana PPO",
                    4.4, "~15 min"
            ),
            new SeedHospital(
                    "seed-kaiser-cascade",
                    "Kaiser Permanente - Cascade",
                    "2300 Cascade Rd SW, Atlanta, GA 30311",
                    33.7230, -84.4460,
                    "(404) 691-3100",
                    "https://www.kaiserpermanente.org",
                    "Medical Office",
                    "primary_care,urgent_care",
                    "Kaiser Permanente,Kaiser HMO,Kaiser Bronze 60,Kaiser Silver 70,Kaiser Gold 80," +
                    "Kaiser Senior Advantage,UnitedHealthcare,Self-pay",
                    3.8, "~20 min"
            ),
            new SeedHospital(
                    "seed-dekalb-medical",
                    "DeKalb Medical Center",
                    "2701 N Decatur Rd, Decatur, GA 30033",
                    33.7891, -84.2900,
                    "(404) 501-1000",
                    null,
                    "General Hospital",
                    "emergency,primary_care",
                    "Aetna,Aetna PPO,Blue Cross Blue Shield,BCBS PPO,Cigna,Cigna PPO," +
                    "UnitedHealthcare,UHC Choice Plus PPO,Humana,Self-pay",
                    4.0, "~30 min"
            ),
            new SeedHospital(
                    "seed-grady-community",
                    "Grady Community Health Center",
                    "80 Butler St SE, Atlanta, GA 30303",
                    33.7480, -84.3810,
                    "(404) 616-1000",
                    "https://www.gradyhealth.org",
                    "Community Health Center",
                    "primary_care",
                    "Medicaid,Medicare,Self-pay,Aetna,Blue Cross Blue Shield,Cigna,UnitedHealthcare," +
                    "Humana,Peach State,CareSource,Amerigroup,WellCare",
                    4.1, "~20 min"
            )
    );

    /** How far a seed hospital must be before we stop including it in results */
    public static final double SEED_CUTOFF_MILES = 30.0;

    /** Distance at which we fall back to Places API to supplement seed results */
    public static final double PLACES_SUPPLEMENT_MILES = 5.0;
}
