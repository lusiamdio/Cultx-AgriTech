import type { CountryConfig } from "../types";

const sharedCrops = ["Maize", "Cassava", "Sorghum"];
const sharedMarkets = ["National wholesale markets", "Regional agricultural exchange"];
const sharedClimateZones = ["Tropical", "Semi-arid"];
const sharedRegulations = ["National agricultural standards", "AfCFTA trade requirements"];

const country = (
  code: string,
  name: string,
  flag: string,
  currency: string,
  currencySymbol: string,
  exchangeRateToUSD: number,
  primaryCrops: string[] = sharedCrops,
): CountryConfig => ({
  code, name, flag, currency, currencySymbol, exchangeRateToUSD,
  primaryCrops, majorMarkets: sharedMarkets, climateZones: sharedClimateZones, regulations: sharedRegulations,
});

// The project data directory was excluded by .gitignore and these source datasets
// were therefore missing from clean checkouts. Keep the country selector's full set
// of African territories available in both the root and src mirror trees.
export const AFRICAN_COUNTRIES: CountryConfig[] = [
  country("DZ", "Algeria", "🇩🇿", "DZD", "د.ج", 0.0074),
  country("AO", "Angola", "🇦🇴", "AOA", "Kz", 0.0011),
  country("BJ", "Benin", "🇧🇯", "XOF", "CFA", 0.0016),
  country("BW", "Botswana", "🇧🇼", "BWP", "P", 0.073),
  country("BF", "Burkina Faso", "🇧🇫", "XOF", "CFA", 0.0016),
  country("BI", "Burundi", "🇧🇮", "BIF", "FBu", 0.00035),
  country("CV", "Cabo Verde", "🇨🇻", "CVE", "$", 0.0091),
  country("CM", "Cameroon", "🇨🇲", "XAF", "FCFA", 0.0016),
  country("CF", "Central African Republic", "🇨🇫", "XAF", "FCFA", 0.0016),
  country("TD", "Chad", "🇹🇩", "XAF", "FCFA", 0.0016),
  country("KM", "Comoros", "🇰🇲", "KMF", "CF", 0.0022),
  country("CD", "Democratic Republic of the Congo", "🇨🇩", "CDF", "FC", 0.00035),
  country("CG", "Republic of the Congo", "🇨🇬", "XAF", "FCFA", 0.0016),
  country("CI", "Côte d'Ivoire", "🇨🇮", "XOF", "CFA", 0.0016),
  country("DJ", "Djibouti", "🇩🇯", "DJF", "Fdj", 0.0056),
  country("EG", "Egypt", "🇪🇬", "EGP", "E£", 0.020),
  country("GQ", "Equatorial Guinea", "🇬🇶", "XAF", "FCFA", 0.0016),
  country("ER", "Eritrea", "🇪🇷", "ERN", "Nfk", 0.0667),
  country("SZ", "Eswatini", "🇸🇿", "SZL", "E", 0.054),
  country("ET", "Ethiopia", "🇪🇹", "ETB", "Br", 0.0073, ["Coffee", "Teff", "Maize", "Wheat"]),
  country("GA", "Gabon", "🇬🇦", "XAF", "FCFA", 0.0016),
  country("GM", "The Gambia", "🇬🇲", "GMD", "D", 0.014),
  country("GH", "Ghana", "🇬🇭", "GHS", "GH₵", 0.067),
  country("GN", "Guinea", "🇬🇳", "GNF", "FG", 0.00012),
  country("GW", "Guinea-Bissau", "🇬🇼", "XOF", "CFA", 0.0016),
  country("KE", "Kenya", "🇰🇪", "KES", "KSh", 0.0077, ["Maize", "Tea", "Coffee", "Avocado"]),
  country("LS", "Lesotho", "🇱🇸", "LSL", "L", 0.054),
  country("LR", "Liberia", "🇱🇷", "LRD", "L$", 0.0051),
  country("LY", "Libya", "🇱🇾", "LYD", "ل.د", 0.21),
  country("MG", "Madagascar", "🇲🇬", "MGA", "Ar", 0.00022),
  country("MW", "Malawi", "🇲🇼", "MWK", "MK", 0.00058),
  country("ML", "Mali", "🇲🇱", "XOF", "CFA", 0.0016),
  country("MR", "Mauritania", "🇲🇷", "MRU", "UM", 0.025),
  country("MU", "Mauritius", "🇲🇺", "MUR", "₨", 0.022),
  country("MA", "Morocco", "🇲🇦", "MAD", "د.م.", 0.10),
  country("MZ", "Mozambique", "🇲🇿", "MZN", "MT", 0.0157),
  country("NA", "Namibia", "🇳🇦", "NAD", "N$", 0.054),
  country("NE", "Niger", "🇳🇪", "XOF", "CFA", 0.0016),
  country("NG", "Nigeria", "🇳🇬", "NGN", "₦", 0.00065, ["Maize", "Sorghum", "Cassava", "Sesame"]),
  country("RW", "Rwanda", "🇷🇼", "RWF", "FRw", 0.00077),
  country("ST", "São Tomé and Príncipe", "🇸🇹", "STN", "Db", 0.044),
  country("SN", "Senegal", "🇸🇳", "XOF", "CFA", 0.0016),
  country("SC", "Seychelles", "🇸🇨", "SCR", "₨", 0.073),
  country("SL", "Sierra Leone", "🇸🇱", "SLE", "Le", 0.044),
  country("SO", "Somalia", "🇸🇴", "SOS", "Sh.So.", 0.00175),
  country("ZA", "South Africa", "🇿🇦", "ZAR", "R", 0.054, ["Maize", "Wheat", "Soybeans", "Citrus"]),
  country("SS", "South Sudan", "🇸🇸", "SSP", "£", 0.00077),
  country("SD", "Sudan", "🇸🇩", "SDG", "ج.س.", 0.0017),
  country("TZ", "Tanzania", "🇹🇿", "TZS", "TSh", 0.00039),
  country("TG", "Togo", "🇹🇬", "XOF", "CFA", 0.0016),
  country("TN", "Tunisia", "🇹🇳", "TND", "د.ت", 0.32),
  country("UG", "Uganda", "🇺🇬", "UGX", "USh", 0.00027),
  country("ZM", "Zambia", "🇿🇲", "ZMW", "ZK", 0.038, ["Maize", "Soybeans", "Wheat", "Groundnuts"]),
  country("ZW", "Zimbabwe", "🇿🇼", "ZWG", "ZiG", 0.039),
];
