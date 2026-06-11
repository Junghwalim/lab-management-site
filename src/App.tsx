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
            <div className="aspect-[4/3] bg-[#EDF4FB] border border-[#D4E1EE] rounded overflow-hidden relative">
              <img
                src={
                  equipmentData.imageUrl.startsWith('http')
                    ? equipmentData.imageUrl
                    : `${import.meta.env.BASE_URL}${equipmentData.imageUrl.replace(/^\//, '')}`
                }
                alt={equipmentData.title}
                className="w-full h-full object-contain bg-gray-100"
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
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Machine Type: Dual-column electromechanical universal testing machine</li>
              <li>Maximum Load Capacity: 10 kN </li>
            </ul>
          )
        },
        {
          label: "Applications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Tensile strength and elastic modulus determination</li>
              <li>Compression testing</li>
              <li>Flexural strength and flexural modulus evaluation</li>
            </ul>
          )
        },
        { label: "Sample Preparation", value: "-" },
        {
          label: "Precautions", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Please note that only tensile and flexural tests are currently available</li>
              <li>Training Required Before Use</li>
              <li>A personal flash drive is required to save and transfer data</li>
            </ul>
          )
        },
      ]
    },
    {
      id: "eq-002",
      title: "Measuring Laser Microscope", // 두 번째 장비
      reservationLink: "https://docs.google.com/spreadsheets/d/14VcJqXzxVHm6u2HdeyrckEptXN9uCD7gZFJaF2aVBBk/edit?gid=0#gid=0", // 👈 2번 장비만의 구글 폼 주소
      imageUrl: "https://raw.githubusercontent.com/Junghwalim/lab-management-site/main/public/Measuring-Laser-Microscope.JPEG",
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
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Lends:10x, 40x</li>
              <li>Software:PRECiV DSX</li>
            </ul>
          )
        },
        {
          label: "Applications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Surface Roughness</li>
              <li>Image acquisition</li>
            </ul>
          )
        },
        { label: "Sample Preparation", value: "" },
        {
          label: "Precautions", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Training Required Before Use</li>
              <li>A personal flash drive is required to save and transfer data</li>
            </ul>
          )
        },
      ]
    },
    {
      id: "eq-003",
      title: "Micro Vickers Hardness Tester", // 세 번째 장비 이름
      reservationLink: "https://docs.google.com/spreadsheets/d/1dW4IFfmej9GKyFNyh0Nq_ppU3gwgqgHtScnSsQfoqqs/edit?gid=0#gid=0", // 👈 3번 장비 구글 폼 주소
      imageUrl: "https://raw.githubusercontent.com/Junghwalim/lab-management-site/main/public/Micro-Vickers-Hardness-Tester.JPEG",
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
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Test Forces: 0.098N(10g), 0.246(25g), 0.49N(50g), 0.98N(100g), 1.96N(200g), 2.94N(300g), 4.90N(500g), 9.80N(1000g)</li>
            </ul>
          )
        },
        { label: "Applications", value: "Surface hardness test" },
        { label: "Sample Preparation", value: "" },
        {
          label: "Precautions", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Training Required Before Use</li>
              <li>A personal flash drive is required to save and transfer data</li>
            </ul>
          )
        },
      ]
    },
    {
      id: "eq-004",
      title: "Fourier Transform Infrared (FT-IR)",
      reservationLink: "https://docs.google.com/spreadsheets/d/1TWtl0aAY1Mh3ffQFwRLK4huIUmXcUsFo_NG_pcshpo4/edit?gid=0#gid=0", // 👈 4번 장비 구글 폼 주소
      imageUrl: "https://raw.githubusercontent.com/Junghwalim/lab-management-site/main/public/FT-IR.JPEG",
      registrationNo: "",
      equipmentType: "Chemical Analysis",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        { label: "Manufacturer | Model", value: "Thermo Scientific | Everest Diamond ATR Accessory for the Nicolet Summit Spectrometer", hasAction: true, actionText: "View Info", actionUrl: "https://www.thermofisher.com/order/catalog/product/IQLAADGAAGFAJAMBKN" },
        { label: "Introduction", value: "High-performance Nicolet Summit FTIR spectrometer equipped with the monolithic Everest Diamond ATR accessory for rapid and non-destructive chemical identification without sample preparation." },
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Crystal Type: Diamond(AR-coated)</li>
              <li>Type: Single-bounce ATR</li>
            </ul>
          )
        },
        {
          label: "Applications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>ATR-FTIR analysis of organic compounds in powder, solid, and liquid samples</li>
              <li>Degree of conversion</li>
            </ul>
          )
        },
        {
          label: "Sample Preparation", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Powder samples: ≥ 2mg</li>
              <li>Liquid samples: ≥ 200 μL</li>
              <li>Flat specimens with dimensions ≥ 2 × 2 mm</li>
            </ul>
          )
        },
        {
          label: "Precautions", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Training Required Before Use</li>
              <li>A personal flash drive is required to save and transfer data</li>
            </ul>
          )
        },
      ]
    },
    {
      id: "eq-005",
      title: "Optical Tensiometer",
      reservationLink: "https://forms.gle/LINK_EQ_005", // 👈 5번 장비 구글 폼 주소
      imageUrl: "https://raw.githubusercontent.com/Junghwalim/lab-management-site/main/public/Optical-Tensiometers.JPEG",
      registrationNo: "",
      equipmentType: "Surface Analysis",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "Biolin Scientific | Attension Theta Lite", hasAction: true, actionText: "View Info", actionUrl: "https://www.biolinscientific.com/attension/optical-tensiometers/theta-lite" },
        { label: "Introduction", value: "Compact and user-friendly optical tensiometer for characterizing surface properties such as contact angle, surface free energy, and interfacial tension." },
        { label: "Specifications", value: "Camera: 1.3 MP USB 3.0 digital camera, LED light source. Measuring range: 0 to 180° contact angle, 0.01 to 2000 mN/m surface tension." },
        { label: "Applications", value: "Wettability and adhesion studies, surface free energy calculation, cleanliness monitoring, and quality control in packaging/coatings." },
        { label: "Sample Preparation", value: "Substrate surfaces must be thoroughly clean, flat, and dust-free. Prepare standard probe liquids." },
        {
          label: "Precautions", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Training Required Before Use</li>
              <li>A personal flash drive is required to save and transfer data</li>
            </ul>
          )
        }
      ]
    },
    {
      id: "eq-021",
      title: "Shear Bond Tester",
      reservationLink: "https://forms.gle/LINK_EQ_021", // 👈 21번 장비 구글 폼 주소
      imageUrl: "Shear-Bond-Tester.JPEG",
      registrationNo: "",
      equipmentType: "Mechanical Testing",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "2026-06-08",
      details: [
        {
          label: "Manufacturer | Model",
          value: "Ultradent | UltraTester",
          hasAction: true,
          actionText: "View Info",
          actionUrl: "https://www.ultradent.com/products/categories/equipment/testing-equipment/ultratester"
        },
        { label: "Introduction", value: "Motorized, precision testing machine designed specifically for measuring and comparing the shear bond strength of dental and orthodontic adhesives." },
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Load Capacity: Up to 750 lbs (340 kg)</li>
              <li>Testing Method: Notched-edge shear testing (adheres to ISO Standard 29022)</li>
              <li>Speed Range: 0.1 to 25 mm/min (adjustable)</li>
              <li>Testing Modes: Tension and compression testing</li>
              <li>Precision: Shear notch tolerances within < ±5 microns</li>
            </ul>
          )
        },
        {
          label: "Applications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Measuring shear bond strength of dental adhesives, composites, and orthodontic brackets</li>
              <li>Comparing performance between different bonding agents and techniques</li>
              <li>Compressive strength testing of small dental restoration specimens</li>
            </ul>
          )
        },
        {
          label: "Sample Preparation", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Prepare dentin/enamel substrates using the specific bonding clamps and mold inserts</li>
              <li>Cure dental composites precisely using standard mold dimensions</li>
              <li>Securely clamp sample base in the test base holder to align shear notch before test</li>
            </ul>
          )
        },
        {
          label: "Precautions", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Training Required Before Use</li>
              <li>Ensure proper alignment of crosshead to avoid peeling force instead of shear force</li>
              <li>Do not exceed safety limits of testing accessories</li>
            </ul>
          )
        }
      ]
    },
    {
      id: "eq-006",
      title: "Micro Tensile Tester",
      reservationLink: "https://forms.gle/LINK_EQ_006", // 👈 6번 장비 구글 폼 주소
      imageUrl: "https://raw.githubusercontent.com/Junghwalim/lab-management-site/main/public/Micro-Tensile-Tester.JPEG",
      registrationNo: "",
      equipmentType: "Mechanical Testing",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "2026-06-08",
      details: [
        { label: "Manufacturer | Model", value: "Mecmesin | CFG+ 500N", hasAction: true, actionText: "View Info", actionUrl: "https://www.mecmesin.com" },
        { label: "Introduction", value: "Compact digital force gauge designed for basic tension and compression testing up to 500 N." },
        { label: "Specifications", value: "Capacity: 500 N. Resolution: 0.5 N. Accuracy: ±0.5% of full scale. RS232 data output." },
        { label: "Applications", value: "Handheld tensile and compression measurements, basic quality control tests, and integration with manual/motorized test stands." },
        { label: "Sample Preparation", value: "Ensure sample shape is compatible with tension hooks, extension rods, or compression plates. Properly align sample axis." },
        {
          label: "Precautions", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Training Required Before Use</li>
              <li>A personal flash drive is required to save and transfer data</li>
            </ul>
          )
        }
      ]
    },
    {
      id: "eq-007",
      title: "ElectroForce Mechanical Test Instrument",
      reservationLink: "https://forms.gle/LINK_EQ_007", // 👈 7번 장비 구글 폼 주소
      imageUrl: "https://raw.githubusercontent.com/Junghwalim/lab-management-site/main/public/ElectroForce-Mechanical-Test-Instrument.JPEG",
      registrationNo: "",
      equipmentType: "Mechanical Testing",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "2026-06-08",
      details: [
        {
          label: "Manufacturer | Model",
          value: "TA Instruments | TM ElectroForce 3300 Axial Tabletop",
          hasAction: true,
          actionText: "View Info",
          actionUrl: "https://www.tainstruments.com/3330-system/"
        },
        { label: "Introduction", value: "Electrodynamic test instrument designed for mechanical fatigue, strength, and durability characterization of materials, components, and biomaterials." },
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Maximum force: up to 3,000 N</li>
              <li>Frequency range: static to 100 Hz</li>
              <li>Compact tabletop configuration</li>
            </ul>
          )
        },
        {
          label: "Applications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Fatigue and durability testing of biomaterials and medical devices</li>
              <li>Characterization of engineering materials (polymers, elastomers)</li>
            </ul>
          )
        },
        { label: "Sample Preparation", value: "" },
        {
          label: "Precautions", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Training Required Before Use</li>
              <li>A personal flash drive is required to save and transfer data</li>
            </ul>
          )
        }
      ]
    },
    {
      id: "eq-008",
      title: "Shaking Incubator",
      reservationLink: "https://forms.gle/LINK_EQ_008", // 👈 8번 장비 구글 폼 주소
      imageUrl: "Shaking-Incubator.JPEG",
      registrationNo: "",
      equipmentType: "",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        {
          label: "Manufacturer | Model",
          value: "Benchmark Scientific | Incu-Shaker Mini (H1001-M)",
          hasAction: true,
          actionText: "View Info",
          actionUrl: "https://www.benchmarkscientific.com/product/h1001-m/"
        },
        { label: "Introduction", value: "Extremely compact shaking incubator featuring Touch Screen control over time, speed and temperature." },
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Temperature Range: Ambient +5°C to 70°C</li>
              <li>Shaking Speed Range: 30 to 300 rpm</li>
              <li>Shaking Orbit: 19 mm (3/4") orbit for aeration and mixing</li>
              <li>Touch Screen control over time, speed and temperature</li>
              <li>Instantly exchange flask clamps with MAGic Clamp™ accessories</li>
            </ul>
          )
        },
        {
          label: "Applications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Aeration and mixing of cell cultures</li>
              <li>Microbial culture incubation</li>
              <li>General mixing and incubation applications</li>
            </ul>
          )
        },
        {
          label: "Precautions", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Reservation required for long-term use</li>
            </ul>
          )
        }
      ]
    },
    {
      id: "eq-009",
      title: "Wet Trimmer",
      reservationLink: "https://forms.gle/LINK_EQ_009", // 👈 9번 장비 구글 폼 주소
      imageUrl: "Wet-Trimer.JPEG",
      registrationNo: "",
      equipmentType: "",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        {
          label: "Manufacturer | Model",
          value: "Renfert | MT3",
          hasAction: true,
          actionText: "View Info",
          actionUrl: "https://www.renfert.com/us-en/products/equipment/dental-trimmers/mt3f"
        },
        { label: "Introduction", value: "High-performance wet trimmer designed for efficient plaster model trimming in dental laboratories." },
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Power: 1,300 W (1.74 hp)</li>
              <li>Trimming angle adjustment: 90° and 98°</li>
              <li>Trimming Disc Diameter: 234 mm (approx. 10 inches)</li>
              <li>Compact design with 10° inclination for optimal model view</li>
              <li>Safety switch stops motor and water supply when door is opened</li>
            </ul>
          )
        },
        {
          label: "Applications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Trimming and shaping of plaster dental models</li>
              <li>Orthodontic model preparation (with optional ORTHO guide)</li>
            </ul>
          )
        },
        { label: "Precautions", value: "" }
      ]
    },
    {
      id: "eq-010",
      title: "Vortex Mixer",
      reservationLink: "https://forms.gle/LINK_EQ_010", // 👈 10번 장비 구글 폼 주소
      imageUrl: "Vortex-Mixer.JPEG",
      registrationNo: "",
      equipmentType: "",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        {
          label: "Manufacturer | Model",
          value: "Corning | LSE Vortex Mixer",
          hasAction: true,
          actionText: "View Info",
          actionUrl: "https://www.fishersci.com/shop/products/corning-lse-vortex-mixer-5/10320807"
        },
        { label: "Introduction", value: "Variable speed vortex mixer providing fast, efficient mixing with minimal vibration." },
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Speed Range: 0 to 3,400 rpm (120V Model)</li>
              <li>Mixing Modes: Touch (activation by pressure) or Continuous</li>
              <li>Compact design: 5.5 x 6.3 x 5.1 in (14 x 16 x 13 cm)</li>
              <li>Heavy metal base and rubber feet to prevent walking</li>
            </ul>
          )
        },
        {
          label: "Applications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Fast mixing of microtubes and centrifuge tubes</li>
              <li>Vigorous agitation or gentle mixing of laboratory samples</li>
            </ul>
          )
        },
        { label: "Precautions", value: "" }
      ]
    },
    {
      id: "eq-011",
      title: "Hot Plate Stirrer",
      reservationLink: "https://forms.gle/LINK_EQ_011", // 👈 11번 장비 구글 폼 주소
      imageUrl: "Hot-Plate-Stirrer.JPEG",
      registrationNo: "",
      equipmentType: "",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        {
          label: "Manufacturer | Model",
          value: "Fisher Scientific | Isotemp Stirring Hotplate (SP88857204)",
          hasAction: true,
          actionText: "View Info",
          actionUrl: "https://www.fishersci.com/shop/products/fisher-scientific-isotemp-stirring-hotplate-2/SP88857204"
        },
        { label: "Introduction", value: "Advanced laboratory stirring hotplate featuring precise digital temperature control, slow-speed stirring, and a HOT TOP safety warning system." },
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Top Plate Material: Aluminum</li>
              <li>Top Plate Dimensions: 7.25 x 7.25 in.</li>
              <li>Temperature Range: Ambient to 300°C (adjustable in 1°C increments)</li>
              <li>Stirring Speed Range: 50 to 1500 rpm</li>
              <li>Electrical: 100-120V, 50/60Hz, US-style plug</li>
            </ul>
          )
        },
        {
          label: "Applications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Simultaneous heating and magnetic stirring of laboratory liquid samples</li>
              <li>Precise temperature-controlled chemical reactions and solution preparation</li>
              <li>Slow-speed stirring applications for delicate samples</li>
            </ul>
          )
        },
        { label: "Precautions", value: "" }
      ]
    },
    {
      id: "eq-012",
      title: "Scale",
      reservationLink: "https://forms.gle/LINK_EQ_012", // 👈 12번 장비 구글 폼 주소
      imageUrl: "Scale.JPEG",
      registrationNo: "",
      equipmentType: "",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        {
          label: "Manufacturer | Model",
          value: "A&D Weighing | Newton EJ-200",
          hasAction: true,
          actionText: "View Info",
          actionUrl: "https://weighing.andonline.com/product/newton-ej-series-portable-balances-ej-200/"
        },
        { label: "Introduction", value: "High-performance portable precision balance designed for accurate, quick, and reliable weighing in laboratory, educational, and industrial environments." },
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Weighing Capacity: 210 g</li>
              <li>Readability: 0.01 g</li>
              <li>Repeatability: 0.01 g</li>
              <li>Linearity: ±0.01 g</li>
              <li>Weighing Pan Dimensions: 110 mm Ø (hygienic stainless steel)</li>
              <li>Stabilization Time: ~1 second</li>
              <li>Calibration: Full digital external calibration (200 g weight required)</li>
              <li>Power Supply: AC Adapter (included) or 4 x AA batteries</li>
            </ul>
          )
        },
        {
          label: "Applications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Precision weighing of chemical reagents, samples, and materials</li>
              <li>Parts counting with Automatic Counting Accuracy Improvement (ACAI)</li>
              <li>Percentage weighing and comparator functions</li>
              <li>Density determination and specific gravity calculation</li>
            </ul>
          )
        },
        { label: "Precautions", value: "" }
      ]
    },
    {
      id: "eq-013",
      title: "Low Speed Saw",
      reservationLink: "https://forms.gle/LINK_EQ_013", // 👈 13번 장비 구글 폼 주소
      imageUrl: "Low-Speed-Saw.JPEG",
      registrationNo: "",
      equipmentType: "",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        {
          label: "Manufacturer | Model",
          value: "Buehler | IsoMet Low Speed Precision Cutter",
          hasAction: true,
          actionText: "View Info",
          actionUrl: "https://www.buehler.com/products/sectioning/precision-cutters/isomet-low-speed-precision-cutter/"
        },
        { label: "Introduction", value: "Precision tabletop sectioning saw designed for cutting various materials with minimal deformation using gravity-fed force." },
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Speed Range: 0 to 300 RPM (variable)</li>
              <li>Maximum Blade Diameter: 5 in (127 mm)</li>
              <li>Cutting Capacity: Up to 1.5 in (38 mm) diameter</li>
              <li>Feed System: Gravity-fed with adjustable loading weights (up to 600 g)</li>
              <li>Precision Positioning: Built-in micrometer for cross-feed adjustments</li>
              <li>Motor Power: 1/50 HP (approx. 15 W) DC motor</li>
            </ul>
          )
        },
        {
          label: "Applications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Delicate sectioning of metals, ceramics, rocks, and bone samples</li>
              <li>Precision cutting with minimal deformation for metallographic sample preparation</li>
              <li>Thin section preparation for microscopy</li>
            </ul>
          )
        },
        { label: "Precautions", value: "" }
      ]
    },
    {
      id: "eq-014",
      title: "Trim-Saw",
      reservationLink: "https://forms.gle/LINK_EQ_014", // 👈 14번 장비 구글 폼 주소
      imageUrl: "Trim-Saw.JPEG",
      registrationNo: "",
      equipmentType: "",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        { label: "Manufacturer | Model", value: "Lapcraft | L'il Trimmer", hasAction: false },
        { label: "Introduction", value: "Compact, portable lapidary trim saw designed for precision cutting of facet rough and cabochon pre-forms." },
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Blade Compatibility: 4 in or 5 in diamond saw blades</li>
              <li>Arbor Size: 5/8 in (15.9 mm) standard arbor hole</li>
              <li>Housing: Unbreakable, rust-proof lightweight polyethylene</li>
              <li>Motor: 1/4 HP variable speed motor (approx. 500 to 3400 RPM)</li>
              <li>Cooling System: Integrated water cooling system (no messy oil required)</li>
            </ul>
          )
        },
        {
          label: "Applications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Precision trimming of facet rough and valuable gemstones</li>
              <li>Cutting out pre-forms for cabochon making</li>
              <li>Clean-up and resizing of small lapidary rock slabs</li>
            </ul>
          )
        },
        { label: "Precautions", value: "" }
      ]
    },
    {
      id: "eq-015",
      title: "Vacuum Plasma Surface Activator",
      reservationLink: "https://forms.gle/LINK_EQ_015", // 👈 15번 장비 구글 폼 주소
      imageUrl: "Vacuum-Plasma-Surface-Activator.JPEG",
      registrationNo: "",
      equipmentType: "",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        {
          label: "Manufacturer | Model",
          value: "Plasmapp | ActiLink Reborn",
          hasAction: true,
          actionText: "View Info",
          actionUrl: "https://plasmappamerica.com/products/actilink-reborn"
        },
        { label: "Introduction", value: "Medical-grade vacuum plasma surface activator designed to remove hydrocarbon contaminants and restore the bio-activity of dental implants and prostheses." },
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Technology: Vacuum plasma activation</li>
              <li>Dimensions: 170 x 266 x 345 mm</li>
              <li>Weight: Approx. 6 kg (13.2 lbs)</li>
              <li>Cycle Time: Vortex Mode: ~55–60 sec / Direct Mode: ~80 sec</li>
              <li>Lifespan: Up to 3,000 cycles</li>
              <li>Operation: Simple one-touch operation, no cooling or drying downtime</li>
            </ul>
          )
        },
        {
          label: "Applications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Removal of hydrocarbon contaminants from dental implants and prostheses</li>
              <li>Surface activation to make dental biomaterials highly hydrophilic</li>
              <li>Enhancing osseointegration and blood attraction for faster bone bonding</li>
              <li>Treatment of dental abutments, zirconia, resin, veneers, bone grafts, and membranes</li>
            </ul>
          )
        },
        { label: "Precautions", value: "" }
      ]
    },
    {
      id: "eq-016",
      title: "Plasma Sterilizer",
      reservationLink: "https://forms.gle/LINK_EQ_016", // 👈 16번 장비 구글 폼 주소
      imageUrl: "Plasma-Sterilizer.JPEG",
      registrationNo: "",
      equipmentType: "",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        {
          label: "Manufacturer | Model",
          value: "Plasmapp | STERLINK U-510",
          hasAction: true,
          actionText: "View Info",
          actionUrl: "https://plasmappamerica.com/products/sterlink-u-510"
        },
        { label: "Introduction", value: "Compact, tabletop low-temperature hydrogen peroxide gas plasma sterilizer designed for rapid and safe sterilization of heat- and moisture-sensitive clinical instruments." },
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Technology: Low-temperature hydrogen peroxide gas plasma</li>
              <li>Chamber Volume: 8 L (2.06 gallons)</li>
              <li>Chamber Dimensions: 470 x 185 x 90 mm (18.5" x 7.28" x 3.54")</li>
              <li>Overall Dimensions: 542 x 418 x 303 mm (21.34" x 16.46" x 11.93")</li>
              <li>Cycle Times: Standard Mode (17 min) / Advanced Mode (24 min)</li>
              <li>Consumables: STERLOAD cassettes (up to 20 cycles per cassette)</li>
              <li>Weight: 30 kg (66.14 lbs)</li>
            </ul>
          )
        },
        {
          label: "Applications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>On-demand low-temperature sterilization of delicate surgical tools</li>
              <li>Processing heat- and moisture-sensitive instruments (batteries, drills, scopes, camera heads)</li>
              <li>Eco-friendly alternative to ethylene oxide (EtO) sterilization</li>
            </ul>
          )
        },
        { label: "Precautions", value: "" }
      ]
    },
    {
      id: "eq-017",
      title: "Dental curing Light (Wired)",
      reservationLink: "https://forms.gle/LINK_EQ_017", // 👈 17번 장비 구글 폼 주소
      imageUrl: "Wired-Curing-Light.JPEG",
      registrationNo: "",
      equipmentType: "",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        { label: "Manufacturer | Model", value: "", hasAction: false },
        { label: "Introduction", value: "" },
        { label: "Specifications", value: "" },
        { label: "Applications", value: "" },
        { label: "Precautions", value: "" }
      ]
    },
    {
      id: "eq-018",
      title: "Dental curing Light (Wireless)",
      reservationLink: "https://forms.gle/LINK_EQ_018", // 👈 18번 장비 구글 폼 주소
      imageUrl: "Wireless-Curing-Light.JPEG",
      registrationNo: "",
      equipmentType: "",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        {
          label: "Manufacturer | Model",
          value: "3M | Paradigm DeepCure",
          hasAction: true,
          actionText: "View Info",
          actionUrl: "https://newarkdentalpemco.com/products/paradigm-led-deepcure-curing"
        },
        { label: "Introduction", value: "Lightweight, ergonomic cordless LED curing light designed for uniform and deep polymerization of dental restorations." },
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Light Intensity: 1,470 mW/cm² (-10% / +20%)</li>
              <li>Wavelength Range: 430–480 nm</li>
              <li>Battery Runtime: ~120 minutes (~720 10-second cures) on a full charge</li>
              <li>Light Guide: 10 mm diameter, black-coated, autoclavable, 360° rotating</li>
              <li>Housing: Lightweight, vent-free, seamless plastic</li>
            </ul>
          )
        },
        {
          label: "Applications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Polymerization of light-cured dental composites, adhesives, and sealants</li>
              <li>Deep curing of dental restorations in hard-to-reach posterior areas</li>
            </ul>
          )
        },
        { label: "Precautions", value: "" }
      ]
    },
    {
      id: "eq-019",
      title: "Dust Collector",
      reservationLink: "https://forms.gle/LINK_EQ_019", // 👈 19번 장비 구글 폼 주소
      imageUrl: "Dust-Collector.JPEG",
      registrationNo: "",
      equipmentType: "",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        { label: "Manufacturer | Model", value: "Renfert | SILENT compact", hasAction: false },
        { label: "Introduction", value: "" },
        { label: "Specifications", value: "" },
        { label: "Applications", value: "" },
        { label: "Precautions", value: "" }
      ]
    },
    {
      id: "eq-020",
      title: "Biological-Indicator-Auto-reader",
      reservationLink: "https://forms.gle/LINK_EQ_020", // 👈 20번 장비 구글 폼 주소
      imageUrl: "Biological-Indicator-Auto-reader.JPEG",
      registrationNo: "",
      equipmentType: "",
      installationLocation: "CHS33-009",
      manager: "",
      lastModified: "06-08-2026",
      details: [
        {
          label: "Manufacturer | Model",
          value: "Terragene | Bionova MiniBio",
          hasAction: true,
          actionText: "View Info",
          actionUrl: "https://terragene.com/product/minibio/"
        },
        { label: "Introduction", value: "Auto-reader incubator for rapid incubation and automatic fluorescence readout of biological indicators." },
        {
          label: "Specifications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Capacity: 3 incubation positions</li>
              <li>Incubation Temperature Options: 37°C or 60°C</li>
              <li>Fluorescence readout wavelength: ~460 nm</li>
              <li>Built-in thermal printer for automatic tickets</li>
              <li>USB connectivity to register results via traceability software</li>
            </ul>
          )
        },
        {
          label: "Applications", value: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Rapid monitoring of sterilization processes (Steam, EO, Formaldehyde, VH2O2)</li>
              <li>Automatic fluorescence detection (negative/positive) of biological indicators</li>
            </ul>
          )
        },
        { label: "Precautions", value: "" }
      ]
    }
  ];

  // 현재 선택된 장비의 ID를 저장하는 상태 (기본값은 첫 번째 장비의 ID)
  const [selectedId, setSelectedId] = useState(equipmentList[0].id);

  // 1. 카테고리 분류
  const analyticalSystems = equipmentList.filter(eq =>
    ["eq-001", "eq-002", "eq-003", "eq-004", "eq-005", "eq-006", "eq-007"].includes(eq.id)
  );
  const labUtilities = equipmentList.filter(eq =>
    !["eq-001", "eq-002", "eq-003", "eq-004", "eq-005", "eq-006", "eq-007"].includes(eq.id)
  );

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
          <optgroup label="📊 Analytical Systems" className="bg-[#EDF4FB] text-[#003B5C] font-semibold">
            {analyticalSystems.map(eq => (
              <option key={eq.id} value={eq.id} className="bg-white text-[#0F2740] font-normal">{eq.title}</option>
            ))}
          </optgroup>
          <optgroup label="🛠️ Lab Utilities" className="bg-[#EDF4FB] text-[#003B5C] font-semibold">
            {labUtilities.map(eq => (
              <option key={eq.id} value={eq.id} className="bg-white text-[#0F2740] font-normal">{eq.title}</option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* 2. PC용 사이드바 메뉴 (화면이 클 때만 왼쪽에 고정됨, 인쇄 시 숨김) */}
      <div className="hidden md:flex print:hidden flex-col w-64 lg:w-72 bg-[#F7FAFD] border-r border-[#C7D8E8] h-screen sticky top-0 overflow-y-auto shrink-0">
        <div className="p-6 border-b border-[#C7D8E8] bg-[#003B5C]">
          <h2 className="font-bold text-white text-lg">Equipment List</h2>
          <p className="text-sm text-[#FFD100] mt-1">Total {equipmentList.length} items</p>
        </div>
        <div className="flex flex-col p-3 gap-1">
          {/* Analytical Systems */}
          <div className="text-[11px] font-extrabold text-[#003B5C] px-3 py-1.5 bg-[#EDF4FB] border-l-4 border-[#2774AE] rounded-r-md uppercase tracking-widest select-none mb-2 mt-1 shadow-sm flex items-center gap-1.5">
            <span>📊 Analytical Systems</span>
          </div>
          {analyticalSystems.map(eq => (
            <button
              key={eq.id}
              onClick={() => setSelectedId(eq.id)}
              className={`text-left px-4 py-2.5 rounded-lg transition-all text-sm font-medium border-l-4 ${selectedId === eq.id
                ? 'bg-[#2774AE] text-white shadow-md border-[#FFD100]'
                : 'text-[#003B5C] border-transparent hover:bg-[#E8F1F8] hover:text-[#002844]'
                }`}
            >
              {eq.title}
            </button>
          ))}

          {/* Lab Utilities */}
          <div className="text-[11px] font-extrabold text-[#003B5C] px-3 py-1.5 bg-[#EDF4FB] border-l-4 border-[#2774AE] rounded-r-md uppercase tracking-widest select-none mb-2 mt-6 shadow-sm flex items-center gap-1.5">
            <span>🛠️ Lab Utilities</span>
          </div>
          {labUtilities.map(eq => (
            <button
              key={eq.id}
              onClick={() => setSelectedId(eq.id)}
              className={`text-left px-4 py-2.5 rounded-lg transition-all text-sm font-medium border-l-4 ${selectedId === eq.id
                ? 'bg-[#2774AE] text-white shadow-md border-[#FFD100]'
                : 'text-[#003B5C] border-transparent hover:bg-[#E8F1F8] hover:text-[#002844]'
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
