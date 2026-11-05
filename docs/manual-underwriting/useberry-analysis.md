# Useberry analysis: Manual Underwriting (IRP Credit Limit Decision)

Source: Useberry export "All users" (untested prototype of the IRP Credit Limit Decision interface), 197 sessions, 44 columns, collected 23 to 28 Oct 2026. Parsed with a custom RFC4180 parser. No personal data is quoted; free text is paraphrased.

Convention: "n" is the number of sessions that answered the question (Useberry keeps partial answers from DROP_OFF sessions, so n differs per question). Percentages use that n as base. Everything marked **(inference)** is my interpretation, not a fact of the dataset.

## 1. Sessions

| Item | Count | Share |
|---|---|---|
| Total sessions | 197 | 100% |
| Status SUCCESS (complete) | 140 | 71% |
| Status DROP_OFF | 57 | 29% |
| Drop-offs that stopped right after the profile questions (before the first screen question) | 34 | 60% of drop-offs |
| Distinct SessionIDs | 197 | no duplicates |
| Device | Desktop 197 | Edge 196, Firefox 1 |

I used every answer given, whatever the status. Restricting to SUCCESS changes the base only slightly (multi-select n goes from 145 to 134 on Insured Summary, 138 to 134 on the other blocks), so percentages move by a point or two.

## 2. Participant profile (aggregate)

| Dimension | Result (n answered) |
|---|---|
| Region/LOB (184) | Solunion 41 (22%), France 35 (19%), APAC 33 (18%), DACH 33 (18%), MMEA 14 (8%), Americas 10 (5%), Group 10 (5%), MNC 8 (4%) |
| Country of session (197) | DE 50, FR 29, ES 22, AT 17, SG 17, CO 14, US 10, AU 8, MX 5, others 25 (19 countries in total) |
| Business Unit (173) | Free text, more than 100 spellings (NEUR + country, GCC, RIC, RCC, Solunion + country...). Mostly "Risk/Credit Underwriting" teams. Not usable as a clean category without manual recoding |
| Application used (172) | Both IRP and Qirin 154 (90%), IRP only 17 (10%), Qirin only 1 |
| Qirin use frequency (171) | Daily 161 (94%), a few times a week 7 (4%), a few times a month 1, rarely or never 2 |
| Manual Underwriting familiarity, 0 to 5 scale (168) | 5: 91 (54%), 4: 22 (13%), 3: 18 (11%), 2: 10 (6%), 1: 6 (4%), 0: 21 (13%) |
| Super User (flag present) | 28 sessions (14%). Of those, 18 rate themselves 5/5 on familiarity |
| First attempt | 183 sessions flagged "1" (yes). 4 free-text explanations of a previous non-completion (postponed, misread the question) |

Reading: a seasoned, daily-user, desktop audience; the panel is credible for a power-user design. DACH, France and Solunion are about 60% of the sample.

## 3. Structure of the questionnaire

44 columns. 0 to 8 are session metadata, 9 to 16 profile, 17 to 43 the study itself. Order, grouped by block:

| # | Block (name as in headers) | Columns | Question and answer type |
|---|---|---|---|
| P1 | PART1 "Manual Uwing for CLR" job to do | 17 | "Is Manual Underwriting for Credit Limit Request a reason you might use the feature?" Yes (1) / blank |
| 0 | `# 00 Buyer Summary block` | 18 | "Do you need to access any of the highlighted links to perform Manual Underwriting?" Yes (1) / blank |
| 0b | `# 00 Buyer Summary extra` | 19 | "How do these features help you?" Free text |
| 1 | `#1 Insured Summary block` | 20 | "Select the data you typically consult" Multi-select of data fields + "Other" free text |
| 1b | `#1 Insured Summary extra` | 21 | "Need more info via this button?" Yes (1) / blank |
| 1c | `#1 Insured Summary more 1` to `more 6`, `more 6 Copy` | 22 to 28 | One free text per Policy Analysis tab: General Data, Validity, Links, Limit Management, Product, Services, List Context/Type Condition |
| 2 | `#2 Current Limit block` | 29 | Multi-select + Other |
| 2b | `#2 Current Limit extra` | 30 | Yes (1) / blank (button) |
| 2c | `#2 Current Limit more` | 31 | Free text (Insured History view) |
| 3 | `#3 Request block` | 32 | Multi-select + Other |
| 3b | `#3 Request extra` | 33 | Yes (1) / blank (button) |
| 3c | `#3 Request more` | 34 | Free text (Request details) |
| 4 | `#4 Answer` | 35 | "Select the data you typically **complete or select**" Multi-select + Other |
| 4b | `#4 Answer extra` | 36 | "Need the 2 links?" Yes (1) / blank |
| 4c | `#4 Answer more` (two columns, same name) | 37, 38 | Free text: "enter conditions" link, then "Preview Endorsement Text: Reason and Standard Narratives" link |
| P2 | PART2 "Validation by UW for CLD" job to do | 39 | Yes (1) / blank |
| V | `"Validation by UW for CLD" view` | 40 | "Select the data you typically check to validate a decision from another user" Multi-select + Other |
| P3 | PART3 Other reasons to use Manual Underwriting | 41, 42 | Yes (1) / blank, then free text "tell us about these other reasons" |
| C | CONCLUSION | 43 | Free text, anything else to share |

