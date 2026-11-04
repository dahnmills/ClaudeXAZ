// Généré depuis Rejects_extracted_data_v2.xlsx (3 rejets réels anonymisés par la source).
// Les champs en cause (error) sont posés à la main : le fichier ne les marque pas.
import type { RejectRecord } from './reject-record.model';

export const REJECT_RECORDS: RejectRecord[] = [
  {
    "id": "rec-1",
    "meta": {
      "Sub-System": "Administrative Data",
      "Reject Source": "Functional",
      "Reject Type": "Identifier DUN 047707224 already exists for another third party",
      "EHBU": "ACI",
      "Provider ID": "30542851",
      "Date": "21/09/2026",
      "Euler Hermes ID": "120258684",
      "Country": "US",
      "Identifier type": "EULERID",
      "Identifier value": "120258684"
    },
    "blocks": [
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
                "value": "AIDE"
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
                "value": "0140836097"
              },
              {
                "n": 3,
                "tech": "QAABL1-THD-PVD-ID-N-IN",
                "label": "Provider ID",
                "length": 10,
                "value": "0030542851"
              },
              {
                "n": 4,
                "tech": "QAABL1-PVD-RELIAB-CHECK-I-IN",
                "label": "Provider reliability indicator",
                "length": 1,
                "value": "1"
              },
              {
                "n": 5,
                "tech": "QAABL1-INT-INF-RPT-ID-N-IN",
                "label": "Information report ID",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 6,
                "tech": "QAABL1-IND-QRY-ID-N-IN",
                "label": "Query number",
                "length": 10,
                "value": "0000000003"
              },
              {
                "n": 7,
                "tech": "QAABL1-PACK-ID-N-IN",
                "label": "Package number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 8,
                "tech": "QAABL1-FLOW-S-IN",
                "label": "Provider flow timestamp",
                "length": 26,
                "value": "2026-09-21-06.03.11.000326"
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
                "value": "EULERID"
              },
              {
                "n": 10,
                "tech": "QAABL1-ID-N-A-IN",
                "label": "Identifier number value",
                "length": 20,
                "value": "120258684"
              },
              {
                "n": 11,
                "tech": "QAABL1-A-IN",
                "label": "Company's main name",
                "length": 40,
                "value": "Lab Animal Supplies Inc."
              },
              {
                "n": 12,
                "tech": "QAABL1-A-EXT-A-IN",
                "label": "Company's main name extension",
                "length": 40,
                "value": ""
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
                "value": "3450 Highway 114"
              },
              {
                "n": 15,
                "tech": "QAABL1-TOWN-A-IN",
                "label": "Town/City (main address)",
                "length": 35,
                "value": "Fort Worth"
              },
              {
                "n": 16,
                "tech": "QAABL1-POST-C-IN",
                "label": "Post code (main address)",
                "length": 9,
                "value": "76177"
              },
              {
                "n": 17,
                "tech": "QAABL1-CTRY-C-IN",
                "label": "Country code",
                "length": 3,
                "value": "US"
              },
              {
                "n": 18,
                "tech": "QAABL1-A-EXT2-A-IN",
                "label": "Company's 2nd name extension",
                "length": 40,
                "value": ""
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
                "n": 19,
                "tech": "QAJA01-THD-STA-C-IN",
                "label": "Status code",
                "length": 1,
                "value": ""
              },
              {
                "n": 20,
                "tech": "QAJA01-THD-STA-ORI-C-IN",
                "label": "Status origin code",
                "length": 5,
                "value": ""
              },
              {
                "n": 21,
                "tech": "QAJA01-THD-STA-O-EFF-IN",
                "label": "Status origin effective date",
                "length": 10,
                "value": ""
              },
              {
                "n": 22,
                "tech": "QAJA01-THD-LANGUAGE-C-IN",
                "label": "Company language code",
                "length": 2,
                "value": "EN"
              },
              {
                "n": 23,
                "tech": "QAJA01-THD-COMMENT-T-IN",
                "label": "Comment on the company",
                "length": 100,
                "value": ""
              },
              {
                "n": 24,
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
                "n": 25,
                "tech": "QAJA01-LG-CREATE-D-IN",
                "label": "Creation date",
                "length": 10,
                "value": ""
              },
              {
                "n": 26,
                "tech": "QAJA01-LG-BUS-STRT-D-IN",
                "label": "Business start date",
                "length": 10,
                "value": ""
              },
              {
                "n": 27,
                "tech": "QAJA01-LG-MIN-EMP-Q-IN",
                "label": "Minimum employees number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 28,
                "tech": "QAJA01-LG-MAX-EMP-Q-IN",
                "label": "Maximum employees number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 29,
                "tech": "QAJA01-LG-PUB-ORI-C-IN",
                "label": "Legal publication source code",
                "length": 2,
                "value": ""
              },
              {
                "n": 30,
                "tech": "QAJA01-LG-PUB-REF-A-IN",
                "label": "Legal publication reference",
                "length": 10,
                "value": ""
              },
              {
                "n": 31,
                "tech": "QAJA01-LG-FORM-C-IN",
                "label": "Legal form code",
                "length": 5,
                "value": ""
              },
              {
                "n": 32,
                "tech": "QAJA01-LG-FORM-EFF-D-IN",
                "label": "Legal form effective date",
                "length": 10,
                "value": ""
              },
              {
                "n": 33,
                "tech": "QAJA01-LG-PUBLIC-BR-I-IN",
                "label": "Public company indicator",
                "length": 1,
                "value": ""
              },
              {
                "n": 34,
                "tech": "QAJA01-LG-BUSINESS-A-IN",
                "label": "Company's trade name",
                "length": 40,
                "value": ""
              }
            ]
          },
          {
            "name": "Identifier",
            "fields": [
              {
                "n": 35,
                "tech": "QAJA01-THD-ID-TYP-C-2-IN",
                "label": "External identifier type code",
                "length": 8,
                "value": "DUN",
                "error": "DUN 047707224 is already used by another third party"
              },
              {
                "n": 36,
                "tech": "QAJA01-THD-ID-N-A-2-IN",
                "label": "External identifier number value",
                "length": 20,
                "value": "047707224",
                "error": "DUN 047707224 is already used by another third party"
              },
              {
                "n": 37,
                "tech": "QAJA01-THD-ID-STA-C-IN",
                "label": "Identifier status code",
                "length": 3,
                "value": ""
              },
              {
                "n": 38,
                "tech": "QAJA01-THD-ID-EFF-D-IN",
                "label": "Identifier effective date",
                "length": 10,
                "value": ""
              }
            ]
          },
          {
            "name": "Secondary name",
            "fields": [
              {
                "n": 39,
                "tech": "QAJA01-THD-A-N-IN",
                "label": "Secondary name's number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 40,
                "tech": "QAJA01-THD-A-TYP-C-IN",
                "label": "Secondary name type code",
                "length": 2,
                "value": ""
              },
              {
                "n": 41,
                "tech": "QAJA01-THD-A-IN",
                "label": "Secondary name",
                "length": 40,
                "value": ""
              },
              {
                "n": 42,
                "tech": "QAJA01-THD-A-EXT-A-IN",
                "label": "Extension of secondary name",
                "length": 40,
                "value": ""
              },
              {
                "n": 43,
                "tech": "QAJA01-THD-A-EFF-D-IN",
                "label": "Secondary name effective date",
                "length": 10,
                "value": ""
              },
              {
                "n": 44,
                "tech": "QAJA01-THD-A-EXT2-A-IN",
                "label": "2nd extension of secondary name",
                "length": 40,
                "value": ""
              }
            ]
          },
          {
            "name": "Activity / Trade sector",
            "fields": [
              {
                "n": 45,
                "tech": "QAJA01-THD-TRD-SEC-I-IN",
                "label": "Main trade sector indicator",
                "length": 1,
                "value": ""
              },
              {
                "n": 46,
                "tech": "QAJA01-THD-NOMENCLA-C-IN",
                "label": "Nomenclature code",
                "length": 8,
                "value": ""
              },
              {
                "n": 47,
                "tech": "QAJA01-THD-TRD-SC-C-IN",
                "label": "Trade sector code",
                "length": 5,
                "value": ""
              },
              {
                "n": 48,
                "tech": "QAJA01-THD-TRD-SC-S-D-IN",
                "label": "Activity start date",
                "length": 10,
                "value": ""
              },
              {
                "n": 49,
                "tech": "QAJA01-THD-TRD-SC-N-IN",
                "label": "Trade sector number",
                "length": 10,
                "value": "0000000000"
              }
            ]
          },
          {
            "name": "Financial data",
            "fields": [
              {
                "n": 50,
                "tech": "QAJA01-SHARE-CAP-M-IN",
                "label": "Share capital amount",
                "length": 15,
                "value": "000000000000000"
              },
              {
                "n": 51,
                "tech": "QAJA01-ISSUED-CAP-M-IN",
                "label": "Issued capital amount",
                "length": 15,
                "value": "000000000000000"
              },
              {
                "n": 52,
                "tech": "QAJA01-IK-CONTR-TYP-C-IN",
                "label": "Type of contribution in kind",
                "length": 2,
                "value": ""
              },
              {
                "n": 53,
                "tech": "QAJA01-IK-CONTR-M-IN",
                "label": "Contribution in kind amount",
                "length": 15,
                "value": "000000000000000"
              },
              {
                "n": 54,
                "tech": "QAJA01-AN-GEN-MTING-D-IN",
                "label": "Date of Anual General Meeting",
                "length": 10,
                "value": ""
              },
              {
                "n": 55,
                "tech": "QAJA01-FIN-DATA-CCY-C-IN",
                "label": "Financial's currency",
                "length": 3,
                "value": ""
              },
              {
                "n": 56,
                "tech": "QAJA01-TURNOVER-M-IN",
                "label": "Turnover amount",
                "length": 15,
                "value": "000000000000000"
              },
              {
                "n": 57,
                "tech": "QAJA01-TURNOVER-D-IN",
                "label": "Turnover Date",
                "length": 10,
                "value": ""
              },
              {
                "n": 58,
                "tech": "QAJA01-TURNOVER-TYPE-C-IN",
                "label": "Turnover Type",
                "length": 2,
                "value": ""
              },
              {
                "n": 59,
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
                "n": 60,
                "tech": "QAJA01-BUILDING-TYP-A-IN",
                "label": "Type of building",
                "length": 25,
                "value": ""
              },
              {
                "n": 61,
                "tech": "QAJA01-SIZE-A-IN",
                "label": "Surface area",
                "length": 10,
                "value": ""
              },
              {
                "n": 62,
                "tech": "QAJA01-LOCATION-TYP-A-IN",
                "label": "Type of location",
                "length": 25,
                "value": ""
              },
              {
                "n": 63,
                "tech": "QAJA01-OWNERSHIP-C-IN",
                "label": "Ownership code",
                "length": 1,
                "value": ""
              }
            ]
          },
          {
            "name": "Personal data",
            "fields": [
              {
                "n": 64,
                "tech": "QAJA01-IND-TITLE-C-IN",
                "label": "Title",
                "length": 4,
                "value": ""
              },
              {
                "n": 65,
                "tech": "QAJA01-IND-SEX-C-IN",
                "label": "Sex",
                "length": 1,
                "value": ""
              },
              {
                "n": 66,
                "tech": "QAJA01-IND-BIRTH-D-IN",
                "label": "Date of birth",
                "length": 10,
                "value": ""
              },
              {
                "n": 67,
                "tech": "QAJA01-IND-SUF-A-IN",
                "label": "Suffix",
                "length": 25,
                "value": ""
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
                "n": 68,
                "tech": "QAJA01-BRANCH-N-IN",
                "label": "Branch number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 69,
                "tech": "QAJA01-BRA-LANGUAGE-C-IN",
                "label": "Language",
                "length": 2,
                "value": ""
              },
              {
                "n": 70,
                "tech": "QAJA01-BRA-COMMENT-T-IN",
                "label": "Comment on Branch",
                "length": 100,
                "value": ""
              }
            ]
          },
          {
            "name": "Legal entity",
            "fields": [
              {
                "n": 71,
                "tech": "QAJA01-BRA-CREATE-D-IN",
                "label": "Creation date",
                "length": 10,
                "value": ""
              },
              {
                "n": 72,
                "tech": "QAJA01-BRA-BUS-STRT-D-IN",
                "label": "Business start date",
                "length": 10,
                "value": ""
              },
              {
                "n": 73,
                "tech": "QAJA01-BRA-MIN-EMP-Q-IN",
                "label": "Minimum employees number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 74,
                "tech": "QAJA01-BRA-MAX-EMP-Q-IN",
                "label": "Maximum employees number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 75,
                "tech": "QAJA01-BRA-PUB-ORI-C-IN",
                "label": "Legal publication source code",
                "length": 2,
                "value": ""
              },
              {
                "n": 76,
                "tech": "QAJA01-BRA-PUB-REF-A-IN",
                "label": "Legal publication reference",
                "length": 10,
                "value": ""
              }
            ]
          },
          {
            "name": "Branch address",
            "fields": [
              {
                "n": 77,
                "tech": "QAJA01-PRC-ADDR-I-IN",
                "label": "Main address indicator",
                "length": 1,
                "value": ""
              },
              {
                "n": 78,
                "tech": "QAJA01-BRA-ADDR-TYP-C-IN",
                "label": "Address type",
                "length": 1,
                "value": ""
              },
              {
                "n": 79,
                "tech": "QAJA01-BRA-STREET-N-A-IN",
                "label": "Street number",
                "length": 10,
                "value": ""
              },
              {
                "n": 80,
                "tech": "QAJA01-BRA-STREET-A-IN",
                "label": "Street name",
                "length": 35,
                "value": ""
              },
              {
                "n": 81,
                "tech": "QAJA01-BRA-ADD-LINE-A-IN",
                "label": "Street extension",
                "length": 35,
                "value": ""
              },
              {
                "n": 82,
                "tech": "QAJA01-BRA-TOWN-A-IN",
                "label": "Town/City",
                "length": 35,
                "value": ""
              },
              {
                "n": 83,
                "tech": "QAJA01-BRA-STATE-A-IN",
                "label": "Region",
                "length": 35,
                "value": ""
              },
              {
                "n": 84,
                "tech": "QAJA01-BRA-POST-C-A-IN",
                "label": "Post code",
                "length": 9,
                "value": ""
              },
              {
                "n": 85,
                "tech": "QAJA01-BRA-POST-O-B-A-IN",
                "label": "PO box",
                "length": 9,
                "value": ""
              },
              {
                "n": 86,
                "tech": "QAJA01-BRA-CTRY-C-IN",
                "label": "Country",
                "length": 3,
                "value": ""
              },
              {
                "n": 87,
                "tech": "QAJA01-BRA-TEL-N-IN",
                "label": "Phone number",
                "length": 18,
                "value": ""
              },
              {
                "n": 88,
                "tech": "QAJA01-BRA-FAX-N-IN",
                "label": "Fax number",
                "length": 18,
                "value": ""
              },
              {
                "n": 89,
                "tech": "QAJA01-BRA-EMAIL-ADRS-A-IN",
                "label": "Email address",
                "length": 70,
                "value": ""
              },
              {
                "n": 90,
                "tech": "QAJA01-BRA-CTF-MAIL-A-IN",
                "label": "Certified email",
                "length": 70,
                "value": ""
              },
              {
                "n": 91,
                "tech": "QAJA01-BRA-PO-BOX-PO-C-A-IN",
                "label": "Post code of PO box",
                "length": 9,
                "value": ""
              },
              {
                "n": 92,
                "tech": "QAJA01-BRA-CY-POST-C-A-IN",
                "label": "Company post code",
                "length": 9,
                "value": ""
              },
              {
                "n": 93,
                "tech": "QAJA01-BRA-HOMPGE-ADDRS-A-IN",
                "label": "Homepage address",
                "length": 70,
                "value": ""
              }
            ]
          },
          {
            "name": "Branch identifier",
            "fields": [
              {
                "n": 94,
                "tech": "QAJA01-BRA-ID-TYP-C-IN",
                "label": "Identifier type",
                "length": 8,
                "value": ""
              },
              {
                "n": 95,
                "tech": "QAJA01-BRA-ID-N-A-IN",
                "label": "Identifier number",
                "length": 20,
                "value": ""
              },
              {
                "n": 96,
                "tech": "QAJA01-BRA-ID-STA-C-IN",
                "label": "Identifier status",
                "length": 3,
                "value": ""
              },
              {
                "n": 97,
                "tech": "QAJA01-BRA-ID-EFF-D-IN",
                "label": "Identifier effective date",
                "length": 10,
                "value": ""
              }
            ]
          },
          {
            "name": "Branch name",
            "fields": [
              {
                "n": 98,
                "tech": "QAJA01-BRA-A-IN",
                "label": "Name",
                "length": 40,
                "value": ""
              },
              {
                "n": 99,
                "tech": "QAJA01-BRA-A-EXT-A-IN",
                "label": "Extension",
                "length": 40,
                "value": ""
              },
              {
                "n": 100,
                "tech": "QAJA01-BRA-A-EFF-D-IN",
                "label": "Effective date",
                "length": 10,
                "value": ""
              },
              {
                "n": 101,
                "tech": "QAJA01-BRA-A-EXT2-A-IN",
                "label": "Second extension",
                "length": 40,
                "value": ""
              }
            ]
          },
          {
            "name": "Branch activity",
            "fields": [
              {
                "n": 102,
                "tech": "QAJA01-BRA-NOMENCLA-C-IN",
                "label": "Nomenclature",
                "length": 8,
                "value": ""
              },
              {
                "n": 103,
                "tech": "QAJA01-BRA-TRD-SEC-C-IN",
                "label": "Trade sector code",
                "length": 5,
                "value": ""
              },
              {
                "n": 104,
                "tech": "QAJA01-BRA-TRD-SC-S-D-IN",
                "label": "Activity start date",
                "length": 10,
                "value": ""
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
                "n": 105,
                "tech": "QAJA01-PRC-WARNING-I-IN",
                "label": "Change to principal warning indicator",
                "length": 1,
                "value": ""
              },
              {
                "n": 106,
                "tech": "QAJA01-EXIST-CHECK-I-IN",
                "label": "Existence check indicator",
                "length": 2,
                "value": ""
              },
              {
                "n": 107,
                "tech": "QAJA01-FLOW-TYP-C-IN",
                "label": "Flow attribute",
                "length": 2,
                "value": ""
              },
              {
                "n": 108,
                "tech": "QAJA01-UPDATE-TYP-C-IN",
                "label": "Type of update",
                "length": 2,
                "value": ""
              }
            ]
          },
          {
            "name": "Bonding Usage",
            "fields": [
              {
                "n": 109,
                "tech": "QAJA01-BOND-M-IN",
                "label": "Bonding exposure (amount)",
                "length": 15,
                "value": "000000000000,000"
              },
              {
                "n": 110,
                "tech": "QAJA01-BOND-CCY-C-IN",
                "label": "Currency",
                "length": 3,
                "value": ""
              },
              {
                "n": 111,
                "tech": "QAJA01-BOND-EFF-D-IN",
                "label": "Effective date",
                "length": 10,
                "value": ""
              }
            ]
          },
          {
            "name": "Bonding Limit",
            "fields": [
              {
                "n": 112,
                "tech": "QAJA01-BOND-LIM-M-IN",
                "label": "Bonding exposure (amount)",
                "length": 15,
                "value": "000000000000,000"
              },
              {
                "n": 113,
                "tech": "QAJA01-BOND-LIM-CCY-C-IN",
                "label": "Currency",
                "length": 3,
                "value": ""
              },
              {
                "n": 114,
                "tech": "QAJA01-BOND-LIM-EGBU-C-IN",
                "label": "Company BU",
                "length": 4,
                "value": ""
              }
            ]
          },
          {
            "name": "Non-latin admin data",
            "fields": [
              {
                "n": 115,
                "tech": "QAJA01-LG-BUSINESS-A-NLT-IN",
                "label": "Business name",
                "length": 120,
                "value": ""
              },
              {
                "n": 116,
                "tech": "QAJA01-THD-A-NLT-IN",
                "label": "Company name",
                "length": 120,
                "value": ""
              },
              {
                "n": 117,
                "tech": "QAJA01-THD-A-EXT-A-NLT-IN",
                "label": "Company name extension",
                "length": 120,
                "value": ""
              },
              {
                "n": 118,
                "tech": "QAJA01-BRA-A-NLT-IN",
                "label": "Branch name",
                "length": 120,
                "value": ""
              },
              {
                "n": 119,
                "tech": "QAJA01-BRA-A-EXT-A-NLT-IN",
                "label": "Branch name extension",
                "length": 120,
                "value": ""
              },
              {
                "n": 120,
                "tech": "QAJA01-BRA-STREET-N-A-NLT-IN",
                "label": "Street number",
                "length": 30,
                "value": ""
              },
              {
                "n": 121,
                "tech": "QAJA01-BRA-STREET-A-NLT-IN",
                "label": "Street name",
                "length": 105,
                "value": ""
              },
              {
                "n": 122,
                "tech": "QAJA01-BRA-ADD-LINE-A-NLT-IN",
                "label": "Street additional line",
                "length": 105,
                "value": ""
              },
              {
                "n": 123,
                "tech": "QAJA01-BRA-TOWN-A-NLT-IN",
                "label": "Town/City",
                "length": 105,
                "value": ""
              },
              {
                "n": 124,
                "tech": "QAJA01-BRA-POST-C-A-NLT-IN",
                "label": "Post code",
                "length": 27,
                "value": ""
              },
              {
                "n": 125,
                "tech": "QAJA01-BRA-POST-O-B-A-NLT-IN",
                "label": "PO Box",
                "length": 27,
                "value": ""
              },
              {
                "n": 126,
                "tech": "QAJA01-THD-ALPH-C-IN",
                "label": "Alphabet code of non-Latin data",
                "length": 2,
                "value": ""
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "rec-2",
    "meta": {
      "Sub-System": "Administrative Data",
      "Reject Source": "Functional",
      "Reject Type": "The creation date must precede the current date",
      "EHBU": "SFAC",
      "Provider ID": "15253699",
      "Date": "11/09/2026",
      "Euler Hermes ID": "0",
      "Country": "FR",
      "Identifier type": "SIREN",
      "Identifier value": "109815399"
    },
    "blocks": [
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
                "value": "STHI"
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
                "value": "0140806123"
              },
              {
                "n": 3,
                "tech": "QAABL1-THD-PVD-ID-N-IN",
                "label": "Provider ID",
                "length": 10,
                "value": "0015253699"
              },
              {
                "n": 4,
                "tech": "QAABL1-PVD-RELIAB-CHECK-I-IN",
                "label": "Provider reliability indicator",
                "length": 1,
                "value": "1"
              },
              {
                "n": 5,
                "tech": "QAABL1-INT-INF-RPT-ID-N-IN",
                "label": "Information report ID",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 6,
                "tech": "QAABL1-IND-QRY-ID-N-IN",
                "label": "Query number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 7,
                "tech": "QAABL1-PACK-ID-N-IN",
                "label": "Package number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 8,
                "tech": "QAABL1-FLOW-S-IN",
                "label": "Provider flow timestamp",
                "length": 26,
                "value": "2026-09-11-23.22.47.000559"
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
                "value": "SIREN"
              },
              {
                "n": 10,
                "tech": "QAABL1-ID-N-A-IN",
                "label": "Identifier number value",
                "length": 20,
                "value": "109815399"
              },
              {
                "n": 11,
                "tech": "QAABL1-A-IN",
                "label": "Company's main name",
                "length": 40,
                "value": "TOURGA OUSSAMA"
              },
              {
                "n": 12,
                "tech": "QAABL1-A-EXT-A-IN",
                "label": "Company's main name extension",
                "length": 40,
                "value": ""
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
                "tech": "QAABL1-POST-C-IN",
                "label": "Post code (main address)",
                "length": 9,
                "value": ""
              },
              {
                "n": 17,
                "tech": "QAABL1-CTRY-C-IN",
                "label": "Country code",
                "length": 3,
                "value": "FR"
              },
              {
                "n": 18,
                "tech": "QAABL1-A-EXT2-A-IN",
                "label": "Company's 2nd name extension",
                "length": 40,
                "value": ""
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
                "n": 19,
                "tech": "QAJA01-THD-STA-C-IN",
                "label": "Status code",
                "length": 1,
                "value": "A"
              },
              {
                "n": 20,
                "tech": "QAJA01-THD-STA-ORI-C-IN",
                "label": "Status origin code",
                "length": 5,
                "value": ""
              },
              {
                "n": 21,
                "tech": "QAJA01-THD-STA-O-EFF-IN",
                "label": "Status origin effective date",
                "length": 10,
                "value": ""
              },
              {
                "n": 22,
                "tech": "QAJA01-THD-LANGUAGE-C-IN",
                "label": "Company language code",
                "length": 2,
                "value": "FR"
              },
              {
                "n": 23,
                "tech": "QAJA01-THD-COMMENT-T-IN",
                "label": "Comment on the company",
                "length": 100,
                "value": ""
              },
              {
                "n": 24,
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
                "n": 25,
                "tech": "QAJA01-LG-CREATE-D-IN",
                "label": "Creation date",
                "length": 10,
                "value": "01/12/2026",
                "error": "Creation date 01/12/2026 is after the reject date"
              },
              {
                "n": 26,
                "tech": "QAJA01-LG-BUS-STRT-D-IN",
                "label": "Business start date",
                "length": 10,
                "value": ""
              },
              {
                "n": 27,
                "tech": "QAJA01-LG-MIN-EMP-Q-IN",
                "label": "Minimum employees number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 28,
                "tech": "QAJA01-LG-MAX-EMP-Q-IN",
                "label": "Maximum employees number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 29,
                "tech": "QAJA01-LG-PUB-ORI-C-IN",
                "label": "Legal publication source code",
                "length": 2,
                "value": ""
              },
              {
                "n": 30,
                "tech": "QAJA01-LG-PUB-REF-A-IN",
                "label": "Legal publication reference",
                "length": 10,
                "value": ""
              },
              {
                "n": 31,
                "tech": "QAJA01-LG-FORM-C-IN",
                "label": "Legal form code",
                "length": 5,
                "value": "NOM6"
              },
              {
                "n": 32,
                "tech": "QAJA01-LG-FORM-EFF-D-IN",
                "label": "Legal form effective date",
                "length": 10,
                "value": ""
              },
              {
                "n": 33,
                "tech": "QAJA01-LG-PUBLIC-BR-I-IN",
                "label": "Public company indicator",
                "length": 1,
                "value": ""
              },
              {
                "n": 34,
                "tech": "QAJA01-LG-BUSINESS-A-IN",
                "label": "Company's trade name",
                "length": 40,
                "value": ""
              }
            ]
          },
          {
            "name": "Identifier",
            "fields": [
              {
                "n": 35,
                "tech": "QAJA01-THD-ID-TYP-C-2-IN",
                "label": "External identifier type code",
                "length": 8,
                "value": ""
              },
              {
                "n": 36,
                "tech": "QAJA01-THD-ID-N-A-2-IN",
                "label": "External identifier number value",
                "length": 20,
                "value": ""
              },
              {
                "n": 37,
                "tech": "QAJA01-THD-ID-STA-C-IN",
                "label": "Identifier status code",
                "length": 3,
                "value": ""
              },
              {
                "n": 38,
                "tech": "QAJA01-THD-ID-EFF-D-IN",
                "label": "Identifier effective date",
                "length": 10,
                "value": ""
              }
            ]
          },
          {
            "name": "Secondary name",
            "fields": [
              {
                "n": 39,
                "tech": "QAJA01-THD-A-N-IN",
                "label": "Secondary name's number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 40,
                "tech": "QAJA01-THD-A-TYP-C-IN",
                "label": "Secondary name type code",
                "length": 2,
                "value": ""
              },
              {
                "n": 41,
                "tech": "QAJA01-THD-A-IN",
                "label": "Secondary name",
                "length": 40,
                "value": "TOURGA OUSSAMA"
              },
              {
                "n": 42,
                "tech": "QAJA01-THD-A-EXT-A-IN",
                "label": "Extension of secondary name",
                "length": 40,
                "value": ""
              },
              {
                "n": 43,
                "tech": "QAJA01-THD-A-EFF-D-IN",
                "label": "Secondary name effective date",
                "length": 10,
                "value": ""
              },
              {
                "n": 44,
                "tech": "QAJA01-THD-A-EXT2-A-IN",
                "label": "2nd extension of secondary name",
                "length": 40,
                "value": ""
              }
            ]
          },
          {
            "name": "Activity / Trade sector",
            "fields": [
              {
                "n": 45,
                "tech": "QAJA01-THD-TRD-SEC-I-IN",
                "label": "Main trade sector indicator",
                "length": 1,
                "value": ""
              },
              {
                "n": 46,
                "tech": "QAJA01-THD-NOMENCLA-C-IN",
                "label": "Nomenclature code",
                "length": 8,
                "value": ""
              },
              {
                "n": 47,
                "tech": "QAJA01-THD-TRD-SC-C-IN",
                "label": "Trade sector code",
                "length": 5,
                "value": ""
              },
              {
                "n": 48,
                "tech": "QAJA01-THD-TRD-SC-S-D-IN",
                "label": "Activity start date",
                "length": 10,
                "value": ""
              },
              {
                "n": 49,
                "tech": "QAJA01-THD-TRD-SC-N-IN",
                "label": "Trade sector number",
                "length": 10,
                "value": "0000000000"
              }
            ]
          },
          {
            "name": "Financial data",
            "fields": [
              {
                "n": 50,
                "tech": "QAJA01-SHARE-CAP-M-IN",
                "label": "Share capital amount",
                "length": 15,
                "value": "000000000000000"
              },
              {
                "n": 51,
                "tech": "QAJA01-ISSUED-CAP-M-IN",
                "label": "Issued capital amount",
                "length": 15,
                "value": "000000000000000"
              },
              {
                "n": 52,
                "tech": "QAJA01-IK-CONTR-TYP-C-IN",
                "label": "Type of contribution in kind",
                "length": 2,
                "value": ""
              },
              {
                "n": 53,
                "tech": "QAJA01-IK-CONTR-M-IN",
                "label": "Contribution in kind amount",
                "length": 15,
                "value": "000000000000000"
              },
              {
                "n": 54,
                "tech": "QAJA01-AN-GEN-MTING-D-IN",
                "label": "Date of Anual General Meeting",
                "length": 10,
                "value": ""
              },
              {
                "n": 55,
                "tech": "QAJA01-FIN-DATA-CCY-C-IN",
                "label": "Financial's currency",
                "length": 3,
                "value": ""
              },
              {
                "n": 56,
                "tech": "QAJA01-TURNOVER-M-IN",
                "label": "Turnover amount",
                "length": 15,
                "value": "000000000000000"
              },
              {
                "n": 57,
                "tech": "QAJA01-TURNOVER-D-IN",
                "label": "Turnover Date",
                "length": 10,
                "value": ""
              },
              {
                "n": 58,
                "tech": "QAJA01-TURNOVER-TYPE-C-IN",
                "label": "Turnover Type",
                "length": 2,
                "value": ""
              },
              {
                "n": 59,
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
                "n": 60,
                "tech": "QAJA01-BUILDING-TYP-A-IN",
                "label": "Type of building",
                "length": 25,
                "value": ""
              },
              {
                "n": 61,
                "tech": "QAJA01-SIZE-A-IN",
                "label": "Surface area",
                "length": 10,
                "value": ""
              },
              {
                "n": 62,
                "tech": "QAJA01-LOCATION-TYP-A-IN",
                "label": "Type of location",
                "length": 25,
                "value": ""
              },
              {
                "n": 63,
                "tech": "QAJA01-OWNERSHIP-C-IN",
                "label": "Ownership code",
                "length": 1,
                "value": ""
              }
            ]
          },
          {
            "name": "Personal data",
            "fields": [
              {
                "n": 64,
                "tech": "QAJA01-IND-TITLE-C-IN",
                "label": "Title",
                "length": 4,
                "value": ""
              },
              {
                "n": 65,
                "tech": "QAJA01-IND-SEX-C-IN",
                "label": "Sex",
                "length": 1,
                "value": "1"
              },
              {
                "n": 66,
                "tech": "QAJA01-IND-BIRTH-D-IN",
                "label": "Date of birth",
                "length": 10,
                "value": ""
              },
              {
                "n": 67,
                "tech": "QAJA01-IND-SUF-A-IN",
                "label": "Suffix",
                "length": 25,
                "value": ""
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
                "n": 68,
                "tech": "QAJA01-BRANCH-N-IN",
                "label": "Branch number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 69,
                "tech": "QAJA01-BRA-LANGUAGE-C-IN",
                "label": "Language",
                "length": 2,
                "value": ""
              },
              {
                "n": 70,
                "tech": "QAJA01-BRA-COMMENT-T-IN",
                "label": "Comment on Branch",
                "length": 100,
                "value": ""
              }
            ]
          },
          {
            "name": "Legal entity",
            "fields": [
              {
                "n": 71,
                "tech": "QAJA01-BRA-CREATE-D-IN",
                "label": "Creation date",
                "length": 10,
                "value": ""
              },
              {
                "n": 72,
                "tech": "QAJA01-BRA-BUS-STRT-D-IN",
                "label": "Business start date",
                "length": 10,
                "value": ""
              },
              {
                "n": 73,
                "tech": "QAJA01-BRA-MIN-EMP-Q-IN",
                "label": "Minimum employees number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 74,
                "tech": "QAJA01-BRA-MAX-EMP-Q-IN",
                "label": "Maximum employees number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 75,
                "tech": "QAJA01-BRA-PUB-ORI-C-IN",
                "label": "Legal publication source code",
                "length": 2,
                "value": ""
              },
              {
                "n": 76,
                "tech": "QAJA01-BRA-PUB-REF-A-IN",
                "label": "Legal publication reference",
                "length": 10,
                "value": ""
              }
            ]
          },
          {
            "name": "Branch address",
            "fields": [
              {
                "n": 77,
                "tech": "QAJA01-PRC-ADDR-I-IN",
                "label": "Main address indicator",
                "length": 1,
                "value": ""
              },
              {
                "n": 78,
                "tech": "QAJA01-BRA-ADDR-TYP-C-IN",
                "label": "Address type",
                "length": 1,
                "value": ""
              },
              {
                "n": 79,
                "tech": "QAJA01-BRA-STREET-N-A-IN",
                "label": "Street number",
                "length": 10,
                "value": "3"
              },
              {
                "n": 80,
                "tech": "QAJA01-BRA-STREET-A-IN",
                "label": "Street name",
                "length": 35,
                "value": "RUE GABRIEL PERI"
              },
              {
                "n": 81,
                "tech": "QAJA01-BRA-ADD-LINE-A-IN",
                "label": "Street extension",
                "length": 35,
                "value": ""
              },
              {
                "n": 82,
                "tech": "QAJA01-BRA-TOWN-A-IN",
                "label": "Town/City",
                "length": 35,
                "value": "VANDŒUVRE-LES-NANCY"
              },
              {
                "n": 83,
                "tech": "QAJA01-BRA-STATE-A-IN",
                "label": "Region",
                "length": 35,
                "value": "54"
              },
              {
                "n": 84,
                "tech": "QAJA01-BRA-POST-C-A-IN",
                "label": "Post code",
                "length": 9,
                "value": "54500"
              },
              {
                "n": 85,
                "tech": "QAJA01-BRA-POST-O-B-A-IN",
                "label": "PO box",
                "length": 9,
                "value": ""
              },
              {
                "n": 86,
                "tech": "QAJA01-BRA-CTRY-C-IN",
                "label": "Country",
                "length": 3,
                "value": "FR"
              },
              {
                "n": 87,
                "tech": "QAJA01-BRA-TEL-N-IN",
                "label": "Phone number",
                "length": 18,
                "value": ""
              },
              {
                "n": 88,
                "tech": "QAJA01-BRA-FAX-N-IN",
                "label": "Fax number",
                "length": 18,
                "value": ""
              },
              {
                "n": 89,
                "tech": "QAJA01-BRA-EMAIL-ADRS-A-IN",
                "label": "Email address",
                "length": 70,
                "value": ""
              },
              {
                "n": 90,
                "tech": "QAJA01-BRA-CTF-MAIL-A-IN",
                "label": "Certified email",
                "length": 70,
                "value": ""
              },
              {
                "n": 91,
                "tech": "QAJA01-BRA-PO-BOX-PO-C-A-IN",
                "label": "Post code of PO box",
                "length": 9,
                "value": ""
              },
              {
                "n": 92,
                "tech": "QAJA01-BRA-CY-POST-C-A-IN",
                "label": "Company post code",
                "length": 9,
                "value": ""
              },
              {
                "n": 93,
                "tech": "QAJA01-BRA-HOMPGE-ADDRS-A-IN",
                "label": "Homepage address",
                "length": 70,
                "value": ""
              }
            ]
          },
          {
            "name": "Branch identifier",
            "fields": [
              {
                "n": 94,
                "tech": "QAJA01-BRA-ID-TYP-C-IN",
                "label": "Identifier type",
                "length": 8,
                "value": ""
              },
              {
                "n": 95,
                "tech": "QAJA01-BRA-ID-N-A-IN",
                "label": "Identifier number",
                "length": 20,
                "value": ""
              },
              {
                "n": 96,
                "tech": "QAJA01-BRA-ID-STA-C-IN",
                "label": "Identifier status",
                "length": 3,
                "value": ""
              },
              {
                "n": 97,
                "tech": "QAJA01-BRA-ID-EFF-D-IN",
                "label": "Identifier effective date",
                "length": 10,
                "value": ""
              }
            ]
          },
          {
            "name": "Branch name",
            "fields": [
              {
                "n": 98,
                "tech": "QAJA01-BRA-A-IN",
                "label": "Name",
                "length": 40,
                "value": "TOURGA OUSSAMA"
              },
              {
                "n": 99,
                "tech": "QAJA01-BRA-A-EXT-A-IN",
                "label": "Extension",
                "length": 40,
                "value": ""
              },
              {
                "n": 100,
                "tech": "QAJA01-BRA-A-EFF-D-IN",
                "label": "Effective date",
                "length": 10,
                "value": ""
              },
              {
                "n": 101,
                "tech": "QAJA01-BRA-A-EXT2-A-IN",
                "label": "Second extension",
                "length": 40,
                "value": ""
              }
            ]
          },
          {
            "name": "Branch activity",
            "fields": [
              {
                "n": 102,
                "tech": "QAJA01-BRA-NOMENCLA-C-IN",
                "label": "Nomenclature",
                "length": 8,
                "value": ""
              },
              {
                "n": 103,
                "tech": "QAJA01-BRA-TRD-SEC-C-IN",
                "label": "Trade sector code",
                "length": 5,
                "value": ""
              },
              {
                "n": 104,
                "tech": "QAJA01-BRA-TRD-SC-S-D-IN",
                "label": "Activity start date",
                "length": 10,
                "value": ""
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
                "n": 105,
                "tech": "QAJA01-PRC-WARNING-I-IN",
                "label": "Change to principal warning indicator",
                "length": 1,
                "value": ""
              },
              {
                "n": 106,
                "tech": "QAJA01-EXIST-CHECK-I-IN",
                "label": "Existence check indicator",
                "length": 2,
                "value": ""
              },
              {
                "n": 107,
                "tech": "QAJA01-FLOW-TYP-C-IN",
                "label": "Flow attribute",
                "length": 2,
                "value": ""
              },
              {
                "n": 108,
                "tech": "QAJA01-UPDATE-TYP-C-IN",
                "label": "Type of update",
                "length": 2,
                "value": ""
              }
            ]
          },
          {
            "name": "Bonding Usage",
            "fields": [
              {
                "n": 109,
                "tech": "QAJA01-BOND-M-IN",
                "label": "Bonding exposure (amount)",
                "length": 15,
                "value": "000000000000,000"
              },
              {
                "n": 110,
                "tech": "QAJA01-BOND-CCY-C-IN",
                "label": "Currency",
                "length": 3,
                "value": ""
              },
              {
                "n": 111,
                "tech": "QAJA01-BOND-EFF-D-IN",
                "label": "Effective date",
                "length": 10,
                "value": ""
              }
            ]
          },
          {
            "name": "Bonding Limit",
            "fields": [
              {
                "n": 112,
                "tech": "QAJA01-BOND-LIM-M-IN",
                "label": "Bonding exposure (amount)",
                "length": 15,
                "value": "000000000000,000"
              },
              {
                "n": 113,
                "tech": "QAJA01-BOND-LIM-CCY-C-IN",
                "label": "Currency",
                "length": 3,
                "value": ""
              },
              {
                "n": 114,
                "tech": "QAJA01-BOND-LIM-EGBU-C-IN",
                "label": "Company BU",
                "length": 4,
                "value": ""
              }
            ]
          },
          {
            "name": "Non-latin admin data",
            "fields": [
              {
                "n": 115,
                "tech": "QAJA01-LG-BUSINESS-A-NLT-IN",
                "label": "Business name",
                "length": 120,
                "value": ""
              },
              {
                "n": 116,
                "tech": "QAJA01-THD-A-NLT-IN",
                "label": "Company name",
                "length": 120,
                "value": ""
              },
              {
                "n": 117,
                "tech": "QAJA01-THD-A-EXT-A-NLT-IN",
                "label": "Company name extension",
                "length": 120,
                "value": ""
              },
              {
                "n": 118,
                "tech": "QAJA01-BRA-A-NLT-IN",
                "label": "Branch name",
                "length": 120,
                "value": ""
              },
              {
                "n": 119,
                "tech": "QAJA01-BRA-A-EXT-A-NLT-IN",
                "label": "Branch name extension",
                "length": 120,
                "value": ""
              },
              {
                "n": 120,
                "tech": "QAJA01-BRA-STREET-N-A-NLT-IN",
                "label": "Street number",
                "length": 30,
                "value": ""
              },
              {
                "n": 121,
                "tech": "QAJA01-BRA-STREET-A-NLT-IN",
                "label": "Street name",
                "length": 105,
                "value": ""
              },
              {
                "n": 122,
                "tech": "QAJA01-BRA-ADD-LINE-A-NLT-IN",
                "label": "Street additional line",
                "length": 105,
                "value": ""
              },
              {
                "n": 123,
                "tech": "QAJA01-BRA-TOWN-A-NLT-IN",
                "label": "Town/City",
                "length": 105,
                "value": ""
              },
              {
                "n": 124,
                "tech": "QAJA01-BRA-POST-C-A-NLT-IN",
                "label": "Post code",
                "length": 27,
                "value": ""
              },
              {
                "n": 125,
                "tech": "QAJA01-BRA-POST-O-B-A-NLT-IN",
                "label": "PO Box",
                "length": 27,
                "value": ""
              },
              {
                "n": 126,
                "tech": "QAJA01-THD-ALPH-C-IN",
                "label": "Alphabet code of non-Latin data",
                "length": 2,
                "value": ""
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "rec-3",
    "meta": {
      "Sub-System": "Payment History",
      "Reject Source": "Functional",
      "Reject Type": "Payment incident non-existent in base",
      "EHBU": "TI",
      "Provider ID": "30542851",
      "Date": "09/10/2026",
      "Euler Hermes ID": "82893654",
      "Country": "GB",
      "Identifier type": "DUN",
      "Identifier value": "347909702"
    },
    "blocks": [
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
                "value": "DPAY"
              }
            ]
          },
          {
            "name": "Provider",
            "fields": [
              {
                "n": 2,
                "tech": "QAABL1-FULL-RPT-ID-N-IN",
                "label": "Full report ID",
                "length": 10,
                "value": "0140920184"
              },
              {
                "n": 3,
                "tech": "QAABL1-THD-PVD-ID-N-IN",
                "label": "Provider ID",
                "length": 10,
                "value": "0030542851"
              },
              {
                "n": 4,
                "tech": "QAABL1-INF-RPRT-ID-N-IN",
                "label": "Information report ID",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 5,
                "tech": "QAABL1-INQ-NUM-N-IN",
                "label": "Query number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 6,
                "tech": "QAABL1-PACK-NUM-N-IN",
                "label": "Package number",
                "length": 10,
                "value": "0000000000"
              },
              {
                "n": 7,
                "tech": "QAABL1-FLOW-S-IN",
                "label": "Flow timestamp",
                "length": 26,
                "value": "2026-10-09-09.45.44.000855"
              }
            ]
          },
          {
            "name": "Company identification",
            "fields": [
              {
                "n": 8,
                "tech": "QAABL1-ID-TYP-C-IN",
                "label": "Identifier type code",
                "length": 8,
                "value": "DUN"
              },
              {
                "n": 9,
                "tech": "QAABL1-ID-N-A-IN",
                "label": "Identifier number value",
                "length": 20,
                "value": "347909702"
              },
              {
                "n": 10,
                "tech": "QAABL1-A-IN",
                "label": "Company's main name",
                "length": 40,
                "value": "P & C INVESTMENTS LIMITED"
              },
              {
                "n": 11,
                "tech": "QAABL1-A-EXT-A-IN",
                "label": "Company's main name extension",
                "length": 40,
                "value": ""
              },
              {
                "n": 12,
                "tech": "QAABL1-STREET-N-A-IN",
                "label": "Street number (main address)",
                "length": 10,
                "value": ""
              },
              {
                "n": 13,
                "tech": "QAABL1-STREET-A-IN",
                "label": "Street name (main address)",
                "length": 35,
                "value": ""
              },
              {
                "n": 14,
                "tech": "QAABL1-TOWN-A-IN",
                "label": "Town/City (main address)",
                "length": 35,
                "value": ""
              },
              {
                "n": 15,
                "tech": "QAABL1-POST-C-IN",
                "label": "Post code (main address)",
                "length": 9,
                "value": ""
              },
              {
                "n": 16,
                "tech": "QAABL1-CTRY-C-IN",
                "label": "Country code",
                "length": 3,
                "value": "GB"
              }
            ]
          }
        ]
      },
      {
        "name": "PAYMENT INCIDENT",
        "sections": [
          {
            "name": "Incident data",
            "fields": [
              {
                "n": 17,
                "tech": "QAJH05-INCIDENT-FAMILY-C",
                "label": "Incident family code",
                "length": 3,
                "value": "LEG"
              },
              {
                "n": 18,
                "tech": "QAJH05-INCIDENT-TYPE-C-IN",
                "label": "Incident type code",
                "length": 3,
                "value": "CCJ"
              },
              {
                "n": 19,
                "tech": "QAJH05-INCIDENT-ORIGIN-C-IN",
                "label": "Incident origin code",
                "length": 3,
                "value": "CCO"
              },
              {
                "n": 20,
                "tech": "QAJH05-PVD-EVT-ID-N-IN",
                "label": "Provider event ID",
                "length": 20,
                "value": "F9DT8J93",
                "error": "No payment incident with this provider event ID in base"
              }
            ]
          },
          {
            "name": "Identification of the buyer",
            "fields": [
              {
                "n": 21,
                "tech": "QAJH05-DEBTOR-ID-N-IN",
                "label": "Debtor ID",
                "length": 20,
                "value": "F9DT8J93"
              },
              {
                "n": 22,
                "tech": "QAJH05-INCIDENT-STATE-C-IN",
                "label": "Incident state code",
                "length": 3,
                "value": "NSA"
              },
              {
                "n": 23,
                "tech": "QAJH05-INCIDENT-M-IN",
                "label": "Incident amount",
                "length": 15,
                "value": "000000001672,000"
              },
              {
                "n": 24,
                "tech": "QAJH05-INCIDENT-CCY-C-IN",
                "label": "Incident currency",
                "length": 3,
                "value": "GBP"
              },
              {
                "n": 25,
                "tech": "QAJH05-INCIDENT-KEY-D-IN",
                "label": "Incident key date",
                "length": 10,
                "value": "26/11/2019"
              }
            ]
          },
          {
            "name": "Identification of the creditor",
            "fields": [
              {
                "n": 26,
                "tech": "QAJH05-INITIAL-DUE-D-IN",
                "label": "Initial due date",
                "length": 10,
                "value": "26/11/2019"
              },
              {
                "n": 27,
                "tech": "QAJH05-CREDITOR-A-IN",
                "label": "Name of the creditor",
                "length": 35,
                "value": ""
              },
              {
                "n": 28,
                "tech": "QAJH05-CREDITOR-ADRSS-A-IN",
                "label": "Address of the creditor",
                "length": 40,
                "value": ""
              },
              {
                "n": 29,
                "tech": "QAJH05-CREDITOR-POST-C-IN",
                "label": "Post code of the creditor",
                "length": 9,
                "value": ""
              },
              {
                "n": 30,
                "tech": "QAJH05-CREDITOR-TOWN-A-IN",
                "label": "City of the creditor",
                "length": 35,
                "value": ""
              },
              {
                "n": 31,
                "tech": "QAJH05-CREDITOR-CTRY-C-IN",
                "label": "Country code of the creditor",
                "length": 3,
                "value": ""
              }
            ]
          },
          {
            "name": "Claims incidents (incident family = CLM)",
            "fields": [
              {
                "n": 32,
                "tech": "QAJH05-CLM-INVOICE-D-IN",
                "label": "Invoice date",
                "length": 10,
                "value": ""
              },
              {
                "n": 33,
                "tech": "QAJH05-CLM-FIL-OPN-D-IN",
                "label": "Claim file opening date",
                "length": 10,
                "value": ""
              },
              {
                "n": 34,
                "tech": "QAJH05-CLM-FIL-END-D-IN",
                "label": "Claim file end date",
                "length": 10,
                "value": ""
              },
              {
                "n": 35,
                "tech": "QAJH05-SUM-CONTR-M-IN",
                "label": "Total amount of credit",
                "length": 15,
                "value": "000000000000,000"
              },
              {
                "n": 36,
                "tech": "QAJH05-SUM-INSTALLMENT-Q-IN",
                "label": "Total number of payments",
                "length": 5,
                "value": "00000"
              },
              {
                "n": 37,
                "tech": "QAJH05-ODUE-INTVN-STA-C",
                "label": "Overdue intervention status code",
                "length": 3,
                "value": ""
              },
              {
                "n": 38,
                "tech": "QAJH05-GUARANTEED-M-IN",
                "label": "Guaranteed amount",
                "length": 15,
                "value": "000000000000,000"
              },
              {
                "n": 39,
                "tech": "QAJH05-GUARANT-CCY-C",
                "label": "Guaranteed amount currency",
                "length": 3,
                "value": ""
              }
            ]
          },
          {
            "name": "Legal Decisions (incident family = LEG)",
            "fields": [
              {
                "n": 40,
                "tech": "QAJH05-SETTLEMENT-DATE-IN",
                "label": "Settlement date",
                "length": 10,
                "value": ""
              }
            ]
          },
          {
            "name": "ONSS incidents and \"Registration of secured debt\" (family incidents = TAX)",
            "fields": [
              {
                "n": 41,
                "tech": "QAJH05-DISPUTED-M-IN",
                "label": "Disputed amount",
                "length": 15,
                "value": "000000001672,000"
              },
              {
                "n": 42,
                "tech": "QAJH05-DISPUTED-CCY-C-IN",
                "label": "Disputed amount currency",
                "length": 3,
                "value": "GBP"
              },
              {
                "n": 43,
                "tech": "QAJH05-DEBT-PERCENT-X-IN",
                "label": "Debt percentage",
                "length": 8,
                "value": "00000,000"
              }
            ]
          },
          {
            "name": "ODDB incidents (incidents family = OFF)",
            "fields": [
              {
                "n": 44,
                "tech": "QAJH05-BDF-ACCEPTED-I-IN",
                "label": "Acceptance indicator for BDF incidents",
                "length": 1,
                "value": ""
              },
              {
                "n": 45,
                "tech": "QAJH05-IND-BDF-EVT-Q-IN",
                "label": "Number of BDF incidents",
                "length": 5,
                "value": "00001"
              }
            ]
          },
          {
            "name": "Others",
            "fields": [
              {
                "n": 46,
                "tech": "QAJH05-LTT-INDEMNITY-D-IN",
                "label": "Last indemnification date",
                "length": 10,
                "value": ""
              },
              {
                "n": 47,
                "tech": "QAJH05-LTT-SOCSEC-REQT-D-IN",
                "label": "Last ONSS enquiry request date",
                "length": 10,
                "value": ""
              },
              {
                "n": 48,
                "tech": "QAJH05-STDY-PVD-STRT-D",
                "label": "Score analysis date",
                "length": 5,
                "value": "0000,0"
              },
              {
                "n": 49,
                "tech": "QAJH05-PVD-SCRE-Q",
                "label": "Score attributed by the provider to the company",
                "length": 3,
                "value": "00,0"
              },
              {
                "n": 50,
                "tech": "QAJH05-PAYM-TRM-C1 (PAYM, occurs)",
                "label": "Payment condition",
                "length": 1,
                "value": ""
              },
              {
                "n": 51,
                "tech": "QAJH05-PAYM-PERC-X1 (PAYM, occurs)",
                "label": "Payment percentage for the condition",
                "length": 7,
                "value": "0000,000"
              },
              {
                "n": 52,
                "tech": "QAJH05-PAYM-TRM-C2 (PAYM, occurs)",
                "label": "Payment condition",
                "length": 1,
                "value": ""
              },
              {
                "n": 53,
                "tech": "QAJH05-PAYM-PERC-X2 (PAYM, occurs)",
                "label": "Payment percentage for the condition",
                "length": 7,
                "value": "0000,000"
              },
              {
                "n": 54,
                "tech": "QAJH05-PAYM-TRM-C3 (PAYM, occurs)",
                "label": "Payment condition",
                "length": 1,
                "value": ""
              },
              {
                "n": 55,
                "tech": "QAJH05-PAYM-PERC-X3 (PAYM, occurs)",
                "label": "Payment percentage for the condition",
                "length": 7,
                "value": "0000,000"
              },
              {
                "n": 56,
                "tech": "QAJH05-PAYM-TRM-C4 (PAYM, occurs)",
                "label": "Payment condition",
                "length": 1,
                "value": ""
              },
              {
                "n": 57,
                "tech": "QAJH05-PAYM-PERC-X4 (PAYM, occurs)",
                "label": "Payment percentage for the condition",
                "length": 7,
                "value": "0000,000"
              },
              {
                "n": 58,
                "tech": "QAJH05-PAYM-TRM-C5 (PAYM, occurs)",
                "label": "Payment condition",
                "length": 1,
                "value": ""
              },
              {
                "n": 59,
                "tech": "QAJH05-PAYM-PERC-X5 (PAYM, occurs)",
                "label": "Payment percentage for the condition",
                "length": 7,
                "value": "0000,000"
              },
              {
                "n": 60,
                "tech": "QAJH05-CLM-RECOVER-M-IN",
                "label": "Claimed amount to recover",
                "length": 15,
                "value": "000000000000,000"
              },
              {
                "n": 61,
                "tech": "QAJH05-CLM-RECOVER-CCY-C",
                "label": "Claimed amount to recover currency",
                "length": 3,
                "value": ""
              },
              {
                "n": 62,
                "tech": "QAJH05-COMMENT-T-IN",
                "label": "Comment of the creditor about payement incident",
                "length": 500,
                "value": "Initial Collection Amount : 1672.0 GBP"
              }
            ]
          }
        ]
      }
    ]
  }
];
