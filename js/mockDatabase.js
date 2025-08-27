export const transactionFields = [
  "Internal_stan","External_stan","Reference","Destination","Source","Message",
  "Function","Processing_code","Source_account","Destination_account","Action",
  "Original_action","Issuer_response","Network","Network_id","Issuing_institution",
  "PAN","Service_setup","Local_time","Transmission_time","Response_time",
  "Internal_time","Capture_date","Business_date","Entity_code","Entity_id",
  "Source_account_type","Source_account_number","Destination_Entity_id",
  "Destination_account_type","Destination_account_number","Transaction_amount",
  "Cash_back_amount","Transaction_currency","Replacement_amount","Billing_amount",
  "Billing_currency","Issuer_amount","Issuer_settlement_currency","Issuer_date",
  "Acquirer_settlement_amount","Acquirer_settlement_ccy","Receiving_institution",
  "Acquiring_country","Acquiring_institution_code","Acquirer_institution",
  "PAN_acceptor_activity","Terminal_no","Acceptor_point","Pos_entry_mode",
  "Forwarding_country","Forwarding_institution_code","Forwarding_institution",
  "Authorization_reference","Original_code","Reason_code","Reversal_stan",
  "Authorization_flag","Reversal_flag","Financial_impact","Matching_status",
  "Original_table_indicator","Current_table_indicator","Authorization_id",
  "Transaction_id","Acronym"
];


export function generateTransactionHistory(pan, count = 20) {
  const transactions = [];
  const transactionTypes = ['Purchase', 'Withdrawal', 'Transfer', 'Payment', 'Refund'];
  const merchants = ['Pick n Pay', 'Woolworths', 'Checkers', 'ATM Withdrawal', 'Online Payment', 'Fuel Station', 'Restaurant', 'Pharmacy', 'Grocery Store', 'Gas Station'];
  const locations = ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Sandton', 'Rosebank', 'Centurion', 'Midrand', 'Bellville', 'Bloemfontein'];

  for (let i = 0; i < count; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90)); // Last 90 days

    const amount = (Math.random() * 2000 + 10).toFixed(2);
    const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];

    transactions.push({
      Internal_stan: `${1000000 + i}`,
      External_stan: `${2000000 + i}`,
      Reference: `REF${Date.now()}${i}`,
      Destination: merchant,
      Source: `ATM ${location}`,
      Message: `${transactionType} transaction`,
      Function: transactionType.toUpperCase(),
      Processing_code: transactionType === 'Withdrawal' ? '010000' : '000000',
      Source_account: pan,
      Destination_account: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      Action: 'APPROVED',
      Original_action: 'PURCHASE',
      Issuer_response: '00',
      Network: 'VISA',
      Network_id: 'V001',
      Issuing_institution: 'Capitec Bank Limited',
      PAN: pan,
      Service_setup: 'Standard',
      Local_time: date.toTimeString().split(' ')[0],
      Transmission_time: date.toISOString(),
      Response_time: `${Math.floor(Math.random() * 3000) + 100}ms`,
      Internal_time: date.toISOString(),
      Capture_date: date.toISOString().split('T')[0],
      Business_date: date.toISOString().split('T')[0],
      Entity_code: 'CAP',
      Entity_id: 'E001',
      Source_account_type: 'CREDIT',
      Source_account_number: pan,
      Destination_Entity_id: `E${Math.floor(Math.random() * 999) + 100}`,
      Destination_account_type: 'CHECKING',
      Destination_account_number: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      Transaction_amount: amount,
      Cash_back_amount: transactionType === 'Withdrawal' ? '0.00' : '0.00',
      Transaction_currency: 'ZAR',
      Replacement_amount: '0.00',
      Billing_amount: amount,
      Billing_currency: 'ZAR',
      Issuer_amount: amount,
      Issuer_settlement_currency: 'ZAR',
      Issuer_date: date.toISOString().split('T')[0],
      Acquirer_settlement_amount: amount,
      Acquirer_settlement_ccy: 'ZAR',
      Receiving_institution: 'Capitec Bank',
      Acquiring_country: 'ZA',
      Acquiring_institution_code: '470010',
      Acquirer_institution: merchant,
      PAN_acceptor_activity: 'RETAIL',
      Terminal_no: `T${Math.floor(Math.random() * 90000) + 10000}`,
      Acceptor_point: location,
      Pos_entry_mode: '051',
      Forwarding_country: 'ZA',
      Forwarding_institution_code: '470010',
      Forwarding_institution: 'Capitec Bank',
      Authorization_reference: `AUTH${Date.now()}${i}`,
      Original_code: '00',
      Reason_code: '00',
      Reversal_stan: '',
      Authorization_flag: 'Y',
      Reversal_flag: 'N',
      Financial_impact: 'DEBIT',
      Matching_status: 'MATCHED',
      Original_table_indicator: '1',
      Current_table_indicator: '1',
      Authorization_id: `${Math.floor(Math.random() * 900000) + 100000}`,
      Transaction_id: `TXN${Date.now()}${i}`,
      Acronym: 'CAP'
    });
  }

  return transactions.sort((a, b) => new Date(b.Transmission_time) - new Date(a.Transmission_time));
}


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


