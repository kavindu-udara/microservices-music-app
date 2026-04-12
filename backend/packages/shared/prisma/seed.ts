import { prisma } from "../prisma";

const countries = [
  { name: "United States", code: "US" },
  { name: "Canada", code: "CA" },
  { name: "United Kingdom", code: "UK" },
  { name: "Australia", code: "AU" },
  { name: "Germany", code: "DE" },
  { name: "France", code: "FR" },
  { name: "Italy", code: "IT" },
  { name: "Spain", code: "ES" },
  { name: "Brazil", code: "BR" },
  { name: "India", code: "IN" },
  { name: "Japan", code: "JP" },
  { name: "China", code: "CN" },
  { name: "South Korea", code: "KR" },
  { name: "Mexico", code: "MX" },
  { name: "Russia", code: "RU" },
  { name: "Netherlands", code: "NL" },
  { name: "Sweden", code: "SE" },
  { name: "Switzerland", code: "CH" },
  { name: "Belgium", code: "BE" },
  { name: "Austria", code: "AT" },
  { name: "Poland", code: "PL" },
  { name: "Greece", code: "GR" },
  { name: "Portugal", code: "PT" },
  { name: "Ireland", code: "IE" },
  { name: "New Zealand", code: "NZ" },
  { name: "Singapore", code: "SG" },
  { name: "Hong Kong", code: "HK" },
  { name: "Thailand", code: "TH" },
  { name: "Vietnam", code: "VN" },
  { name: "Indonesia", code: "ID" },
  { name: "Philippines", code: "PH" },
  { name: "Malaysia", code: "MY" },
  { name: "Pakistan", code: "PK" },
  { name: "Bangladesh", code: "BD" },
  { name: "South Africa", code: "ZA" },
  { name: "Egypt", code: "EG" },
  { name: "Nigeria", code: "NG" },
  { name: "Kenya", code: "KE" },
  { name: "Argentina", code: "AR" },
  { name: "Chile", code: "CL" },
  { name: "Colombia", code: "CO" },
  { name: "Peru", code: "PE" },
  { name: "Venezuela", code: "VE" },
  { name: "Turkey", code: "TR" },
  { name: "Israel", code: "IL" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "Norway", code: "NO" },
  { name: "Denmark", code: "DK" },
  { name: "Finland", code: "FI" },
  { name: "Sri Lanka", code: "LK" },
  { name: "Morocco", code: "MA" },
  { name: "Algeria", code: "DZ" },
  { name: "Tunisia", code: "TN" },
  { name: "Libya", code: "LY" },
  { name: "Jordan", code: "JO" },
  { name: "Lebanon", code: "LB" },
  { name: "Syria", code: "SY" },
  { name: "Iraq", code: "IQ" },
  { name: "Iran", code: "IR" },
  { name: "Afghanistan", code: "AF" },
  { name: "Uzbekistan", code: "UZ" },
  { name: "Kazakhstan", code: "KZ" },
  { name: "Turkmenistan", code: "TM" },
  { name: "Kyrgyzstan", code: "KG" },
  { name: "Tajikistan", code: "TJ" },
];

async function load() {
  try {

    // create countries
    await prisma.country.createMany({
      data: countries,
      skipDuplicates: true,
    });

  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

load()
