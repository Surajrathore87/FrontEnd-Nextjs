import React from 'react'
import dynamic from 'next/dynamic';

const PaymentResponse = dynamic(import('components/PaymentResponse'));

export default function Payments() {
  return (
    <PaymentResponse />
  )
}

