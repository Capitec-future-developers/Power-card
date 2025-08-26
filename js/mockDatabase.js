export const fields = [
  "Internal stan","External stan","Reference","Destination","Source","Message",
  "Function","Processing code","Source account","Destination account","Action",
  "Original action","Issuer response","Network","Network id.","Issuing institution",
  "PAN","Service setup","Local time","Transmission time","Response time",
  "Internal time","Capture date","Business date","entity code","Entity id.",
  "Source account type","Source account number","Destination Entity id.",
  "Destination account type","Destination account number","Transaction amount",
  "Cash back amount","Transaction currency","Replacement amount","Billing amount",
  "Billing currency","Issuer amount","Issuer settlement currency","Issuer date",
  "Acquirer settlement amount","Acquirer settlement ccy","Receiving institution",
  "Acquiring country","Acquiring institution code","Acquirer institution",
  "PAN acceptor activity","Terminal no.","Acceptor point","Pos entry mode",
  "Forwarding country","Forwarding institution code","Forwarding institution",
  "Authorization reference","Original code","Reason code","Reversal stan",
  "Authorization flag","Reversal flag","Financial impact","Matching status",
  "Original table indicator","Current table indicator","Authorization id",
  "Transaction id","Acronym"
];

// Helper function to merge fields with existing data
function mergeFieldsWithData(data) {
  return data.map(item => {
    const merged = {};
    fields.forEach(field => {
      merged[field] = item[field] || '';
    });
    // Merge nested objects like your original properties
    return { ...merged, ...item };
  });
}

