'use client'

import { useState } from 'react'
import InvoiceForm from '@/components/InvoiceForm'

export default function CreateInvoicePage() {
  return (
    <InvoiceForm
      mode="create"
      initialData={null}
    />
  );
}
