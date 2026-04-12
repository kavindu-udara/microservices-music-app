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

const artists = [
  {
    name: "Taylor Swift",
    bio: "American singer-songwriter known for narrative songs",
    imageUrl: "https://example.com/taylor-swift.jpg",
    countryId: 1,
  },
  {
    name: "The Weeknd",
    bio: "Canadian singer and producer",
    imageUrl: "https://example.com/the-weeknd.jpg",
    countryId: 2,
  },
  {
    name: "Adele",
    bio: "British singer with powerful vocals",
    imageUrl: "https://example.com/adele.jpg",
    countryId: 3,
  },
  {
    name: "Tame Impala",
    bio: "Australian psychedelic music project",
    imageUrl: "https://example.com/tame-impala.jpg",
    countryId: 4,
  },
  {
    name: "Kraftwerk",
    bio: "German electronic music pioneers",
    imageUrl: "https://example.com/kraftwerk.jpg",
    countryId: 5,
  },
  {
    name: "Daft Punk",
    bio: "French electronic duo",
    imageUrl: "https://example.com/daft-punk.jpg",
    countryId: 6,
  },
  {
    name: "Andrea Bocelli",
    bio: "Italian tenor and songwriter",
    imageUrl: "https://example.com/andrea-bocelli.jpg",
    countryId: 7,
  },
  {
    name: "Rosalía",
    bio: "Spanish singer and performer",
    imageUrl: "https://example.com/rosalia.jpg",
    countryId: 8,
  },
  {
    name: "Anitta",
    bio: "Brazilian singer and rapper",
    imageUrl: "https://example.com/anitta.jpg",
    countryId: 9,
  },
  {
    name: "A.R. Rahman",
    bio: "Indian composer and singer",
    imageUrl: "https://example.com/ar-rahman.jpg",
    countryId: 10,
  },
  {
    name: "Yuki Kajiura",
    bio: "Japanese composer and musician",
    imageUrl: "https://example.com/yuki-kajiura.jpg",
    countryId: 11,
  },
  {
    name: "Jay Chou",
    bio: "Chinese singer and actor",
    imageUrl: "https://example.com/jay-chou.jpg",
    countryId: 12,
  },
  {
    name: "BTS",
    bio: "South Korean boy band",
    imageUrl: "https://example.com/bts.jpg",
    countryId: 13,
  },
  {
    name: "Natalia Lafourcade",
    bio: "Mexican singer-songwriter",
    imageUrl: "https://example.com/natalia-lafourcade.jpg",
    countryId: 14,
  },
];

async function load() {
  try {
    // create countries
    await prisma.country.createMany({
      data: countries,
      skipDuplicates: true,
    });
    // create artists
    await prisma.artist.createMany({
      data: artists,
      skipDuplicates: true,
    });
    console.log("Data seeded successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

load();