So: 6 screen blocks (Buyer Summary, Insured Summary, Current Limit, Request, Answer, Validation view), 3 job-to-do gates, 1 conclusion. Insured Summary alone carries 8 follow-up questions.

### Options proposed per multi-select
Useberry exports only the selected values, never the full option list. Options below are reconstructed from selections reaching 3 or more picks **(inference: never-picked options are invisible)**.

- **Insured Summary (14):** Insured name, Policy number, Policy type, Primary / TopUp / TopUp + limit(s) (CAP / CAP+), Policy Grade, Days (or months), Thresholds, Warnings, Risk Credit Manager, Broker name, Can use policyholder name indicator, Insured percentage, Language, Nace Code.
- **Current Limit (10):** Request, Answer, Temp, Terms of payment, ADT, UW name, Spec., Polit., Links, Self retention.
- **Request (15):** Temporary increase, Date of request, Permanent, Narrative, Limited to, Credit period, Date of input, Negative buyer information, Warnings, Origin, Complain, Self retention, Condition for purchase, Retention of title agreed by the buyer, Securities indicator.
- **Answer (12):** Answer, Reason, Permanent, Limited to (listed twice: permanent and temporary), With "XX" days (invoice date), Temporary increase, With XX days, Invoice, Notifications, Provisionally, Progress advice.
- **Validation view (13):** Answer, Date, Prepared by, Remarks, Permanent, Limited to (permanent), With (permanent), Temporary increase, Limited to (temporary increase), With (temporary increase), Reason, Validations, "See conditions" link.

## 4. Results per block

### 4.0 Buyer Summary (identity and links)
- Links needed: **135 yes**. The base is ambiguous (see Gaps); against the 145 sessions that reached the next block that is about 93%.
- Free text (n=129), themes:
  - About half (61) cite the document store (EDM / Jade) as the place for credit reports, financial statements and earlier decision evidence.
  - About 60 mention financials, information reports or spreads reached through the links (a viewer for detailed financial statements).
  - "Add third party", notepad, latest credit limits, latest incidents and exposure are cited as frequent shortcuts.
  - A minority want policyholder context here (loss ratio, premium, years as customer, policy features).
  - A few say the links help little, or answer with a single character.

### 4.1 Insured Summary (n=145)

| Data item | Picks | % |
|---|---|---|
| Insured name | 130 | 90% |
| Policy number | 112 | 77% |
| Primary / TopUp / TopUp + limit(s) | 110 | 76% |
| Policy type | 106 | 73% |
| Policy Grade | 103 | 71% |
| Days (or months) | 102 | 70% |
| Thresholds | 83 | 57% |
| Warnings | 77 | 53% |
| Risk Credit Manager | 77 | 53% |
| Broker name | 72 | 50% |
| Can use policyholder name indicator | 67 | 46% |
| Insured percentage | 66 | 46% |
| Language | 66 | 46% |
| Nace Code | 34 | 23% |

Write-ins (1 to 3 people each): loss ratio, policy colour/performance, premium, maximum liability, risk horizon, renewal status or date, discretionary limit (DCL), claims history, sector, current exposure, fronter.

