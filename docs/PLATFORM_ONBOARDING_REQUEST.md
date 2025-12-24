# Platform Onboarding Request Template

## For Paul: Send this to each MSC Platform

This template can be sent via email to each of the 5 measurement service companies to request the necessary information for bved API integration.

---

**Subject:** Request for bved API Integration - Heidi Systems

---

Dear [Platform Name] Team,

We are reaching out to integrate with your bved document web service API to automate the exchange of meter reading data and billing documents between our systems.

**Company Information:**
- **Company Name:** Heidi Systems GmbH
- **Property Management ID:** [Your PM ID with them]
- **Contact Person:** Paul [Last Name]
- **Email:** paul@heidisystems.com
- **Phone:** [Your phone number]

## Integration Requirements

We would like to implement the bved document web service specification (v1.3) to:
- Automatically retrieve billing documents and meter readings from your system
- Submit tenant information and orders to your system
- Reduce manual data entry and improve data accuracy

## Information Required

Please provide the following information to enable the integration:

### 1. API Access Credentials

```
API Endpoint URL: ____________________________________
API Version: ________________________________________
Username: ___________________________________________
Password: ___________________________________________
```

**Note:** Please send credentials via secure channel (encrypted email, password manager, etc.)

### 2. Technical Specifications

```
Supported bved Specification Version: _______________

Supported Document Types (please check all that apply):
[ ] A - Balance record (Abstimmsatz)
[ ] D - Balance record (Saldensatz)
[ ] W - Water balance record (Saldensatz Wasser)
[ ] E - Result record (Ergebnissatz)
[ ] P - Refund amounts (Erstattungsbeträge)
[ ] E835 - Tax services portion
[ ] E898 - User billing images
[ ] LM - Property and user data
[ ] BK - Fuel and cost data
[ ] RUL - Residential unit list
[ ] HKA-G - Heating billing (complete)
[ ] HKA-E - Heating billing (tenant)
[ ] UVI-G - Annual consumption info (complete)
[ ] UVI-E - Annual consumption info (tenant)
[ ] OTHER: _______________________________________

Supported File Formats:
[ ] XML
[ ] JSON
[ ] PDF
[ ] CSV
[ ] GZIP
[ ] Other: _______________________________________

Rate Limits: ________________________________________
(e.g., max requests per hour)

Recommended Polling Frequency: ______________________
(e.g., daily, hourly)
```

### 3. Buildings/Properties Covered

Please list all buildings/properties in your system that belong to Heidi Systems:

```
Building 1:
  - Address: _______________________________________
  - Building ID (Your System): _____________________
  - Building ID (Our System): ______________________
  - Number of Units: _______________________________

Building 2:
  - Address: _______________________________________
  - Building ID (Your System): _____________________
  - Building ID (Our System): ______________________
  - Number of Units: _______________________________

Building 3:
  - Address: _______________________________________
  - Building ID (Your System): _____________________
  - Building ID (Our System): ______________________
  - Number of Units: _______________________________

(Add more as needed)
```

### 4. Test Environment

```
Test/Sandbox Environment Available:
[ ] Yes
    - Test Endpoint URL: ___________________________
    - Test Username: __________________________________
    - Test Password: __________________________________
[ ] No - We will test in production with caution

Sample Documents Available for Testing:
[ ] Yes - Please provide links or attachments
[ ] No
```

### 5. Support Contact

```
Technical Contact Person: ___________________________
Technical Contact Email: ____________________________
Technical Contact Phone: ____________________________
Support Hours: ______________________________________
Emergency Contact: __________________________________
```

### 6. Security & Compliance

```
SSL/TLS Certificate Provider: _______________________
Authentication Method:
[ ] HTTP Basic Authentication
[ ] OAuth 2.0
[ ] Other: ________________________________________

IP Whitelisting Required:
[ ] Yes - Our IP: _________________________________
[ ] No

Data Retention Policy: ______________________________
GDPR Compliance: [ ] Yes [ ] No
Data Location: ______________________________________
```

### 7. Additional Information

```
Any Platform-Specific Requirements or Limitations:
__________________________________________________
__________________________________________________
__________________________________________________

Known Issues or Quirks to Be Aware Of:
__________________________________________________
__________________________________________________
__________________________________________________

Estimated Setup Time: ______________________________

Onboarding Process:
__________________________________________________
__________________________________________________
__________________________________________________

Additional Costs/Fees: ______________________________
```

## Implementation Timeline

We are planning to implement this integration in the following phases:

**Phase 1 (Week 1-2):** Initial connection and authentication testing
**Phase 2 (Week 2-3):** Document retrieval and parsing
**Phase 3 (Week 3-4):** Full integration and testing
**Phase 4 (Week 4):** Production deployment

We would appreciate your support during the implementation phase.

## Questions?

If you have any questions or need additional information from our side, please don't hesitate to reach out.

We look forward to working with you!

Best regards,

Paul [Last Name]
Heidi Systems GmbH
paul@heidisystems.com
[Phone Number]

