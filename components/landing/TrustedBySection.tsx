import React from "react";
import { motion } from "motion/react";

interface TopCompany {
  name: string;
  sector: string;
  headquarters: string;
}

const TOP_AFRICAN_AGRI_COMPANIES: TopCompany[] = [
  {
    name: "Dangote Sugar & Agro",
    sector: "Refining, Sugar Cultivation & Processing",
    headquarters: "Nigeria",
  },
  {
    name: "Kakuzi PLC",
    sector: "Avocado, Macadamia, Tea & Forestry",
    headquarters: "Kenya",
  },
  {
    name: "Illovo Sugar Africa",
    sector: "Sugarcane Production & Mill Off-Take",
    headquarters: "South Africa",
  },
  {
    name: "Sodecoton",
    sector: "Cotton Aggregation & Fiber Processing",
    headquarters: "Cameroon",
  },
  {
    name: "Flour Mills of Nigeria (FMN)",
    sector: "Grains, Milling, Pasta & Feed Mills",
    headquarters: "Nigeria",
  },
  {
    name: "Zambeef Products PLC",
    sector: "Cold Chain, Cropping, Grains & Feeds",
    headquarters: "Zambia",
  },
  {
    name: "Sasaby / SIFCA Group",
    sector: "Oil Palm, Natural Rubber & Agro-Industry",
    headquarters: "Côte d'Ivoire",
  },
  {
    name: "Cevital Agro-Industrie",
    sector: "Agro-Refining & Port Logistics",
    headquarters: "Algeria",
  },
];

export const TrustedBySection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="py-16 bg-[#080D10] border-y border-[#18232A] w-full"
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Section Header with Zoom In / Out Animation */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <motion.p
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase"
          >
            Institutional Trust & Wholesale Off-Take
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FDFBF7] tracking-tight mt-2"
          >
            Trusted by Africa's Top Agricultural Enterprises
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed"
          >
            Powering sovereign data infrastructure, commercial off-take contracts, and precision supply chain intelligence for the continent's leading producers, millers, and agribusiness corporations.
          </motion.p>
        </div>

        {/* Company Names Display Grid - Corner to Corner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {TOP_AFRICAN_AGRI_COMPANIES.map((company, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.88, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.04, y: -4, transition: { duration: 0.2 } }}
              className="p-4 sm:p-5 rounded-2xl bg-[#0E151A] border border-[#1D2A32] hover:border-[#14533C] transition-all flex flex-col justify-between group cursor-default shadow-sm"
            >
              <div>
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.4 }}
                  className="text-[10px] font-mono font-bold tracking-wider text-emerald-400/90 uppercase block mb-1"
                >
                  {company.headquarters}
                </motion.span>
                <motion.h3
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: 0.05 }}
                  className="text-sm font-extrabold text-white group-hover:text-emerald-200 transition-colors leading-snug"
                >
                  {company.name}
                </motion.h3>
              </div>
              <div className="pt-3 mt-3 border-t border-[#18232A]">
                <motion.span
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: 0.08 }}
                  className="text-[11px] text-slate-400 font-medium block leading-tight"
                >
                  {company.sector}
                </motion.span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sub-Metric Guarantee Bar with Zoom Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 pt-6 border-t border-[#141C22] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <motion.span
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              viewport={{ once: false, amount: 0.2 }}
            >
              Over 12.4M Metric Tonnes Under Digital Contract
            </motion.span>
          </div>
          <div className="flex items-center gap-2">
            <motion.span
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              viewport={{ once: false, amount: 0.2 }}
            >
              AfCFTA Protocol-Compliant Clearing
            </motion.span>
            <span>•</span>
            <motion.span
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              viewport={{ once: false, amount: 0.2 }}
            >
              Zero Data Leakage Sovereign Cloud Architecture
            </motion.span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
