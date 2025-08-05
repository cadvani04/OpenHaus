// State-specific agreement templates
export const agreementTemplates = {
  'California': {
    buyerConsultation: `BUYER CONSULTATION AGREEMENT

This agreement is entered into between [REALTOR_NAME] and [CLIENT_NAME] on [DATE].

1. PURPOSE: This consultation is for the purpose of discussing real estate services and market information.

2. CONFIDENTIALITY: All information shared during this consultation will be kept confidential.

3. NO OBLIGATION: This consultation does not create any obligation to enter into a formal agency relationship.

4. COMPLIANCE: This agreement complies with California real estate laws and regulations.

5. DISCLOSURE: California law requires that you receive a copy of the "Agency Relationships in Real Estate Transactions" disclosure.

By signing below, you acknowledge receipt of this consultation agreement and understand its terms.`,

    listingConsultation: `LISTING CONSULTATION AGREEMENT

This agreement is entered into between [REALTOR_NAME] and [CLIENT_NAME] on [DATE].

1. PURPOSE: This consultation is for the purpose of discussing listing services and market analysis.

2. CONFIDENTIALITY: All information shared during this consultation will be kept confidential.

3. NO OBLIGATION: This consultation does not create any obligation to enter into a formal listing agreement.

4. COMPLIANCE: This agreement complies with California real estate laws and regulations.

5. DISCLOSURE: California law requires that you receive a copy of the "Agency Relationships in Real Estate Transactions" disclosure.

By signing below, you acknowledge receipt of this consultation agreement and understand its terms.`
  },

  'Texas': {
    buyerConsultation: `BUYER CONSULTATION AGREEMENT

This agreement is entered into between [REALTOR_NAME] and [CLIENT_NAME] on [DATE].

1. PURPOSE: This consultation is for the purpose of discussing real estate services and market information.

2. CONFIDENTIALITY: All information shared during this consultation will be kept confidential.

3. NO OBLIGATION: This consultation does not create any obligation to enter into a formal agency relationship.

4. COMPLIANCE: This agreement complies with Texas real estate laws and regulations.

5. DISCLOSURE: Texas law requires that you receive a copy of the "Information About Brokerage Services" disclosure.

By signing below, you acknowledge receipt of this consultation agreement and understand its terms.`,

    listingConsultation: `LISTING CONSULTATION AGREEMENT

This agreement is entered into between [REALTOR_NAME] and [CLIENT_NAME] on [DATE].

1. PURPOSE: This consultation is for the purpose of discussing listing services and market analysis.

2. CONFIDENTIALITY: All information shared during this consultation will be kept confidential.

3. NO OBLIGATION: This consultation does not create any obligation to enter into a formal listing agreement.

4. COMPLIANCE: This agreement complies with Texas real estate laws and regulations.

5. DISCLOSURE: Texas law requires that you receive a copy of the "Information About Brokerage Services" disclosure.

By signing below, you acknowledge receipt of this consultation agreement and understand its terms.`
  }
};

export const getAgreementTemplate = (state, meetingType) => {
  const templates = agreementTemplates[state] || agreementTemplates['California'];
  return templates[meetingType.toLowerCase().replace(' ', '')] || templates.buyerConsultation;
};

export const replaceTemplateVariables = (template, data) => {
  return template
    .replace('[REALTOR_NAME]', data.realtor.name)
    .replace('[CLIENT_NAME]', data.client.name)
    .replace('[DATE]', new Date().toLocaleDateString());
}; 