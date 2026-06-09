import React, { useState } from 'react';
import { MessageSquare, ChevronRight, Share2, Check, FileDown } from 'lucide-react';

interface EquipmentDetailItem {
  label: string;
  value: React.ReactNode;
  hasAction?: boolean;
  actionText?: string;
  actionUrl?: string;
}

interface Equipment {
  id: string;
  title: string;
  reservationLink?: string;
  imageUrl: string;
  registrationNo: string;
  equipmentType: string;
  installationLocation: string;
  manager: string;
  lastModified: string;
  details: EquipmentDetailItem[];
}

// 1. 화면의 '틀(템플릿)' 역할을 하는 컴포넌트입니다. (props로 equipmentData를 받습니다)
const EquipmentDetails = ({ equipmentData }: { equipmentData: Equipment }) => {
  const [isCopied, setIsCopied] = useState(false);

  const openExternalLink = (url?: string) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: equipmentData.title,
          url: window.location.href
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  const renderDetailValue = (value: React.ReactNode) => {
    if (typeof value === 'string' && value.trim() === '') {
      return '-';
    }
    return value;
  };

  return (
    <div className="bg-[#F4F8FC] p-4 md:p-8 font-sans text-[#0F2740] print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto bg-white shadow-sm border border-[#C7D8E8] print:shadow-none print:border-none">
        
        {/* Top Section */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-[320px] shrink-0">
            <div className="aspect-[4/3] bg-white border border-[#D4E1EE] rounded overflow-hidden relative">
              <img 
                src={equipmentData.imageUrl} 
                alt={equipmentData.title} 
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex-1 flex flex-col justify-start">
            <h1 className="text-xl md:text-2xl font-bold text-[#003B5C] mb-6">
              {equipmentData.title}
            </h1>
            
            <div className="grid grid-cols-[180px_1fr] gap-y-3 text-sm md:text-base">
              <div className="text-[#4F6680] font-medium">Facility Reg. No.</div>
              <div className="text-[#0F2740]">{equipmentData.registrationNo || '-'}</div>
              
              <div className="text-[#4F6680] font-medium">Equipment Type</div>
              <div className="text-[#0F2740]">{equipmentData.equipmentType}</div>
              
              <div className="text-[#4F6680] font-medium">Installation Location</div>
              <div className="text-[#0F2740]">{equipmentData.installationLocation}</div>
              
              <div className="text-[#4F6680] font-medium">Manager</div>
              <div className="text-[#0F2740]">{equipmentData.manager || '-'}</div>
              
              <div className="text-[#4F6680] font-medium">Last Modified</div>
              <div className="text-[#0F2740]">{equipmentData.lastModified}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons (인쇄 및 PDF 저장 시에는 숨김 처리: print:hidden) */}
        <div className="print:hidden px-6 md:px-8 pb-6 flex flex-wrap gap-3 border-b border-[#D4E1EE]">
          <button 
            // 장비 데이터에 추가된 개별 링크(reservationLink)로 이동하도록 수정되었습니다.
            onClick={() => {
              openExternalLink(equipmentData.reservationLink);
            }}
            className="flex items-center gap-2 bg-[#2774AE] hover:bg-[#003B5C] text-white px-5 py-2.5 rounded text-sm font-medium transition-colors"
          >
            <MessageSquare size={16} />
            Go to Reservation & Consultation
          </button>

          <button 
            onClick={handleShare}
            className="flex items-center gap-2 bg-white hover:bg-[#EDF4FB] text-[#003B5C] border border-[#C7D8E8] px-4 py-2.5 rounded text-sm transition-colors w-[140px] justify-center"
          >
            {isCopied ? <Check size={16} className="text-[#B38700]" /> : <Share2 size={16} />}
            {isCopied ? "Link Copied!" : "Share Page"}
          </button>

          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-white hover:bg-[#EDF4FB] text-[#003B5C] border border-[#C7D8E8] px-4 py-2.5 rounded text-sm transition-colors"
          >
            <FileDown size={16} />
            Download PDF
          </button>
        </div>

        {/* Detailed Information Table */}
        <div className="px-6 md:px-8 pb-8 pt-4 print:px-0">
          <div className="border-t-2 border-[#003B5C]">
            {equipmentData.details.map((detail, index) => (
              <div 
                key={`${detail.label}-${index}`} 
                className="flex flex-col md:flex-row border-b border-[#DCE7F1] py-4 hover:bg-[#F5F9FD] transition-colors"
              >
                <div className="w-full md:w-[220px] shrink-0 text-[#4F6680] font-medium mb-1 md:mb-0 flex items-center md:px-4 text-sm md:text-base">
                  {detail.label}
                </div>
                <div className="flex-1 flex items-center text-[#0F2740] md:px-4 text-sm md:text-base">
                  {renderDetailValue(detail.value)}
                  
                  {detail.hasAction && (
                    <button 
                      onClick={() => openExternalLink(detail.actionUrl)}
                      className="ml-3 inline-flex items-center gap-1 text-sm text-[#003B5C] border border-[#C7D8E8] px-2 py-1 rounded bg-white hover:bg-[#EDF4FB]"
                    >
                      {detail.actionText}
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// 2. 전체 앱을 관리하는 메인 컴포넌트입니다.
export default function App() {
  // 여러 장비의 데이터를 배열(리스트) 형태로 관리합니다.
  const equipmentList: Equipment[] = [
    {
      id: "eq-001",
      title: "Universal Testing Machine (UTM)",
      reservationLink: "https://docs.google.com/spreadsheets/d/1XFGEF8JUsyux_otqzuMrG7StoY5sHcDhni5bf3rF4ds/edit?gid=0#gid=0", // 👈 1번 장비만의 구글 폼 주소
      imageUrl: "https://raw.githubusercontent.com/Junghwalim/lab-management-site/main/public/Universal-Testing-Machine.JPEG",
      registrationNo: "",
      equipmentType: "Mechanical Testing",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        {
          label: "Manufacturer | Model",
          value: "Instron | 5966",
          hasAction: true,
          actionText: "View Info",
          actionUrl: "https://www.instron.com/en/products/testing-systems/universal-testing-systems/low-force-universal-testing-systems/5900-series/"
        },
        { label: "Introduction", value: "This systems is designed to perform tensile, compression, flexure/bend, peel, tear, shear, and cyclic tests." },
        // 수정됨: <ul>(목록)과 <li>(항목) 태그를 사용하여 자동 줄바꿈 시 글자가 정렬되도록 했습니다.
        { label: "Specifications", value: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Machine Type: Dual-column electromechanical universal testing machine</li>
            <li>Maximum Load Capacity: 10 kN </li>
        </ul>
        ) },
        { label: "Applications", value: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Tensile strength and elastic modulus determination</li>
            <li>Compression testing</li>
            <li>Flexural strength and flexural modulus evaluation</li>
        </ul>
        ) },
        { label: "Sample Preparation", value: "-" },
         { label: "Precautions", value: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Please note that only tensile and flexural tests are currently available</li>
            <li>Training Required Before Use</li>
            <li>A personal flash drive is required to save and transfer data</li>
        </ul>
        ) },
      ]
    },
    {
      id: "eq-002",
      title: "Measuring Laser Microscope", // 두 번째 장비
      reservationLink: "https://docs.google.com/spreadsheets/d/14VcJqXzxVHm6u2HdeyrckEptXN9uCD7gZFJaF2aVBBk/edit?gid=0#gid=0", // 👈 2번 장비만의 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "",
      equipmentType: "Surface Analysis",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        {
          label: "Manufacturer | Model",
          value: "EVIDENT | OLYMPUS DSX2000",
          hasAction: true,
          actionText: "View Info",
          actionUrl: "https://evidentscientific.com/en/products/digital/dsx2000"
        },
        { label: "Introduction", value: "High-resolution confocal laser scanning microscope for 3D imaging of biological samples." },
        { label: "Specifications", value: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Lends:10x, 40x</li>
            <li>Software:PRECiV DSX</li>
        </ul>
        ) },
        { label: "Applications", value: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Surface Roughness</li>
            <li>Image acquisition</li>
        </ul>
        ) },
        { label: "Sample Preparation", value: "" },
        { label: "Precautions", value: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Training Required Before Use</li>
            <li>A personal flash drive is required to save and transfer data</li>
        </ul>
        ) },
      ]
    },
    {
      id: "eq-003",
      title: "Micro Vickers Hardness Tester", // 세 번째 장비 이름
      reservationLink: "https://docs.google.com/spreadsheets/d/1dW4IFfmej9GKyFNyh0Nq_ppU3gwgqgHtScnSsQfoqqs/edit?gid=0#gid=0", // 👈 3번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-01-000111",
      equipmentType: "Surface Analysis",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        {
          label: "Manufacturer | Model",
          value: "Phase 2 | 900-390 Series",
          hasAction: true,
          actionText: "View Info",
          actionUrl: "https://www.phase2plus.com/product/vickershardnesstesters-900-390/"
        },
        { label: "Introduction", value: "" },
        { label: "Specifications", value: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Test Forces: 0.098N(10g), 0.246(25g), 0.49N(50g), 0.98N(100g), 1.96N(200g), 2.94N(300g), 4.90N(500g), 9.80N(1000g)</li>
          </ul>
        ) },
        { label: "Applications", value: "Surface hardness test" },
        { label: "Sample Preparation", value: "" },
        { label: "Precautions", value: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Training Required Before Use</li>
            <li>A personal flash drive is required to save and transfer data</li>
        </ul>
        ) },
      ]
    },
    {
      id: "eq-004",
      title: "Fourier Transform Infrared (FT-IR)",
      reservationLink: "https://docs.google.com/spreadsheets/d/1TWtl0aAY1Mh3ffQFwRLK4huIUmXcUsFo_NG_pcshpo4/edit?gid=0#gid=0", // 👈 4번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "",
      equipmentType: "Chemical Analysis",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        { label: "Manufacturer | Model", value: "Thermo Scientific | Everest Diamond ATR Accessory for the Nicolet Summit Spectrometer", hasAction: true, actionText: "View Info", actionUrl: "https://www.thermofisher.com/order/catalog/product/IQLAADGAAGFAJAMBKN" },
        { label: "Introduction", value: "" },
        { label: "Specifications", value: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Crystal Type: Diamond(AR-coated)</li>
            <li>Type: Single-bounce ATR</li>
          </ul>
        ) },
        { label: "Applications", value: (
          <ul className="list-disc pl-5 space-y-1">
            <li>ATR-FTIR analysis of organic compounds in powder, solid, and liquid samples</li>
            <li>Degree of conversion</li>
          </ul>
        ) },
        { label: "Sample Preparation", value: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Powder samples: ≥ 2mg</li>
            <li>Liquid samples: ≥ 200 μL</li>
            <li>Flat specimens with dimensions ≥ 2 × 2 mm</li>
          </ul>
        ) },
        { label: "Precautions", value: (
          <ul className="list-disc pl-5 space-y-1">
            <li>Training Required Before Use</li>
            <li>A personal flash drive is required to save and transfer data</li>
        </ul>
        ) },
      ]
    },
    {
      id: "eq-005",
      title: "High-Performance Liquid Chromatography (HPLC)",
      reservationLink: "https://forms.gle/LINK_EQ_005", // 👈 5번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-03-000223",
      equipmentType: "Analytical Equipment",
      installationLocation: "Room 201, Chemistry Lab",
      manager: "Dr. Marie Curie",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "Agilent | 1260 Infinity II", hasAction: true, actionText: "View Info", actionUrl: "https://www.agilent.com" },
        { label: "Introduction", value: "Reliable and robust HPLC system for routine analysis." },
        { label: "Specifications", value: "Max Pressure: 600 bar. Flow range: 0.05 to 5 mL/min." },
        { label: "Applications", value: "Pharmaceuticals, food safety, environmental analysis." },
        { label: "Sample Preparation", value: "Filter samples through 0.22 µm syringe filter." },
        { label: "Precautions", value: "Use HPLC-grade solvents only. Degas all buffers." }
      ]
    },
    {
      id: "eq-006",
      title: "Nuclear Magnetic Resonance (NMR) Spectrometer",
      reservationLink: "https://forms.gle/LINK_EQ_006", // 👈 6번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-04-000334",
      equipmentType: "Analytical Equipment",
      installationLocation: "Room 105, NMR Center",
      manager: "Dr. Richard Ernst",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "Bruker | AVANCE NEO 600", hasAction: false },
        { label: "Introduction", value: "High-resolution NMR spectrometer for structural elucidation." },
        { label: "Specifications", value: "Frequency: 600 MHz. Magnet: 14.1 Tesla." },
        { label: "Applications", value: "Protein structure, organic synthesis confirmation." },
        { label: "Sample Preparation", value: "Dissolve sample in appropriate deuterated solvent." },
        { label: "Precautions", value: "Strictly adhere to the 5 Gauss safety line." }
      ]
    },
    {
      id: "eq-007",
      title: "Flow Cytometer",
      reservationLink: "https://forms.gle/LINK_EQ_007", // 👈 7번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-05-000445",
      equipmentType: "Bio Equipment",
      installationLocation: "Room 303, Cell Biology Lab",
      manager: "Dr. Hans Flu",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "BD Biosciences | FACSCelesta", hasAction: false },
        { label: "Introduction", value: "Multicolor flow cytometer for single-cell analysis." },
        { label: "Specifications", value: "Lasers: Blue (488nm), Red (640nm), Violet (405nm). Max 12 parameters." },
        { label: "Applications", value: "Immunophenotyping, cell cycle analysis, apoptosis assays." },
        { label: "Sample Preparation", value: "Single-cell suspension required. Filter through 40µm mesh." },
        { label: "Precautions", value: "Ensure samples are free of clumps to prevent clogs." }
      ]
    },
    {
      id: "eq-008",
      title: "X-Ray Diffractometer (XRD)",
      reservationLink: "https://forms.gle/LINK_EQ_008", // 👈 8번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-06-000556",
      equipmentType: "Analytical Equipment",
      installationLocation: "Room 108, Materials Lab",
      manager: "Dr. Max von Laue",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "Rigaku | SmartLab", hasAction: false },
        { label: "Introduction", value: "High-resolution X-ray diffractometer for crystal structure analysis." },
        { label: "Specifications", value: "Source: Cu K-alpha. Detector: 1D silicon strip detector." },
        { label: "Applications", value: "Phase identification, crystal structure, thin film analysis." },
        { label: "Sample Preparation", value: "Powder samples must be finely ground." },
        { label: "Precautions", value: "Radiation safety badge mandatory for operation." }
      ]
    },
    {
      id: "eq-009",
      title: "Mass Spectrometer (LC-MS/MS)",
      reservationLink: "https://forms.gle/LINK_EQ_009", // 👈 9번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-07-000667",
      equipmentType: "Analytical Equipment",
      installationLocation: "Room 202, Mass Spec Core",
      manager: "Dr. J.J. Thomson",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "Thermo Fisher | Q Exactive", hasAction: false },
        { label: "Introduction", value: "Hybrid quadrupole-Orbitrap mass spectrometer." },
        { label: "Specifications", value: "Resolution: up to 140,000. Mass range: m/z 50 to 6,000." },
        { label: "Applications", value: "Proteomics, metabolomics, targeted quantitation." },
        { label: "Sample Preparation", value: "Desalt samples before injection." },
        { label: "Precautions", value: "Avoid non-volatile salts in buffers (e.g., PBS)." }
      ]
    },
    {
      id: "eq-010",
      title: "Transmission Electron Microscope (TEM)",
      reservationLink: "https://forms.gle/LINK_EQ_010", // 👈 10번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-08-000778",
      equipmentType: "Imaging Equipment",
      installationLocation: "Room 101, EM Lab",
      manager: "Dr. Ernst Ruska",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "FEI | Tecnai G2 Spirit", hasAction: false },
        { label: "Introduction", value: "High-contrast TEM for biological and polymer samples." },
        { label: "Specifications", value: "Accelerating voltage: 20-120 kV. Resolution: 0.34 nm." },
        { label: "Applications", value: "Cellular ultrastructure, nanoparticle imaging." },
        { label: "Sample Preparation", value: "Samples must be ultra-thin (<100 nm) on copper grids." },
        { label: "Precautions", value: "Grids must be handled with extreme care." }
      ]
    },
    {
      id: "eq-011",
      title: "Real-Time PCR System",
      reservationLink: "https://forms.gle/LINK_EQ_011", // 👈 11번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-09-000889",
      equipmentType: "Bio Equipment",
      installationLocation: "Room 310, Genomics Lab",
      manager: "Dr. Kary Mullis",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "Applied Biosystems | QuantStudio 5", hasAction: false },
        { label: "Introduction", value: "Advanced real-time PCR system for gene expression analysis." },
        { label: "Specifications", value: "96-well block. 6 decoupled excitation/emission filters." },
        { label: "Applications", value: "Gene expression, genotyping, pathogen detection." },
        { label: "Sample Preparation", value: "Ensure high-quality RNA/DNA extraction." },
        { label: "Precautions", value: "Always use optically clear PCR plates and seals." }
      ]
    },
    {
      id: "eq-012",
      title: "Atomic Force Microscope (AFM)",
      reservationLink: "https://forms.gle/LINK_EQ_012", // 👈 12번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-10-000990",
      equipmentType: "Imaging Equipment",
      installationLocation: "Room 112, Nanotech Lab",
      manager: "Dr. Gerd Binnig",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "Bruker | Dimension Icon", hasAction: false },
        { label: "Introduction", value: "High-resolution AFM for nanoscale surface topography." },
        { label: "Specifications", value: "Scan size: up to 90 µm. Z-range: 10 µm." },
        { label: "Applications", value: "Surface roughness, phase imaging, mechanical properties." },
        { label: "Sample Preparation", value: "Samples must be firmly mounted on metal pucks." },
        { label: "Precautions", value: "Vibration isolation table must be active during scanning." }
      ]
    },
    {
      id: "eq-013",
      title: "Fourier Transform Infrared (FTIR) Spectrometer",
      reservationLink: "https://forms.gle/LINK_EQ_013", // 👈 13번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-11-001101",
      equipmentType: "Analytical Equipment",
      installationLocation: "Room 205, Chemistry Lab",
      manager: "Dr. Albert Michelson",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "Thermo Scientific | Nicolet iS50", hasAction: false },
        { label: "Introduction", value: "Versatile FTIR spectrometer with ATR accessory." },
        { label: "Specifications", value: "Spectral range: 7800 to 350 cm-1. Resolution: 0.09 cm-1." },
        { label: "Applications", value: "Polymer identification, chemical functional group analysis." },
        { label: "Sample Preparation", value: "Solid or liquid samples; ATR requires minimal prep." },
        { label: "Precautions", value: "Clean ATR crystal thoroughly between samples." }
      ]
    },
    {
      id: "eq-014",
      title: "Gas Chromatography-Mass Spectrometry (GC-MS)",
      reservationLink: "https://forms.gle/LINK_EQ_014", // 👈 14번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-12-001212",
      equipmentType: "Analytical Equipment",
      installationLocation: "Room 208, Environmental Lab",
      manager: "Dr. Archer Martin",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "Agilent | 7890B GC / 5977B MSD", hasAction: false },
        { label: "Introduction", value: "Robust GC-MS system for volatile compound analysis." },
        { label: "Specifications", value: "Mass range: 1.6 to 1050 amu. EI ion source." },
        { label: "Applications", value: "Environmental contaminants, forensics, flavor analysis." },
        { label: "Sample Preparation", value: "Samples must be volatile and thermally stable." },
        { label: "Precautions", value: "Do not inject water or non-volatile salts." }
      ]
    },
    {
      id: "eq-015",
      title: "Ultracentrifuge",
      reservationLink: "https://forms.gle/LINK_EQ_015", // 👈 15번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-01-001323",
      equipmentType: "Bio Equipment",
      installationLocation: "Room 305, Biochemistry Lab",
      manager: "Dr. Theodor Svedberg",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "Beckman Coulter | Optima XE-90", hasAction: false },
        { label: "Introduction", value: "Floor-standing ultracentrifuge for high-speed separations." },
        { label: "Specifications", value: "Max Speed: 90,000 RPM. Max RCF: >800,000 x g." },
        { label: "Applications", value: "Virus isolation, exosome purification, density gradients." },
        { label: "Sample Preparation", value: "Tubes must be balanced precisely (within 0.01g)." },
        { label: "Precautions", value: "Select the correct rotor code before starting the run." }
      ]
    },
    {
      id: "eq-016",
      title: "Lyophilizer (Freeze Dryer)",
      reservationLink: "https://forms.gle/LINK_EQ_016", // 👈 16번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-02-001434",
      equipmentType: "Prep Equipment",
      installationLocation: "Room 308, Prep Room",
      manager: "Dr. Freeze",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "Labconco | FreeZone 4.5L", hasAction: false },
        { label: "Introduction", value: "Benchtop freeze dryer for sample preservation." },
        { label: "Specifications", value: "Collector Temperature: -50°C. Ice holding capacity: 4.5L." },
        { label: "Applications", value: "Preservation of biologicals, drying heat-sensitive materials." },
        { label: "Sample Preparation", value: "Samples must be pre-frozen completely at -80°C." },
        { label: "Precautions", value: "Ensure vacuum seal is tight; do not overload." }
      ]
    },
    {
      id: "eq-017",
      title: "Particle Size Analyzer",
      reservationLink: "https://forms.gle/LINK_EQ_017", // 👈 17번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-03-001545",
      equipmentType: "Analytical Equipment",
      installationLocation: "Room 110, Materials Lab",
      manager: "Dr. Nano",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "Malvern | Zetasizer Nano ZS", hasAction: false },
        { label: "Introduction", value: "DLS instrument for particle size and zeta potential measurement." },
        { label: "Specifications", value: "Size range: 0.3 nm to 10 µm. Temp range: 0°C to 90°C." },
        { label: "Applications", value: "Nanoparticle sizing, emulsion stability, protein aggregation." },
        { label: "Sample Preparation", value: "Dilute samples appropriately to avoid multiple scattering." },
        { label: "Precautions", value: "Cuvettes must be clean and free of scratches." }
      ]
    },
    {
      id: "eq-018",
      title: "Microplate Reader",
      reservationLink: "https://forms.gle/LINK_EQ_018", // 👈 18번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-04-001656",
      equipmentType: "Bio Equipment",
      installationLocation: "Room 312, Assay Lab",
      manager: "Dr. Reader",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "Tecan | Spark", hasAction: false },
        { label: "Introduction", value: "Multimode microplate reader for various assays." },
        { label: "Specifications", value: "Modes: Absorbance, Fluorescence, Luminescence." },
        { label: "Applications", value: "ELISA, cell viability (MTT), nucleic acid quantification." },
        { label: "Sample Preparation", value: "Use compatible 96-well or 384-well plates." },
        { label: "Precautions", value: "Avoid bubbles in wells as they interfere with readings." }
      ]
    },
    {
      id: "eq-019",
      title: "Raman Spectrometer",
      reservationLink: "https://forms.gle/LINK_EQ_019", // 👈 19번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-05-001767",
      equipmentType: "Analytical Equipment",
      installationLocation: "Room 210, Optics Lab",
      manager: "Dr. C.V. Raman",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "Horiba | LabRAM HR Evolution", hasAction: false },
        { label: "Introduction", value: "High-resolution confocal Raman microscope." },
        { label: "Specifications", value: "Lasers: 532 nm, 785 nm. Spatial resolution: < 1 µm." },
        { label: "Applications", value: "Carbon nanomaterials (graphene, CNTs), mineralogy." },
        { label: "Sample Preparation", value: "Little to no prep required; can measure through glass." },
        { label: "Precautions", value: "Avoid high laser power on delicate/dark samples to prevent burning." }
      ]
    },
    {
      id: "eq-020",
      title: "Biosafety Cabinet (BSC)",
      reservationLink: "https://forms.gle/LINK_EQ_020", // 👈 20번 장비 구글 폼 주소
      imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1000&auto=format&fit=crop",
      registrationNo: "NFEC-2026-06-001878",
      equipmentType: "Safety Equipment",
      installationLocation: "Room 315, Tissue Culture",
      manager: "Dr. Safe",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "Thermo Scientific | 1300 Series A2", hasAction: false },
        { label: "Introduction", value: "Class II, Type A2 biological safety cabinet." },
        { label: "Specifications", value: "Width: 4 ft. HEPA filter efficiency: 99.995%." },
        { label: "Applications", value: "Sterile cell culture, handling biological agents." },
        { label: "Sample Preparation", value: "Disinfect all items with 70% ethanol before placing inside." },
        { label: "Precautions", value: "Do not block the front or rear air grilles." }
      ]
    }
  ];

  // 현재 선택된 장비의 ID를 저장하는 상태 (기본값은 첫 번째 장비의 ID)
  const [selectedId, setSelectedId] = useState(equipmentList[0].id);

  // 선택된 장비의 전체 데이터를 찾습니다.
  const currentEquipment = equipmentList.find(eq => eq.id === selectedId) || equipmentList[0];

  return (
    <div className="min-h-screen bg-[#EAF1F8] print:bg-white flex flex-col md:flex-row w-full">
      {/* 1. 모바일용 드롭다운 메뉴 (화면이 작을 때만 상단에 나타남, 인쇄 시 숨김) */}
      <div className="md:hidden print:hidden bg-[#003B5C] p-4 border-b border-[#002844] sticky top-0 z-10 shadow-sm w-full">
        <label className="block text-xs font-bold text-[#D8E6F3] mb-2 uppercase tracking-wider">
          Select Equipment
        </label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full border border-[#C7D8E8] rounded-md p-3 text-[#0F2740] bg-white font-medium focus:outline-none focus:ring-2 focus:ring-[#FFD100]"
        >
          {equipmentList.map(eq => (
            <option key={eq.id} value={eq.id}>{eq.title}</option>
          ))}
        </select>
      </div>

      {/* 2. PC용 사이드바 메뉴 (화면이 클 때만 왼쪽에 고정됨, 인쇄 시 숨김) */}
      <div className="hidden md:flex print:hidden flex-col w-64 lg:w-72 bg-[#F7FAFD] border-r border-[#C7D8E8] h-screen sticky top-0 overflow-y-auto shrink-0">
        <div className="p-6 border-b border-[#C7D8E8] bg-[#003B5C]">
          <h2 className="font-bold text-white text-lg">Equipment List</h2>
          <p className="text-sm text-[#FFD100] mt-1">Total {equipmentList.length} items</p>
        </div>
        <div className="flex flex-col p-3 gap-1">
          {equipmentList.map(eq => (
            <button
              key={eq.id}
              onClick={() => setSelectedId(eq.id)}
              className={`text-left px-4 py-3 rounded-lg transition-all text-sm font-medium border-l-4 ${
                selectedId === eq.id 
                  ? 'bg-[#2774AE] text-white shadow-md border-[#FFD100]' // 선택된 장비는 파란색으로 눈에 띄게 표시
                  : 'text-[#003B5C] border-transparent hover:bg-[#E8F1F8] hover:text-[#002844]' // 선택되지 않은 장비
              }`}
            >
              {eq.title}
            </button>
          ))}
        </div>
      </div>

      {/* 3. 장비 상세 정보 화면 (오른쪽 넓은 영역) */}
      <div className="flex-1 overflow-y-auto w-full">
        <EquipmentDetails equipmentData={currentEquipment} />
      </div>
    </div>
  );
}
