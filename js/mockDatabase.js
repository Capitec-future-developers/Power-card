const mockDatabase = [
  {
    pan: '4644090987127908',
    first_name: 'Omphile',
    family_name: 'Mohlala',
    corporate_id: 'CORP001',
    legal_id: 'L12345',
    client_host_id: 'CH001',
    client_code: 'C001',
    corporate_name: 'Mzansi Tech',
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
        type_detail: 'Primary'
      }
    ],
    accounts: [
      {
        type: 'Personal Gold Account',
        number: '4140442000004918',
        status: 'NORMAL',
        expiry: '01/10/2025',
        pan_status_date: '01/01/2025'
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
        status: 'NORMAL',
        expiry: '03/15/2026',
        pan_status_date: '02/01/2025'
      }
    ]
  },
  {
    pan: '4644987654321098',
    first_name: 'Zenzi',
    family_name: 'Dube',
    corporate_id: 'CORP003',
    legal_id: 'L54321',
    client_host_id: 'CH003',
    client_code: 'C003',
    corporate_name: 'Durban Solutions',
    phone: '0835533344',
    birth_date: '1985-12-15',
    address: '78 Pine Road, Durban, SA',
    created_at: new Date('2025-03-01T10:00:00'),
    updated_at: new Date('2025-03-01T10:00:00'),
    payment_instruments: [
      {
        type: 'Personal Silver Credit Card',
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
        status: 'NORMAL',
        expiry: '12/12/2024',
        pan_status_date: '03/01/2025'
      }
    ]
  }
];