// Original data
const originalData
 = [
  {
    title: 'MR',
    pan: '4644090987127908',
    first_name: 'Omphile',
    family_name: 'Mohlala',
    corporate_id: 'CORP001',
    legal_id: 'L12345',
    gender: 'Male',
    application_ID: '',
    client_host_id: 'CH001',
    client_code: 'C001',
    corporate_name: 'Mz stark Tech',
    phone: '0825511132',
    birth_date: '1990-01-01',
    address: '12 Rose Street, Johannesburg, SA',
    created_at: new Date('2025-01-01T10:00:00'),
    updated_at: new Date('2025-01-01T10:00:00'),
    payment_instruments: [
      {
        type: 'Personal Gold Credit Card',
        number: '464479XXXXXX6088',
        name: 'O. MOHLALA',
        full_name: 'OMPHILE MOHLALA',
        status: 'Not applicable',
        expiry: '05/2025',
        condition: 'REPLACED',
        status_reason: 'LOST REPLACE',
        type_detail: 'Primary',
        branch: 'Sandton'
      }
    ],
    accounts: [
      {
        type: 'Personal Gold Account',
        number: '4140442000004918',
        status: 'NORMAL',
        expiry: '01/10/2025',
        pan_status_date: '01/01/2025',
        institution: 'Capitec Bank Limited',
        branch: 'MIGRATION BRANCH',
        catalogue_product: 'Personal Gold Card',
        loyalty_account_number: '4140442000004918',
        account_owner_type: 'Individual',
        plastic_code: 'ENTREPRENEUR CR',
        loyalty_status: 'NORMAL'
      }
    ],
    loyalty_accounts: [
      {
        institution: 'Capitec Bank Limited',
        branch: 'MIGRATION BRANCH',
        client_code: 'C001',
        catalogue_product: 'Personal Gold Card',
        product_version: 'v1',
        loyalty_account_number: '4140442000004918',
        account_owner_type: 'Individual',
        loyalty_status: 'NORMAL',
        exchange_icon: '🔄'
      }
    ]
  },
  {
    pan: '4140123456789012',
    first_name: 'Spencer',
    family_name: 'Nong',
    corporate_id: 'CORP002',
    legal_id: 'L67890',
    client_host_id: 'CH002',
    gender: 'Male',
    client_code: 'C002',
    corporate_name: 'Cape Innovations',
    phone: '0815522233',
    birth_date: '1995-05-05',
    address: '45 Oak Avenue, Cape Town, SA',
    created_at: new Date('2025-02-01T10:00:00'),
    updated_at: new Date('2025-02-01T10:00:00'),
    payment_instruments: [
      {
        type: 'Business Platinum Card',
        number: '414012XXXXXX9012',
        name: 'S. NONG',
        full_name: 'SPENCER NONG',
        status: 'Active',
        expiry: '08/2026',
        condition: 'NEW',
        type_detail: 'Primary'
      }
    ],
    accounts: [
      {
        type: 'Business Account',
        number: '4140123000005678',
        status: 'MBOD_3',
        expiry: '03/15/2026',
        pan_status_date: '02/01/2025',
        institution: 'Capitec Bank Limited',
        branch: 'MIGRATION BRANCH',
        catalogue_product: 'Business Platinum Card',
        loyalty_account_number: '4140123000005678',
        account_owner_type: 'Corporate',
        plastic_code: 'ENTREPRENEUR CR',
        loyalty_status: 'MBOD_3'
      }
    ],
    loyalty_accounts: [
      {
        institution: 'Capitec Bank Limited',
        branch: 'MIGRATION BRANCH',
        client_code: 'C002',
        catalogue_product: 'Business Platinum Card',
        product_version: 'v1',
        loyalty_account_number: '4140123000005678',
        account_owner_type: 'Corporate',
        loyalty_status: 'MBOD_3',
        exchange_icon: '🔄'
      }
    ]
  },
  {
    pan: '4644987654321098',
    first_name: 'Zenzi',
    family_name: 'Dube',
    corporate_id: 'CORP003',
    legal_id: 'L54321',
    gender: 'Female',
    client_host_id: 'CH003',
    client_code: 'C003',
    corporate_name: 'Black Apple',
    phone: '0835533344',
    birth_date: '1985-12-15',
    address: '78 Pine Road, Durban, SA',
    created_at: new Date('2025-03-01T10:00:00'),
    updated_at: new Date('2025-03-01T10:00:00'),
    payment_instruments: [
      {
        type: 'Entrepreneur Card',
        number: '464498XXXXXX1098',
        name: 'Z. DUBE',
        full_name: 'ZENZI DUBE',
        status: 'Active',
        expiry: '11/2024',
        condition: 'ACTIVE',
        type_detail: 'Primary'
      }
    ],
    accounts: [
      {
        type: 'Savings Account',
        number: '4140442000009876',
        status: 'ICU',
        expiry: '12/12/2024',
        pan_status_date: '03/01/2025',
        institution: 'Capitec Bank Limited',
        branch: 'MIGRATION BRANCH',
        catalogue_product: 'Entrepreneur Card',
        loyalty_account_number: '4140442000009876',
        account_owner_type: 'Individual',
        plastic_code: 'ENTREPRENEUR CR',
        loyalty_status: 'Normal'
      }
    ],
    loyalty_accounts: [
      {
        institution: 'Capitec Bank Limited',
        branch: 'MIGRATION BRANCH',
        client_code: 'C003',
        catalogue_product: 'Entrepreneur Card',
        product_version: 'v2',
        loyalty_account_number: '4140442000009876',
        account_owner_type: 'Individual',
        loyalty_status: 'Normal',
        exchange_icon: '🔄'
      }
    ]
  },
  {
    pan: '4140987600001098',
    first_name: 'Dwani',
    family_name: 'Johnson',
    corporate_id: 'CORP00987',
    legal_id: 'L907900',
    client_host_id: 'CH0092',
    client_code: '10982',
    gender: 'Male',
    corporate_name: 'Johnsons Family',
    phone: '0606238529',
    birth_date: '1997-02-17',
    address: '18 Forest Road, Johannesburg, SA',
    created_at: new Date('2025-03-01T10:00:00'),
    updated_at: new Date('2025-03-01T10:00:00'),
    payment_instruments: [
      {
        type: 'Entrepreneur Card',
        number: '414098XXXXXX1098',
        name: 'D. Johnson',
        full_name: 'DWAIN JOHNSON',
        status: 'Active',
        expiry: '12/2028',
        condition: 'ACTIVE',
        type_detail: 'Primary'
      }
    ],
    accounts: [
      {
        type: 'Credit Account',
        number: '4140442000009875',
        status: 'Normal',
        expiry: '28/12/2028',
        pan_status_date: '03/01/2025',
        institution: 'Capitec Bank Limited',
        branch: 'MIGRATION BRANCH',
        catalogue_product: 'Entrepreneur Card',
        loyalty_account_number: '4140442000009875',
        account_owner_type: 'Individual',
        plastic_code: 'ENTREPRENEUR CR',
        loyalty_status: 'Normal'
      }
    ],
    loyalty_accounts: [
      {
        institution: 'Capitec Bank Limited',
        branch: 'MIGRATION BRANCH',
        client_code: '10982',
        catalogue_product: 'Entrepreneur Card',
        product_version: 'v3',
        loyalty_account_number: '4140442000009875',
        account_owner_type: 'Individual',
        loyalty_status: 'Normal',
        exchange_icon: '🔄'
      }
    ]
  }
];

export const mockDatabase = mergeFieldsWithData(originalData);
