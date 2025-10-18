// Helper to parse xml -> normalized JS object (extracted fields)
const xml2js = require('xml2js');

function asArray(v){
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

async function parseXmlString(xml) {
  const parsed = await xml2js.parseStringPromise(xml, { explicitArray: false, ignoreAttrs: true, trim: true });
  return parsed;
}

// This function tries to find common nodes in Experian-style softpull and extracts fields.
// It's defensive — missing fields become '' or 0.
function extractFromParsed(parsed) {
  // Top-level might be INProfileResponse or other. Normalize some common paths.
  const root = parsed.INProfileResponse || parsed;

  // Basic applicant details
  const cad = root.Current_Application?.Current_Application_Details?.Current_Applicant_Details || {};
  const scoreBlock = root.SCORE || root.BureauScore || {};
  const caisAccounts = root.CAIS_Account?.CAIS_Account_DETAILS || root.CAIS_Account?.CAIS_Account || [];
  const caisSummary = root.CAIS_Account?.CAIS_Summary || root.CAIS_Account?.CAISSummary || {};

  const accounts = asArray(caisAccounts).map(a => {
    const holder = a.CAIS_Holder_Details || {};
    const pan = a.CAIS_Holder_ID_Details?.Income_Tax_PAN || a.CAIS_Holder_Details?.Income_TAX_PAN || '';
    return {
      subscriberName: a.Subscriber_Name || a.Subscriber || '',
      accountNumber: a.Account_Number || a.AccountNumber || '',
      portfolioType: a.Portfolio_Type || '',
      accountType: a.Account_Type || '',
      openDate: a.Open_Date || '',
      creditLimit: parseFloat(a.Credit_Limit_Amount || a.CreditLimit || 0) || 0,
      currentBalance: parseFloat(a.Current_Balance || a.CurrentBalance || 0) || 0,
      amountPastDue: parseFloat(a.Amount_Past_Due || a.AmountPastDue || 0) || 0,
      accountStatus: a.Account_Status || '',
      paymentHistoryProfile: a.Payment_History_Profile || '',
      dateReported: a.Date_Reported || '',
      holder: {
        surname: holder.Surname_Non_Normalized || holder.Surname || '',
        firstName: holder.First_Name_Non_Normalized || holder.First_Name || '',
        pan: pan || '',
        dateOfBirth: holder.Date_Of_Birth || ''
      },
      raw: a
    };
  });

  const doc = {
    name: `${cad.First_Name || ''} ${cad.Last_Name || ''}`.trim(),
    firstName: cad.First_Name || '',
    lastName: cad.Last_Name || '',
    mobile: cad.MobilePhoneNumber || cad.Telephone_Number_Applicant_1st || '',
    pan: (accounts[0]?.holder?.pan) || cad.IncomeTaxPan || '',
    dateOfBirth: cad.Date_Of_Birth_Applicant || cad.Date_Of_Birth || '',
    score: parseInt(scoreBlock.BureauScore || scoreBlock.Score || 0) || 0,
    scoreConfidence: scoreBlock.BureauScoreConfidLevel || '',
    totalAccounts: parseInt(caisSummary.Credit_Account?.CreditAccountTotal || caisSummary.CreditAccountTotal || caisSummary.TotalAccounts || 0) || 0,
    activeAccounts: parseInt(caisSummary.Credit_Account?.CreditAccountActive || caisSummary.CreditAccountActive || 0) || 0,
    closedAccounts: parseInt(caisSummary.Credit_Account?.CreditAccountClosed || caisSummary.CreditAccountClosed || 0) || 0,
    securedOutstanding: parseFloat(caisSummary.Total_Outstanding_Balance?.Outstanding_Balance_Secured || caisSummary.Outstanding_Balance_Secured || 0) || 0,
    unsecuredOutstanding: parseFloat(caisSummary.Total_Outstanding_Balance?.Outstanding_Balance_UnSecured || caisSummary.Outstanding_Balance_UnSecured || 0) || 0,
    totalOutstanding: parseFloat(caisSummary.Total_Outstanding_Balance?.Outstanding_Balance_All || caisSummary.Outstanding_Balance_All || 0) || 0,
    inquiriesLast7Days: parseInt(root.TotalCAPS_Summary?.TotalCAPSLast7Days || root.CAPS?.CAPS_Summary?.CAPSLast7Days || 0) || 0,
    accounts
  };

  return doc;
}

module.exports = { parseXmlString, extractFromParsed };