- "Need more via the button": 81 of 145 (56%).
- Policy Analysis tabs (free text, n=75 to 79 each). Rough share of answers saying "I do not use / not relevant" (keyword count, approximate):

| Tab | n | Non-use answers |
|---|---|---|
| General Data | 79 | about 14% (useful: policy grade, currency, renewal, loss ratio, policy type) |
| Validity | 78 | about 35% (users want renewal date, contract period, tenure of the policyholder) |
| Links | 76 | about 59% |
| Limit Management | 76 | about 54% |
| Product | 75 | about 51% (those who use it want product family, LoB, whole turnover vs single risk) |
| Services | 75 | about 55% (users want to know about attached services such as DCL) |
| List Context/Type Condition | 75 | about 56% (a few say they do not understand it) |

Themes: General Data and Validity matter, the other five tabs are marginal for the daily decision. Recurring request: surface loss ratio, premium, policy colour and renewal timing directly. Some teams use a local system instead of IRP for policy details.

### 4.2 Current Limit (n=138)

| Data item | Picks | % |
|---|---|---|
| Request | 127 | 92% |
| Answer | 127 | 92% |
| Temp | 125 | 91% |
| Terms of payment | 108 | 78% |
| ADT | 95 | 69% |
| UW name | 79 | 57% |
| Spec. | 64 | 46% |
| Polit. | 49 | 36% |
| Links | 49 | 36% |
| Self retention | 43 | 31% |

Write-ins: aggregated exposure on the buyer group, decision date and codes of the previous decision, link to limit history, internal comment, cap/cap+ limit.

- Need more via button: 97 of 138 (70%). Free text (n=96), themes:
  - About 70% describe the history of limits and decisions (earlier requests, increases, temporary limits, withdrawals).
  - They want the reasons and author of previous decisions, to stay consistent and understand colleagues' choices.
  - Used to detect restore cases, transfers, cancellations and commercial gestures that cannot be withdrawn.
  - Original and reference currency matter.
  - A few ask for the latest valuation to be always visible.

### 4.3 Request (n=138)

| Data item | Picks | % |
|---|---|---|
| Temporary increase | 128 | 93% |
| Date of request | 122 | 88% |
| Permanent | 122 | 88% |
| Narrative | 116 | 84% |
| Limited to | 105 | 76% |
| Credit period | 91 | 66% |
| Date of input | 81 | 59% |
| Negative buyer information | 78 | 57% |
| Warnings | 65 | 47% |
| Origin | 62 | 45% |
| Complain | 45 | 33% |
| Self retention | 42 | 30% |
| Condition for purchase | 39 | 28% |
| Retention of title agreed by the buyer | 35 | 25% |
| Securities indicator | 35 | 25% |

Write-ins: final customer, permission of PH name disclosure, amount, currency, terms of payment of the request, policy colour.

- Need more via button: 94 of 138 (68%). Free text (n=94): about 70% mention reading the full narrative/comments (truncated on the card); about 40% want to know who entered the request and through which channel (policyholder, sales, customer service); the insured reference identifies the underlying seller on bank policies; some want a request history.

### 4.4 Answer (data to complete or select, n=138)

| Data item | Picks | % |
|---|---|---|
| Reason | 135 | 98% |
| Answer | 134 | 97% |
| Permanent | 130 | 94% |
| Temporary increase | 126 | 91% |
| Limited to (appears twice: permanent and temporary) | 242 picks | about 88% per slot **(inference)** |
| With "XX" days (invoice date) | 90 | 65% |
| With XX days | 85 | 62% |
| Notifications | 59 | 43% |
| Invoice | 56 | 41% |
| Provisionally | 22 | 16% |
| Progress advice | 16 | 12% |

Write-ins: decision based on FS dated, currency, joint limit, group or kontor limit, conditions and comments.

- Need the 2 links: 119 of 138 (86%). Free text (n=119 each):
  - **Enter conditions:** where special conditions, secondary reason codes, internal comments (to justify to colleagues) and external comments to the policyholder are entered; several call it mandatory.
  - **Preview Endorsement Text:** used to check the exact wording sent to the customer and choose between reason codes; about 23% say they use it rarely or not at all.
  - Wishes: a tooltip explaining the two-reason rule, keyword search on reason codes (7 unsorted pages today).

