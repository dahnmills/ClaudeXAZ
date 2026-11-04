// Généré depuis Rejects_extracted_data_v3 (feuille 1) : la structure seule, les
// valeurs viennent de chaque rejet. notUsed = champ barré par le métier, plus
// utilisé dans Qirin.
import type { RejectBlock } from './reject-record.model';

export const ADMIN_DATA_LAYOUT: RejectBlock[] = [
  {
    "name": "COMMON DATA",
    "sections": [
      {
        "name": "Function code",
        "fields": [
          {
            "n": 1,
            "tech": "QAABL1-FONCTION-C-IN",
            "label": "Fonction code",
            "length": 4,
            "value": "",
            "notUsed": true
          }
        ]
      },
      {
        "name": "Provider data",
        "fields": [
          {
            "n": 2,
            "tech": "QAABL1-FULL-RPT-ID-N-IN",
            "label": "Full Report ID",
            "length": 10,
            "value": ""
          },
          {
            "n": 3,
            "tech": "QAABL1-THD-PVD-ID-N-IN",
            "label": "Provider ID",
            "length": 10,
            "value": "",
            "notUsed": true
          },
          {
            "n": 4,
            "tech": "QAABL1-PVD-RELIAB-CHECK-I-IN",
            "label": "Provider reliability indicator",
            "length": 1,
            "value": "",
            "notUsed": true
          },
          {
            "n": 5,
            "tech": "QAABL1-INT-INF-RPT-ID-N-IN",
            "label": "Information report ID",
            "length": 10,
            "value": "0000000000",
            "notUsed": true
          },
          {
            "n": 6,
            "tech": "QAABL1-IND-QRY-ID-N-IN",
            "label": "Query number",
            "length": 10,
            "value": "",
            "notUsed": true
          },
          {
            "n": 7,
            "tech": "QAABL1-PACK-ID-N-IN",
            "label": "Package number",
            "length": 10,
            "value": "0000000000",
            "notUsed": true
          },
          {
            "n": 8,
            "tech": "QAABL1-FLOW-S-IN",
            "label": "Provider flow timestamp",
            "length": 26,
            "value": ""
          }
        ]
      },
      {
        "name": "Company identification",
        "fields": [
          {
            "n": 9,
            "tech": "QAABL1-ID-TYP-C-IN",
            "label": "Identifier type code",
            "length": 8,
            "value": ""
          },
          {
            "n": 10,
            "tech": "QAABL1-ID-N-A-IN",
            "label": "Identifier number value",
            "length": 20,
            "value": ""
          },
          {
            "n": 11,
            "tech": "QAABL1-A-IN",
            "label": "Company's main name",
            "length": 40,
            "value": ""
          },
          {
            "n": 12,
            "tech": "QAABL1-A-EXT-A-IN",
            "label": "Company's main name extension",
            "length": 40,
            "value": "",
            "notUsed": true
          },
          {
            "n": 13,
            "tech": "QAABL1-STREET-N-A-IN",
            "label": "Street number (main address)",
            "length": 10,
            "value": ""
          },
          {
            "n": 14,
            "tech": "QAABL1-STREET-A-IN",
            "label": "Street name (main address)",
            "length": 35,
            "value": ""
          },
          {
            "n": 15,
            "tech": "QAABL1-TOWN-A-IN",
            "label": "Town/City (main address)",
            "length": 35,
            "value": ""
          },
          {
            "n": 16,
            "tech": "-",
            "label": "Region",
            "length": 35,
            "value": ""
          },
          {
            "n": 17,
            "tech": "QAABL1-POST-C-IN",
            "label": "Post code (main address)",
            "length": 9,
            "value": ""
          },
          {
            "n": 18,
            "tech": "QAABL1-CTRY-C-IN",
            "label": "Country code",
            "length": 3,
            "value": ""
          },
          {
            "n": 19,
            "tech": "QAABL1-A-EXT2-A-IN",
            "label": "Company's 2nd name extension",
            "length": 40,
            "value": "",
            "notUsed": true
          }
        ]
      }
    ]
  },
  {
    "name": "COMPANY",
    "sections": [
      {
        "name": "Company data",
        "fields": [
          {
            "n": 20,
            "tech": "QAJA01-THD-STA-C-IN",
            "label": "Status code",
            "length": 1,
            "value": ""
          },
          {
            "n": 21,
            "tech": "QAJA01-THD-STA-ORI-C-IN",
            "label": "Status origin code",
            "length": 5,
            "value": ""
          },
          {
            "n": 22,
            "tech": "QAJA01-THD-STA-O-EFF-IN",
            "label": "Status origin effective date",
            "length": 10,
            "value": ""
          },
          {
            "n": 23,
            "tech": "QAJA01-THD-LANGUAGE-C-IN",
            "label": "Company language code",
            "length": 2,
            "value": ""
          },
          {
            "n": 24,
            "tech": "QAJA01-THD-COMMENT-T-IN",
            "label": "Comment on the company",
            "length": 100,
            "value": "",
            "notUsed": true
          },
          {
            "n": 25,
            "tech": "QAJA01-WINNER-THD-ID-N-IN",
            "label": "Target company ID",
            "length": 10,
            "value": "0000000000"
          }
        ]
      },
      {
        "name": "Legal entity",
        "fields": [
          {
            "n": 26,
            "tech": "QAJA01-LG-CREATE-D-IN",
            "label": "Creation date",
            "length": 10,
            "value": ""
          },
          {
            "n": 27,
            "tech": "QAJA01-LG-BUS-STRT-D-IN",
            "label": "Business start date",
            "length": 10,
            "value": ""
          },
          {
            "n": 28,
            "tech": "QAJA01-LG-MIN-EMP-Q-IN",
            "label": "Minimum employees number",
            "length": 10,
            "value": "0000000000"
          },
          {
            "n": 29,
            "tech": "QAJA01-LG-MAX-EMP-Q-IN",
            "label": "Maximum employees number",
            "length": 10,
            "value": "0000000000"
          },
          {
            "n": 30,
            "tech": "QAJA01-LG-PUB-ORI-C-IN",
            "label": "Legal publication source code",
            "length": 2,
            "value": "",
            "notUsed": true
          },
          {
            "n": 31,
            "tech": "QAJA01-LG-PUB-REF-A-IN",
            "label": "Legal publication reference",
            "length": 10,
            "value": "",
            "notUsed": true
          },
          {
            "n": 32,
            "tech": "QAJA01-LG-FORM-C-IN",
            "label": "Legal form code",
            "length": 5,
            "value": ""
          },
          {
            "n": 33,
            "tech": "QAJA01-LG-FORM-EFF-D-IN",
            "label": "Legal form effective date",
            "length": 10,
            "value": ""
          },
          {
            "n": 34,
            "tech": "QAJA01-LG-PUBLIC-BR-I-IN",
            "label": "Public company indicator",
            "length": 1,
            "value": ""
          },
          {
            "n": 35,
            "tech": "QAJA01-LG-BUSINESS-A-IN",
            "label": "Company's trade name",
            "length": 40,
            "value": "",
            "notUsed": true
          }
        ]
      },
      {
        "name": "Identifier",
        "fields": [
          {
            "n": 36,
            "tech": "QAJA01-THD-ID-TYP-C-2-IN",
            "label": "External identifier type code",
            "length": 8,
            "value": ""
          },
          {
            "n": 37,
            "tech": "QAJA01-THD-ID-N-A-2-IN",
            "label": "External identifier number value",
            "length": 20,
            "value": ""
          },
          {
            "n": 38,
            "tech": "QAJA01-THD-ID-STA-C-IN",
            "label": "Identifier status code",
            "length": 3,
            "value": "",
            "notUsed": true
          },
          {
            "n": 39,
            "tech": "QAJA01-THD-ID-EFF-D-IN",
            "label": "Identifier effective date",
            "length": 10,
            "value": "",
            "notUsed": true
          }
        ]
      },
      {
        "name": "Secondary name",
        "fields": [
          {
            "n": 40,
            "tech": "QAJA01-THD-A-N-IN",
            "label": "Secondary name's number",
            "length": 10,
            "value": "0000000000",
            "notUsed": true
          },
          {
            "n": 41,
            "tech": "QAJA01-THD-A-TYP-C-IN",
            "label": "Secondary name type code",
            "length": 2,
            "value": ""
          },
          {
            "n": 42,
            "tech": "QAJA01-THD-A-IN",
            "label": "Secondary name",
            "length": 40,
            "value": ""
          },
          {
            "n": 43,
            "tech": "QAJA01-THD-A-EXT-A-IN",
            "label": "Extension of secondary name",
            "length": 40,
            "value": "",
            "notUsed": true
          },
          {
            "n": 44,
            "tech": "QAJA01-THD-A-EFF-D-IN",
            "label": "Secondary name effective date",
            "length": 10,
            "value": "",
            "notUsed": true
          },
          {
            "n": 45,
            "tech": "QAJA01-THD-A-EXT2-A-IN",
            "label": "2nd extension of secondary name",
            "length": 40,
            "value": "",
            "notUsed": true
          }
        ]
      },
      {
        "name": "Activity / Trade sector",
        "fields": [
          {
            "n": 46,
            "tech": "QAJA01-THD-TRD-SEC-I-IN",
            "label": "Main trade sector indicator",
            "length": 1,
            "value": ""
          },
          {
            "n": 47,
            "tech": "QAJA01-THD-NOMENCLA-C-IN",
            "label": "Nomenclature code",
            "length": 8,
            "value": ""
          },
          {
            "n": 48,
            "tech": "QAJA01-THD-TRD-SC-C-IN",
            "label": "Trade sector code",
            "length": 5,
            "value": ""
          },
          {
            "n": 49,
            "tech": "QAJA01-THD-TRD-SC-S-D-IN",
            "label": "Activity start date",
            "length": 10,
            "value": "",
            "notUsed": true
          },
          {
            "n": 50,
            "tech": "QAJA01-THD-TRD-SC-N-IN",
            "label": "Trade sector number",
            "length": 10,
            "value": "0000000000",
            "notUsed": true
          }
        ]
      },
      {
        "name": "Financial data",
        "fields": [
          {
            "n": 51,
            "tech": "QAJA01-SHARE-CAP-M-IN",
            "label": "Share capital amount",
            "length": 15,
            "value": "000000000000000"
          },
          {
            "n": 52,
            "tech": "QAJA01-ISSUED-CAP-M-IN",
            "label": "Issued capital amount",
            "length": 15,
            "value": "000000000000000"
          },
          {
            "n": 53,
            "tech": "QAJA01-IK-CONTR-TYP-C-IN",
            "label": "Type of contribution in kind",
            "length": 2,
            "value": ""
          },
          {
            "n": 54,
            "tech": "QAJA01-IK-CONTR-M-IN",
            "label": "Contribution in kind amount",
            "length": 15,
            "value": "000000000000000"
          },
          {
            "n": 55,
            "tech": "QAJA01-AN-GEN-MTING-D-IN",
            "label": "Date of Anual General Meeting",
            "length": 10,
            "value": "",
            "notUsed": true
          },
          {
            "n": 56,
            "tech": "QAJA01-FIN-DATA-CCY-C-IN",
            "label": "Financial's currency",
            "length": 3,
            "value": ""
          },
          {
            "n": 57,
            "tech": "QAJA01-TURNOVER-M-IN",
            "label": "Turnover amount",
            "length": 15,
            "value": "000000000000000"
          },
          {
            "n": 58,
            "tech": "QAJA01-TURNOVER-D-IN",
            "label": "Turnover Date",
            "length": 10,
            "value": ""
          },
          {
            "n": 59,
            "tech": "QAJA01-TURNOVER-TYPE-C-IN",
            "label": "Turnover Type",
            "length": 2,
            "value": ""
          },
          {
            "n": 60,
            "tech": "QAJA01-SHARE-CAP-D-IN",
            "label": "Share capital date",
            "length": 10,
            "value": ""
          }
        ]
      },
      {
        "name": "Building data",
        "fields": [
          {
            "n": 61,
            "tech": "QAJA01-BUILDING-TYP-A-IN",
            "label": "Type of building",
            "length": 25,
            "value": "",
            "notUsed": true
          },
          {
            "n": 62,
            "tech": "QAJA01-SIZE-A-IN",
            "label": "Surface area",
            "length": 10,
            "value": "",
            "notUsed": true
          },
          {
            "n": 63,
            "tech": "QAJA01-LOCATION-TYP-A-IN",
            "label": "Type of location",
            "length": 25,
            "value": "",
            "notUsed": true
          },
          {
            "n": 64,
            "tech": "QAJA01-OWNERSHIP-C-IN",
            "label": "Ownership code",
            "length": 1,
            "value": "",
            "notUsed": true
          }
        ]
      },
      {
        "name": "Personal data",
        "fields": [
          {
            "n": 65,
            "tech": "QAJA01-IND-TITLE-C-IN",
            "label": "Title",
            "length": 4,
            "value": "",
            "notUsed": true
          },
          {
            "n": 66,
            "tech": "QAJA01-IND-SEX-C-IN",
            "label": "Sex",
            "length": 1,
            "value": "",
            "notUsed": true
          },
          {
            "n": 67,
            "tech": "QAJA01-IND-BIRTH-D-IN",
            "label": "Date of birth",
            "length": 10,
            "value": "",
            "notUsed": true
          },
          {
            "n": 68,
            "tech": "QAJA01-IND-SUF-A-IN",
            "label": "Suffix",
            "length": 25,
            "value": "",
            "notUsed": true
          }
        ]
      }
    ]
  },
  {
    "name": "BRANCH",
    "sections": [
      {
        "name": "Branch data",
        "fields": [
          {
            "n": 69,
            "tech": "QAJA01-BRANCH-N-IN",
            "label": "Branch number",
            "length": 10,
            "value": "0000000000",
            "notUsed": true
          },
          {
            "n": 70,
            "tech": "QAJA01-BRA-LANGUAGE-C-IN",
            "label": "Language",
            "length": 2,
            "value": "",
            "notUsed": true
          },
          {
            "n": 71,
            "tech": "QAJA01-BRA-COMMENT-T-IN",
            "label": "Comment on Branch",
            "length": 100,
            "value": "",
            "notUsed": true
          }
        ]
      },
      {
        "name": "Legal entity",
        "fields": [
          {
            "n": 72,
            "tech": "QAJA01-BRA-CREATE-D-IN",
            "label": "Creation date",
            "length": 10,
            "value": "",
            "notUsed": true
          },
          {
            "n": 73,
            "tech": "QAJA01-BRA-BUS-STRT-D-IN",
            "label": "Business start date",
            "length": 10,
            "value": "",
            "notUsed": true
          },
          {
            "n": 74,
            "tech": "QAJA01-BRA-MIN-EMP-Q-IN",
            "label": "Minimum employees number",
            "length": 10,
            "value": "0000000000",
            "notUsed": true
          },
          {
            "n": 75,
            "tech": "QAJA01-BRA-MAX-EMP-Q-IN",
            "label": "Maximum employees number",
            "length": 10,
            "value": "0000000000",
            "notUsed": true
          },
          {
            "n": 76,
            "tech": "QAJA01-BRA-PUB-ORI-C-IN",
            "label": "Legal publication source code",
            "length": 2,
            "value": "",
            "notUsed": true
          },
          {
            "n": 77,
            "tech": "QAJA01-BRA-PUB-REF-A-IN",
            "label": "Legal publication reference",
            "length": 10,
            "value": "",
            "notUsed": true
          }
        ]
      },
      {
        "name": "Branch address",
        "fields": [
          {
            "n": 78,
            "tech": "QAJA01-PRC-ADDR-I-IN",
            "label": "Main address indicator",
            "length": 1,
            "value": "",
            "notUsed": true
          },
          {
            "n": 79,
            "tech": "QAJA01-BRA-ADDR-TYP-C-IN",
            "label": "Address type",
            "length": 1,
            "value": "",
            "notUsed": true
          },
          {
            "n": 80,
            "tech": "QAJA01-BRA-STREET-N-A-IN",
            "label": "Street number",
            "length": 10,
            "value": "",
            "notUsed": true
          },
          {
            "n": 81,
            "tech": "QAJA01-BRA-STREET-A-IN",
            "label": "Street name",
            "length": 35,
            "value": "",
            "notUsed": true
          },
          {
            "n": 82,
            "tech": "QAJA01-BRA-ADD-LINE-A-IN",
            "label": "Street extension",
            "length": 35,
            "value": "",
            "notUsed": true
          },
          {
            "n": 83,
            "tech": "QAJA01-BRA-TOWN-A-IN",
            "label": "Town/City",
            "length": 35,
            "value": "",
            "notUsed": true
          },
          {
            "n": 84,
            "tech": "QAJA01-BRA-STATE-A-IN",
            "label": "Region",
            "length": 35,
            "value": "",
            "notUsed": true
          },
          {
            "n": 85,
            "tech": "QAJA01-BRA-POST-C-A-IN",
            "label": "Post code",
            "length": 9,
            "value": "",
            "notUsed": true
          },
          {
            "n": 86,
            "tech": "QAJA01-BRA-POST-O-B-A-IN",
            "label": "PO box",
            "length": 9,
            "value": "",
            "notUsed": true
          },
          {
            "n": 87,
            "tech": "QAJA01-BRA-CTRY-C-IN",
            "label": "Country",
            "length": 3,
            "value": "",
            "notUsed": true
          },
          {
            "n": 88,
            "tech": "QAJA01-BRA-TEL-N-IN",
            "label": "Phone number",
            "length": 18,
            "value": "",
            "notUsed": true
          },
          {
            "n": 89,
            "tech": "QAJA01-BRA-FAX-N-IN",
            "label": "Fax number",
            "length": 18,
            "value": "",
            "notUsed": true
          },
          {
            "n": 90,
            "tech": "QAJA01-BRA-EMAIL-ADRS-A-IN",
            "label": "Email address",
            "length": 70,
            "value": "",
            "notUsed": true
          },
          {
            "n": 91,
            "tech": "QAJA01-BRA-CTF-MAIL-A-IN",
            "label": "Certified email",
            "length": 70,
            "value": "",
            "notUsed": true
          },
          {
            "n": 92,
            "tech": "QAJA01-BRA-PO-BOX-PO-C-A-IN",
            "label": "Post code of PO box",
            "length": 9,
            "value": "",
            "notUsed": true
          },
          {
            "n": 93,
            "tech": "QAJA01-BRA-CY-POST-C-A-IN",
            "label": "Company post code",
            "length": 9,
            "value": "",
            "notUsed": true
          },
          {
            "n": 94,
            "tech": "QAJA01-BRA-HOMPGE-ADDRS-A-IN",
            "label": "Homepage address",
            "length": 70,
            "value": "",
            "notUsed": true
          }
        ]
      },
      {
        "name": "Branch identifier",
        "fields": [
          {
            "n": 95,
            "tech": "QAJA01-BRA-ID-TYP-C-IN",
            "label": "Identifier type",
            "length": 8,
            "value": "",
            "notUsed": true
          },
          {
            "n": 96,
            "tech": "QAJA01-BRA-ID-N-A-IN",
            "label": "Identifier number",
            "length": 20,
            "value": "",
            "notUsed": true
          },
          {
            "n": 97,
            "tech": "QAJA01-BRA-ID-STA-C-IN",
            "label": "Identifier status",
            "length": 3,
            "value": "",
            "notUsed": true
          },
          {
            "n": 98,
            "tech": "QAJA01-BRA-ID-EFF-D-IN",
            "label": "Identifier effective date",
            "length": 10,
            "value": "",
            "notUsed": true
          }
        ]
      },
      {
        "name": "Branch name",
        "fields": [
          {
            "n": 99,
            "tech": "QAJA01-BRA-A-IN",
            "label": "Name",
            "length": 40,
            "value": "",
            "notUsed": true
          },
          {
            "n": 100,
            "tech": "QAJA01-BRA-A-EXT-A-IN",
            "label": "Extension",
            "length": 40,
            "value": "",
            "notUsed": true
          },
          {
            "n": 101,
            "tech": "QAJA01-BRA-A-EFF-D-IN",
            "label": "Effective date",
            "length": 10,
            "value": "",
            "notUsed": true
          },
          {
            "n": 102,
            "tech": "QAJA01-BRA-A-EXT2-A-IN",
            "label": "Second extension",
            "length": 40,
            "value": "",
            "notUsed": true
          }
        ]
      },
      {
        "name": "Branch activity",
        "fields": [
          {
            "n": 103,
            "tech": "QAJA01-BRA-NOMENCLA-C-IN",
            "label": "Nomenclature",
            "length": 8,
            "value": "",
            "notUsed": true
          },
          {
            "n": 104,
            "tech": "QAJA01-BRA-TRD-SEC-C-IN",
            "label": "Trade sector code",
            "length": 5,
            "value": "",
            "notUsed": true
          },
          {
            "n": 105,
            "tech": "QAJA01-BRA-TRD-SC-S-D-IN",
            "label": "Activity start date",
            "length": 10,
            "value": "",
            "notUsed": true
          }
        ]
      }
    ]
  },
  {
    "name": "OTHER",
    "sections": [
      {
        "name": "Various",
        "fields": [
          {
            "n": 106,
            "tech": "QAJA01-PRC-WARNING-I-IN",
            "label": "Change to principal warning indicator",
            "length": 1,
            "value": "",
            "notUsed": true
          },
          {
            "n": 107,
            "tech": "QAJA01-EXIST-CHECK-I-IN",
            "label": "Existence check indicator",
            "length": 2,
            "value": "",
            "notUsed": true
          },
          {
            "n": 108,
            "tech": "QAJA01-FLOW-TYP-C-IN",
            "label": "Flow attribute",
            "length": 2,
            "value": "",
            "notUsed": true
          },
          {
            "n": 109,
            "tech": "QAJA01-UPDATE-TYP-C-IN",
            "label": "Type of update",
            "length": 2,
            "value": "",
            "notUsed": true
          }
        ]
      },
      {
        "name": "Bonding Usage",
        "fields": [
          {
            "n": 110,
            "tech": "QAJA01-BOND-M-IN",
            "label": "Bonding exposure (amount)",
            "length": 15,
            "value": "000000000000,000",
            "notUsed": true
          },
          {
            "n": 111,
            "tech": "QAJA01-BOND-CCY-C-IN",
            "label": "Currency",
            "length": 3,
            "value": "",
            "notUsed": true
          },
          {
            "n": 112,
            "tech": "QAJA01-BOND-EFF-D-IN",
            "label": "Effective date",
            "length": 10,
            "value": "",
            "notUsed": true
          }
        ]
      },
      {
        "name": "Bonding Limit",
        "fields": [
          {
            "n": 113,
            "tech": "QAJA01-BOND-LIM-M-IN",
            "label": "Bonding exposure (amount)",
            "length": 15,
            "value": "000000000000,000",
            "notUsed": true
          },
          {
            "n": 114,
            "tech": "QAJA01-BOND-LIM-CCY-C-IN",
            "label": "Currency",
            "length": 3,
            "value": "",
            "notUsed": true
          },
          {
            "n": 115,
            "tech": "QAJA01-BOND-LIM-EGBU-C-IN",
            "label": "Company BU",
            "length": 4,
            "value": "",
            "notUsed": true
          }
        ]
      },
      {
        "name": "Non-latin admin data",
        "fields": [
          {
            "n": 116,
            "tech": "QAJA01-LG-BUSINESS-A-NLT-IN",
            "label": "Business name",
            "length": 120,
            "value": "",
            "notUsed": true
          },
          {
            "n": 117,
            "tech": "QAJA01-THD-A-NLT-IN",
            "label": "Company name",
            "length": 120,
            "value": ""
          },
          {
            "n": 118,
            "tech": "QAJA01-THD-A-EXT-A-NLT-IN",
            "label": "Company name extension",
            "length": 120,
            "value": "",
            "notUsed": true
          },
          {
            "n": 119,
            "tech": "QAJA01-BRA-A-NLT-IN",
            "label": "Branch name",
            "length": 120,
            "value": "",
            "notUsed": true
          },
          {
            "n": 120,
            "tech": "QAJA01-BRA-A-EXT-A-NLT-IN",
            "label": "Branch name extension",
            "length": 120,
            "value": "",
            "notUsed": true
          },
          {
            "n": 121,
            "tech": "QAJA01-BRA-STREET-N-A-NLT-IN",
            "label": "Street number",
            "length": 30,
            "value": ""
          },
          {
            "n": 122,
            "tech": "QAJA01-BRA-STREET-A-NLT-IN",
            "label": "Street name",
            "length": 105,
            "value": ""
          },
          {
            "n": 123,
            "tech": "QAJA01-BRA-ADD-LINE-A-NLT-IN",
            "label": "Street additional line",
            "length": 105,
            "value": ""
          },
          {
            "n": 124,
            "tech": "QAJA01-BRA-TOWN-A-NLT-IN",
            "label": "Town/City",
            "length": 105,
            "value": ""
          },
          {
            "n": 125,
            "tech": "QAJA01-BRA-POST-C-A-NLT-IN",
            "label": "Post code",
            "length": 27,
            "value": ""
          },
          {
            "n": 126,
            "tech": "QAJA01-BRA-POST-O-B-A-NLT-IN",
            "label": "PO Box",
            "length": 27,
            "value": ""
          },
          {
            "n": 127,
            "tech": "QAJA01-THD-ALPH-C-IN",
            "label": "Alphabet code of non-Latin data",
            "length": 2,
            "value": ""
          }
        ]
      }
    ]
  }
];