---

**Attachments:**
- bved API Specification (v1.3)
- Heidi Systems Company Profile

---

## Alternative: Short Form Request

If the platform prefers a shorter request, use this version:

---

**Subject:** bved API Access Request - Heidi Systems

Hi [Platform Name] Team,

We would like to integrate with your bved API to automate data exchange. Please provide:

1. **API Credentials:**
   - Endpoint URL
   - Username
   - Password

2. **Technical Details:**
   - Supported document types
   - Rate limits
   - Polling frequency recommendation

3. **Contact:**
   - Technical support person
   - Email/phone

**Our Details:**
- Company: Heidi Systems GmbH
- PM ID: [Your ID]
- Contact: paul@heidisystems.com

Looking forward to your response!

Best,
Paul

---

## For Development Team: Tracking Sheet

Use this sheet to track responses from each platform:

| Platform | Status | Credentials Received | Test Connection | Production Ready | Notes |
|----------|--------|---------------------|-----------------|------------------|-------|
| Platform 1 | ⏳ Waiting | ❌ | ❌ | ❌ | Email sent 10/25 |
| Platform 2 | ⏳ Waiting | ❌ | ❌ | ❌ | Email sent 10/25 |
| Platform 3 | ⏳ Waiting | ❌ | ❌ | ❌ | Email sent 10/25 |
| Platform 4 | ⏳ Waiting | ❌ | ❌ | ❌ | Email sent 10/25 |
| Platform 5 | ⏳ Waiting | ❌ | ❌ | ❌ | Email sent 10/25 |

**Status Legend:**
- ⏳ Waiting - Request sent, awaiting response
- 📧 Responded - Received initial response
- ✅ Complete - All information received
- ❌ Blocked - Issue preventing progress
- 🔄 In Progress - Actively working on setup

---

## Follow-Up Email Template

If no response after 3-5 business days:

---

**Subject:** Re: bved API Integration Request - Follow Up

Hi [Platform Name] Team,

I wanted to follow up on my email from [Date] regarding bved API integration.

We're eager to move forward with this integration and would appreciate an update on:
1. Status of our API access request
2. Expected timeline for credential provisioning
3. Any additional information you may need from us

Please let me know if you need any clarification or if there's a better contact person for this request.

Thanks!

Paul

---

## Escalation Template

If still no response after 2 weeks:

---

**Subject:** Urgent: bved API Integration - Request for Support

Dear [Platform Name] Management,

We have been attempting to integrate with your bved API service since [Date] but have not received the necessary access credentials despite multiple follow-ups.

As this integration is critical for our operations and affects our ability to serve our mutual customers, I would appreciate your assistance in expediting this request.

Could you please:
1. Confirm receipt of this request
2. Assign a technical contact person
3. Provide an estimated timeline for API access

I'm happy to schedule a call to discuss this further if that would be helpful.

Thank you for your attention to this matter.

Best regards,

Paul [Last Name]
Heidi Systems GmbH
paul@heidisystems.com
[Phone Number]

---

## Internal Checklist (For Paul)

Before sending requests:

- [ ] Confirm you have the correct PM ID for each platform
- [ ] Confirm the correct contact email for each platform
- [ ] Attach bved specification document if needed
- [ ] Set reminder to follow up in 5 business days
- [ ] Add to project management tracker
- [ ] Notify development team that requests have been sent
- [ ] Prepare to answer any questions from platforms

After receiving credentials:

- [ ] Store credentials securely (password manager)
- [ ] Share credentials with dev team via secure method
- [ ] Document any special instructions
- [ ] Update tracking sheet
- [ ] Schedule kickoff call with platform (if needed)
- [ ] Test credentials immediately

---

## FAQ for Platform Providers

If platforms have questions, here are common answers:

**Q: What is the bved specification?**
A: It's a standardized API specification by the German energy and water industry association for exchanging utility data between measurement service companies and property management companies.

**Q: How often will you access our API?**
A: We plan to poll for new documents once per day, typically during off-peak hours (e.g., 2-4 AM). We can adjust this based on your recommendations.

**Q: What data will you access?**
A: Only billing documents, meter readings, and consumption data for buildings under our management (PM ID: [Your ID]).

**Q: How secure is the integration?**
A: All communication is over HTTPS with Basic Authentication. We store credentials encrypted and follow industry best practices for data security.

**Q: Can you provide your IP address for whitelisting?**
A: Yes, our primary IP is [Your IP]. We can provide backup IPs if needed.

**Q: Do you need write access?**
A: Yes, we would like to submit tenant information and orders back to your system using the `POST /documents/in` endpoint.

**Q: What happens if our API is down?**
A: Our system will retry failed requests with exponential backoff and alert our team if issues persist for more than 4 hours.

**Q: How do we test the integration?**
A: We prefer to test in a sandbox environment first. If unavailable, we can carefully test in production with a small subset of data.

---

*Template Version: 1.0*
*Last Updated: October 25, 2025*
*Created for: Heidi Systems bved Integration Project*