### 4.5 Validation view (check another user's decision, n=136)

| Data item | Picks | % |
|---|---|---|
| Temporary increase | 127 | 93% |
| Answer | 126 | 93% |
| Permanent | 124 | 91% |
| Reason | 124 | 91% |
| Prepared by | 121 | 89% |
| Limited to (permanent) | 121 | 89% |
| Limited to (temporary increase) | 121 | 89% |
| Date | 112 | 82% |
| Validations | 107 | 79% |
| "See conditions" link | 105 | 77% |
| With (permanent) | 102 | 75% |
| With (temporary increase) | 95 | 70% |
| Remarks | 76 | 56% |

Almost the whole list is ticked: validators review the full decision. Write-ins: aggregated exposure on the buyer group, "everything, especially on large requests".

### 4.6 Job-to-do gates and conclusion
- Job 1 "Manual Underwriting for Credit Limit Request": 156 yes (about 93% of the 168 who answered the familiarity question).
- Job 2 "Validation by UW for Credit Limit Decision": 136 yes (about 81% of 168).
- Job 3 other reasons: 83 yes, 79 free texts. Themes: cancelling or reducing limits, partial or full risk withdrawal, reallocating or transferring limits, changing conditions on existing limits, non-standard commercial decisions for one policy, sending recommendations to another underwriter based on delegation, reviewing loss ratio or premium, short follow-ups while waiting for buyer information. About a quarter of answers are empty ("." or "-").
- Conclusion (n=97): 31 say nothing more or that the current screen is fine. Others: show loss ratio, premium and policy colour (about 10); fewer screens and clicks, or open several views at once (about 20); keyword search on reason codes; handle several requests on the same buyer together; occasional loss of an unsaved decision draft; allocation of manual jobs; show the date and confidentiality of the latest financial statement.

## 5. Proposed cards (Manual Underwriting screen)

Rules used: card face = items picked by roughly 55% or more in the block (max 6 to 8); "View details" modal = items from 20% to about 55%, plus frequent write-ins; blocks where the user selects or types are **Complete**, the others **read-only**. Card order follows the questionnaire order, which probably mirrors the real IRP reading flow **(inference)**.

| # | Card | Type | Primary action |
|---|---|---|---|
| 1 | Buyer Summary | read-only | Open documents (EDM / Jade) |
| 2 | Insured (policy) | read-only | View details (Policy Analysis) |
| 3 | Current Limit | read-only | View limit history |
| 4 | Request | read-only | View request details |
| 5 | Answer (decision) | **Complete** | Submit the decision; Enter conditions and Preview endorsement text as secondary |
| 6 | Validation | **Complete (light)** | Validate / Reject the decision |

### Card 1: Buyer Summary
- Face: buyer identity as already shown on the screen (not measured here **(inference)**), plus 3 to 4 quick links: Documents (EDM/Jade), Financial statements / reports, Add third party, Notepad.
- Details modal: exposures, latest credit limits, latest incidents, latest mass decisions (a handful of mentions each).
- Rationale: about 93% need the links; the card is mostly a launcher. Evidence is strong on documents and financials, weak on the rest.

### Card 2: Insured (policy)
- Face (8): Insured name 90%, Policy number 77%, Primary / TopUp / CAP limit(s) 76%, Policy type 73%, Policy Grade 71%, Days (or months) 70%, Thresholds 57%, Warnings 53%. Keep the last two only if the card allows 8.
- Modal: Risk Credit Manager 53%, Broker name 50%, Can use policyholder name 46%, Insured percentage 46%, Language 46%, Nace Code 23%. Candidate additions from write-ins (small counts): loss ratio, premium, policy colour, maximum liability, renewal date, risk horizon, DCL.
- Inside the modal, give General Data and Validity prominence; Links, Limit Management, Product, Services and List Context/Type Condition could sit in a secondary "More" group **(inference)**.
- Primary action: View details. Only 56% want it, so keep it secondary in visual weight.

### Card 3: Current Limit
- Face (6): Request 92%, Answer 92%, Temp 91%, Terms of payment 78%, ADT 69%, UW name 57%.
- Modal: Spec. 46%, Polit. 36%, Links 36%, Self retention 31%, aggregated exposure on the buyer group (write-in), previous decision date and codes.
- Primary action: View limit history (70% want it; this is the decision-consistency check). The history should show reasons, author and currency.