function mergeFieldsWithData(data) {
  return data.map(item => {
    const merged = {};
    fields.forEach(field => {
      merged[field] = item[field] || '';
    });
    return { ...merged, ...item };
  });
}


const originalData = [
  {
    id: 1,
    title: 'MR',
    pan: '4644090987127908',
    first_name: 'Omphile',
    family_name: 'Mohlala',
    corporate_id: 'CORP001',
    legal_id: 'L12345',
    gender: 'Male',
    application_ID: 'APP001',
    client_host_id: 'CH001',
    client_code: 'C001',
    corporate_name: 'Mz stark Tech',
    phone: '0825511132',
    home_phone: '0115551234',
    work_phone: '0115559876',
    other_phone: '0825511132',
    email: 'omphile.mohlala@mzstark.co.za',
    secondary_email: 'o.mohlala@gmail.com',
    birth_date: '1990-01-01',
    birth_country: 'ZAR',
    birth_city: 'Johannesburg',
    language: 'ENG',
    nationality: 'South African',
    job_title: 'Software Developer',
    channel: 'Online',
    customer_segment: 'Premium',
    employee_number: 'EMP001',
    co_brander: 'TechCorp',
    address: '12 Rose Street, Johannesburg, SA',
    suburb: 'The Hill',
    postal_code: '2196',
    province: 'Gauteng',
    country: 'South Africa',
    created_at: new Date('2025-01-01T10:00:00'),
    updated_at: new Date('2025-01-01T10:00:00'),
    secondary_pan_owner: {
      id: 101,
      title: 'MRS',
      pan: '4644090987127909',
      first_name: 'Lerato',
      family_name: 'Mohlala',
      relationship: 'Spouse',
      phone: '0825511133',
      email: 'lerato.mohlala@mzstark.co.za',
      birth_date: '1992-05-15',
      created_at: new Date('2025-01-01T10:00:00'),
      updated_at: new Date('2025-01-01T10:00:00')
    },
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
        branch: 'Sandton',
        sequence: '001'
      },
      {
        type: 'Secondary Gold Credit Card',
        number: '464479XXXXXX6089',
        name: 'L. MOHLALA',
        full_name: 'LERATO MOHLALA',
        status: 'Active',
        expiry: '05/2025',
        condition: 'ACTIVE',
        type_detail: 'Secondary',
        branch: 'Sandton',
        sequence: '002'
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
    id: 2,
    title: 'MR',
    pan: '4140123456789012',
    first_name: 'Spencer',
    family_name: 'Nong',
    corporate_id: 'CORP002',
    legal_id: 'L67890',
    client_host_id: 'CH002',
    gender: 'Male',
    application_ID: 'APP002',
    client_code: 'C002',
    corporate_name: 'Cape Innovations',
    phone: '0815522233',
    home_phone: '0215551234',
    work_phone: '0215559876',
    other_phone: '0815522233',
    email: 'spencer.nong@capeinnovations.co.za',
    secondary_email: 's.nong@gmail.com',
    birth_date: '1995-05-05',
    birth_country: 'ZAR',
    birth_city: 'Cape Town',
    language: 'ENG',
    nationality: 'South African',
    job_title: 'Business Owner',
    channel: 'Branch',
    customer_segment: 'Corporate',
    employee_number: 'EMP002',
    suburb: 'Cape Town Central',
    co_brander: 'InnovateCorp',
    address: '45 Oak Avenue, Cape Town, SA',
    postal_code: '8001',
    province: 'Western Cape',
    country: 'South Africa',
    created_at: new Date('2025-02-01T10:00:00'),
    updated_at: new Date('2025-02-01T10:00:00'),
    secondary_pan_owner: {
      id: 102,
      title: 'MS',
      pan: '4140123456789013',
      first_name: 'Nadia',
      family_name: 'Nong',
      relationship: 'Business Partner',
      phone: '0815522234',
      email: 'nadia.nong@capeinnovations.co.za',
      birth_date: '1994-08-20',
      created_at: new Date('2025-02-01T10:00:00'),
      updated_at: new Date('2025-02-01T10:00:00')
    },
    payment_instruments: [
      {
        type: 'Business Platinum Card',
        number: '414012XXXXXX9012',
        name: 'S. NONG',
        full_name: 'SPENCER NONG',
        status: 'Active',
        expiry: '08/2026',
        condition: 'NEW',
        type_detail: 'Primary',
        branch: 'Cape Town Central',
        sequence: '001'
      },
      {
        type: 'Business Platinum Card',
        number: '414012XXXXXX9013',
        name: 'N. NONG',
        full_name: 'NADIA NONG',
        status: 'Active',
        expiry: '08/2026',
        condition: 'NEW',
        type_detail: 'Secondary',
        branch: 'Cape Town Central',
        sequence: '002'
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
    id: 3,
    title: 'MS',
    pan: '4644987654321098',
    first_name: 'Zenzi',
    family_name: 'Dube',
    corporate_id: 'CORP003',
    legal_id: 'L54321',
    gender: 'Female',
    application_ID: 'APP003',
    client_host_id: 'CH003',
    client_code: 'C003',
    corporate_name: 'Black Apple',
    phone: '0835533344',
    home_phone: '0315551234',
    work_phone: '0315559876',
    other_phone: '0835533344',
    email: 'zenzi.dube@blackapple.co.za',
    secondary_email: 'z.dube@gmail.com',
    birth_date: '1985-12-15',
    birth_country: 'ZAR',
    birth_city: 'Durban',
    language: 'ENG',
    nationality: 'South African',
    job_title: 'Creative Director',
    suburb: 'Durban North',
    channel: 'Mobile',
    customer_segment: 'Premium',
    employee_number: 'EMP003',
    co_brander: 'CreativeCorp',
    address: '78 Pine Road, Durban, SA',
    postal_code: '4001',
    province: 'KwaZulu-Natal',
    country: 'South Africa',
    created_at: new Date('2025-03-01T10:00:00'),
    updated_at: new Date('2025-03-01T10:00:00'),
    secondary_pan_owner: {
      id: 103,
      title: 'MR',
      pan: '4644987654321099',
      first_name: 'Sipho',
      family_name: 'Dube',
      relationship: 'Spouse',
      phone: '0835533345',
      email: 'sipho.dube@blackapple.co.za',
      birth_date: '1983-10-22',
      created_at: new Date('2025-03-01T10:00:00'),
      updated_at: new Date('2025-03-01T10:00:00')
    },
    payment_instruments: [
      {
        type: 'Entrepreneur Card',
        number: '464498XXXXXX1098',
        name: 'Z. DUBE',
        full_name: 'ZENZI DUBE',
        status: 'Active',
        expiry: '11/2024',
        condition: 'ACTIVE',
        type_detail: 'Primary',
        branch: 'Durban North',
        sequence: '001'
      },
      {
        type: 'Entrepreneur Card',
        number: '464498XXXXXX1099',
        name: 'S. DUBE',
        full_name: 'SIPHO DUBE',
        status: 'Active',
        expiry: '11/2024',
        condition: 'ACTIVE',
        type_detail: 'Secondary',
        branch: 'Durban North',
        sequence: '002'
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
    id: 4,
    title: 'MR',
    pan: '4140987600001098',
    first_name: 'Dwani',
    family_name: 'Johnson',
    corporate_id: 'CORP00987',
    legal_id: 'L907900',
    client_host_id: 'CH0092',
    client_code: '10982',
    gender: 'Male',
    application_ID: 'APP004',
    corporate_name: 'Johnsons Family',
    phone: '0606238529',
    home_phone: '0125551234',
    work_phone: '0125559876',
    other_phone: '0606238529',
    email: 'dwani.johnson@johnsonsfamily.co.za',
    secondary_email: 'd.johnson@gmail.com',
    birth_date: '1997-02-17',
    birth_country: 'ZAR',
    birth_city: 'Pretoria',
    language: 'ENG',
    nationality: 'South African',
    job_title: 'Family Business Manager',
    channel: 'ATM',
    customer_segment: 'Standard',
    employee_number: 'EMP004',
    co_brander: 'FamilyCorp',
    suburb: 'Johannesburg Central',
    address: '18 Forest Road, Johannesburg, SA',
    postal_code: '2092',
    province: 'Gauteng',
    country: 'South Africa',
    created_at: new Date('2025-03-01T10:00:00'),
    updated_at: new Date('2025-03-01T10:00:00'),
    secondary_pan_owner: {
      id: 104,
      title: 'MRS',
      pan: '4140987600001099',
      first_name: 'Sarah',
      family_name: 'Johnson',
      relationship: 'Spouse',
      phone: '0606238530',
      email: 'sarah.johnson@johnsonsfamily.co.za',
      birth_date: '1998-07-12',
      created_at: new Date('2025-03-01T10:00:00'),
      updated_at: new Date('2025-03-01T10:00:00')
    },
    payment_instruments: [
      {
        type: 'Entrepreneur Card',
        number: '414098XXXXXX1098',
        name: 'D. Johnson',
        full_name: 'DWAIN JOHNSON',
        status: 'Active',
        expiry: '12/2028',
        condition: 'ACTIVE',
        type_detail: 'Primary',
        branch: 'Centurion',
        sequence: '001'
      },
      {
        type: 'Entrepreneur Card',
        number: '414098XXXXXX1099',
        name: 'S. Johnson',
        full_name: 'SARAH JOHNSON',
        status: 'Active',
        expiry: '12/2028',
        condition: 'ACTIVE',
        type_detail: 'Secondary',
        branch: 'Centurion',
        sequence: '002'
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
  },
  {
    id: 5,
    title: 'MRS',
    pan: '4644123456789098',
    first_name: 'Thandiwe',
    family_name: 'Mthembu',
    corporate_id: 'CORP005',
    legal_id: 'L98765',
    gender: 'Female',
    application_ID: 'APP005',
    client_host_id: 'CH005',
    client_code: 'C005',
    corporate_name: 'Mthembu Enterprises',
    phone: '0845566778',
    home_phone: '0335551234',
    work_phone: '0335559876',
    other_phone: '0845566778',
    email: 'thandiwe.mthembu@mthembuent.co.za',
    secondary_email: 't.mthembu@outlook.com',
    birth_date: '1988-07-22',
    suburb: 'Pietermaritzburg North',
    birth_country: 'ZAR',
    birth_city: 'Pietermaritzburg',
    language: 'ZUL',
    nationality: 'South African',
    job_title: 'CEO',
    channel: 'Online',
    customer_segment: 'VIP',
    employee_number: 'EMP005',
    co_brander: 'EliteCorp',
    address: '456 Church Street, Pietermaritzburg, SA',
    postal_code: '3201',
    province: 'KwaZulu-Natal',
    country: 'South Africa',
    created_at: new Date('2025-01-15T10:00:00'),
    updated_at: new Date('2025-01-15T10:00:00'),
    secondary_pan_owner: {
      id: 105,
      title: 'MR',
      pan: '4644123456789099',
      first_name: 'Bongani',
      family_name: 'Mthembu',
      relationship: 'Business Partner',
      phone: '0845566779',
      email: 'bongani.mthembu@mthembuent.co.za',
      birth_date: '1986-03-10',
      created_at: new Date('2025-01-15T10:00:00'),
      updated_at: new Date('2025-01-15T10:00:00')
    },
    payment_instruments: [
      {
        type: 'Black Card Elite',
        number: '464412XXXXXX9098',
        name: 'T. MTHEMBU',
        full_name: 'THANDIWE MTHEMBU',
        status: 'Active',
        expiry: '07/2027',
        condition: 'ACTIVE',
        status_reason: '',
        type_detail: 'Primary',
        branch: 'Pietermaritzburg',
        sequence: '001'
      },
      {
        type: 'Black Card Elite',
        number: '464412XXXXXX9099',
        name: 'B. MTHEMBU',
        full_name: 'BONGANI MTHEMBU',
        status: 'Active',
        expiry: '07/2027',
        condition: 'ACTIVE',
        status_reason: '',
        type_detail: 'Secondary',
        branch: 'Pietermaritzburg',
        sequence: '002'
      }
    ],
    accounts: [
      {
        type: 'Elite Business Account',
        number: '4140442000012345',
        status: 'PREMIUM',
        expiry: '22/07/2027',
        pan_status_date: '15/01/2025',
        institution: 'Capitec Bank Limited',
        branch: 'MIGRATION BRANCH',
        catalogue_product: 'Black Card Elite',
        loyalty_account_number: '4140442000012345',
        account_owner_type: 'Corporate',
        plastic_code: 'ELITE BLACK',
        loyalty_status: 'VIP'
      }
    ],
    loyalty_accounts: [
      {
        institution: 'Capitec Bank Limited',
        branch: 'MIGRATION BRANCH',
        client_code: 'C005',
        catalogue_product: 'Black Card Elite',
        product_version: 'v1',
        loyalty_account_number: '4140442000012345',
        account_owner_type: 'Corporate',
        loyalty_status: 'VIP',
        exchange_icon: '🔄'
      }
    ]
  },
  {
    id: 6,
    title: 'DR',
    pan: '4140789012345678',
    first_name: 'Naledi',
    family_name: 'Khumalo',
    corporate_id: 'CORP006',
    legal_id: 'L87654',
    gender: 'Female',
    application_ID: 'APP006',
    client_host_id: 'CH006',
    client_code: 'C006',
    corporate_name: 'Khumalo Medical Practice',
    phone: '0827891234',
    home_phone: '0125551234',
    work_phone: '0125559876',
    other_phone: '0827891234',
    email: 'dr.naledi@khumedical.co.za',
    secondary_email: 'n.khumalo@gmail.com',
    birth_date: '1982-11-08',
    birth_country: 'ZAR',
    birth_city: 'Pretoria',
    suburb: 'Ga-rankuwa',
    language: 'SES',
    nationality: 'South African',
    job_title: 'Medical Doctor',
    channel: 'Online',
    customer_segment: 'Professional',
    employee_number: 'EMP006',
    co_brander: 'MedicalCorp',
    address: '123 Medical Avenue, Pretoria, SA',
    postal_code: '0002',
    province: 'Gauteng',
    country: 'South Africa',
    created_at: new Date('2025-01-20T10:00:00'),
    updated_at: new Date('2025-01-20T10:00:00'),
    secondary_pan_owner: {
      id: 106,
      title: 'DR',
      pan: '4140789012345679',
      first_name: 'Thabo',
      family_name: 'Khumalo',
      relationship: 'Spouse',
      phone: '0827891235',
      email: 'dr.thabo@khumedical.co.za',
      birth_date: '1980-09-14',
      created_at: new Date('2025-01-20T10:00:00'),
      updated_at: new Date('2025-01-20T10:00:00')
    },
    payment_instruments: [
      {
        type: 'Professional Platinum Card',
        number: '414078XXXXXX5678',
        name: 'DR. N. KHUMALO',
        full_name: 'DR NALEDI KHUMALO',
        status: 'Active',
        expiry: '11/2026',
        condition: 'ACTIVE',
        status_reason: '',
        type_detail: 'Primary',
        branch: 'Pretoria Central',
        sequence: '001'
      },
      {
        type: 'Professional Platinum Card',
        number: '414078XXXXXX5679',
        name: 'DR. T. KHUMALO',
        full_name: 'DR THABO KHUMALO',
        status: 'Active',
        expiry: '11/2026',
        condition: 'ACTIVE',
        status_reason: '',
        type_detail: 'Secondary',
        branch: 'Pretoria Central',
        sequence: '002'
      }
    ],
    accounts: [
      {
        type: 'Professional Account',
        number: '4140442000067890',
        status: 'PREMIUM',
        expiry: '08/11/2026',
        pan_status_date: '20/01/2025',
        institution: 'Capitec Bank Limited',
        branch: 'MIGRATION BRANCH',
        catalogue_product: 'Professional Platinum Card',
        loyalty_account_number: '4140442000067890',
        account_owner_type: 'Individual',
        plastic_code: 'PROFESSIONAL',
        loyalty_status: 'PLATINUM'
      }
    ],
    loyalty_accounts: [
      {
        institution: 'Capitec Bank Limited',
        branch: 'MIGRATION BRANCH',
        client_code: 'C006',
        catalogue_product: 'Professional Platinum Card',
        product_version: 'v2',
        loyalty_account_number: '4140442000067890',
        account_owner_type: 'Individual',
        loyalty_status: 'PLATINUM',
        exchange_icon: '🔄'
      }
    ]
  }
];

// Create enhanced database with merged fields
export const mockDatabase = mergeFieldsWithData(originalData);

// Generate transaction histories for each customer and their secondary pan owners
export const transactionDatabase = mockDatabase.reduce((acc, customer) => {
  acc[customer.pan] = generateTransactionHistory(customer.pan, 20);

// Generate transaction history for secondary pan owner if exists
  if (customer.secondary_pan_owner) {
    acc[customer.secondary_pan_owner.pan] = generateTransactionHistory(customer.secondary_pan_owner.pan, 15);
  }

  return acc;
}, {});

// Database utility functions
export function getTransactionHistory(pan) {
  return transactionDatabase[pan] || [];
}

export function getCustomerByPan(pan) {
  return mockDatabase.find(customer =>
    customer.pan === pan ||
    (customer.secondary_pan_owner && customer.secondary_pan_owner.pan === pan)
  );
}

export function getCustomerById(id) {
  return mockDatabase.find(customer =>
    customer.id === id ||
    (customer.secondary_pan_owner && customer.secondary_pan_owner.id === id)
  );
}

export function searchCustomers(query) {
  if (!query) return mockDatabase;

  const searchTerm = query.toLowerCase();
  return mockDatabase.filter(customer =>
    customer.first_name?.toLowerCase().includes(searchTerm) ||
    customer.family_name?.toLowerCase().includes(searchTerm) ||
    customer.pan?.includes(searchTerm) ||
    customer.client_code?.toLowerCase().includes(searchTerm) ||
    customer.phone?.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm) ||
    (customer.secondary_pan_owner && (
      customer.secondary_pan_owner.first_name?.toLowerCase().includes(searchTerm) ||
      customer.secondary_pan_owner.family_name?.toLowerCase().includes(searchTerm) ||
      customer.secondary_pan_owner.pan?.includes(searchTerm) ||
      customer.secondary_pan_owner.phone?.includes(searchTerm) ||
      customer.secondary_pan_owner.email?.toLowerCase().includes(searchTerm)
    ))
  );
}

export function getTransactionsByDateRange(pan, startDate, endDate) {
  const transactions = getTransactionHistory(pan);
  const start = new Date(startDate);
  const end = new Date(endDate);

  return transactions.filter(transaction => {
    const transDate = new Date(transaction.Transmission_time);
    return transDate >= start && transDate <= end;
  });
}

export function getTransactionsByAmount(pan, minAmount, maxAmount) {
  const transactions = getTransactionHistory(pan);

  return transactions.filter(transaction => {
    const amount = parseFloat(transaction.Transaction_amount);
    return amount >= minAmount && amount <= maxAmount;
  });
}

export function getTransactionsByType(pan, transactionType) {
  const transactions = getTransactionHistory(pan);

  return transactions.filter(transaction =>
    transaction.Function?.toLowerCase().includes(transactionType.toLowerCase())
  );
}

export function getAllCustomers() {
  return mockDatabase;
}

export function getCustomerCount() {
  return mockDatabase.length;
}

export function getTotalTransactionCount() {
  return Object.values(transactionDatabase).reduce((total, transactions) => total + transactions.length, 0);
}