### Card 4: Request
- Face (6): Temporary increase 93%, Date of request 88%, Permanent 88%, Narrative 84% (truncated, with "read more"), Limited to 76%, Credit period 66%.
- Modal: Date of input 59%, Negative buyer information 57%, Warnings 47%, Origin 45% (who entered and via which channel), Complain 33%, Self retention 30%, Condition for purchase 28%, Retention of title 25%, Securities indicator 25%.
- Primary action: View request details (68%). Full narrative and requester are the main reasons.
- Negative buyer information (57%) sits just above the cut; promote it to the face if space allows **(inference)** since it is risk-relevant.

### Card 5: Answer (Complete)
- Fields to fill (all above 60%): Answer, Reason, Permanent (Limited to + With days, invoice date), Temporary increase (Limited to + With days). Secondary fields: Notifications 43%, Invoice 41%, Provisionally 16%, Progress advice 12% (behind a disclosure; low picks).
- Actions: Enter conditions (special conditions, secondary reason codes, internal and external comments) and Preview endorsement text. 86% want one of these links; treat Enter conditions as a core step and Preview as a verification aid.
- Helpers suggested by free text **(inference)**: reason-code search, tooltip on the two-reason rule, a "Decision based on FS dated" field.

### Card 6: Validation (Complete, light)
- Face: the decision made by another user, read-only: Answer, Reason, Permanent and Temporary increase with their Limited to / With values, Prepared by, Date.
- Complete part: Validations (79%) and Remarks (56%) as the form (validate/reject, comment).
- Modal: "See conditions" link (77%) opens the conditions.
- Inference: this may be the Answer card in a validation mode (same fields, read-only plus a validate action) rather than a separate card, because the field set is nearly identical. The data cannot decide this. Recommended: one Answer card with two modes, so shared fields are not built twice.

### Merge and split suggestions (all inference)
- Merge Current Limit and Request into one "current vs requested" zone: they share Permanent / Temporary / Limited to / Credit period semantics and users read them together. Keep two cards if the Figma layout prefers separation.
- Split the Insured face into "Policy identity" (name, number, type, grade) and "Cover terms" (primary/top-up, days, thresholds, warnings) if 8 fields feel dense.
- Cross-cutting: loss ratio, premium and policy colour were requested spontaneously in at least five different questions; consider a small "Policy performance" strip on card 2 even though they were not proposed as options.

## 6. Gaps and ambiguities

1. **Yes/No columns only contain "1" or blank.** Blank could mean "No" or "not reached/skipped". For Buyer Summary (135 of 197) the base is unknowable; percentages here use the plausible base of sessions that reached the next block.
2. **Option lists are not in the export.** Options never selected are invisible; the lists in section 3 are reconstructed.
3. **"Other" text is merged into the same comma-separated cell** as the options, so a write-in containing a comma is split into fragments (about 80 distinct fragments on Insured Summary).
4. **Duplicate or cryptic labels:** "Limited to" appears twice in Answer; `#4 Answer more` has two columns with the same header; Current Limit options "ADT", "Temp", "Spec.", "Polit." are unexplained abbreviations.
5. **Familiarity scale** runs 0 to 5 with no end labels in the export (header says "familiar" and inner text says "experienced"); 0 may mean none. 27 non-Super Users and 2 Super Users left it blank.
6. **Super User flag** is present for 28 sessions only; blank may be "No" or "not asked".
7. **Business Unit** is free text with 100+ spellings; no reliable aggregation.
8. **Status vs answers:** 57 DROP_OFF sessions, 34 of them stopped before the first screen question. Statuses are Useberry's; partial answers were kept.
9. **Not measurable here:** the real fields of the Buyer Summary (no multi-select there), which links are highlighted, time per block, and whether the clickable areas were really clicked (the "extra" columns are self-declared).
10. **Tab-level non-use counts** are keyword estimates on free text (precision roughly plus or minus 10 points).
11. **No questions on form behaviour** (validation rules, defaults, mandatory fields), only on which data users select; field order and grouping inside the Complete forms are inference.
