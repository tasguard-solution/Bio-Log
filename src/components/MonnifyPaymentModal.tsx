import React, { useEffect, useState } from 'react';
import { loadMonnifyScript } from '../lib/monnify';

// Add type for window.MonnifySDK
declare global {
  interface Window {
    MonnifySDK: any;
  }
}

interface MonnifyPaymentModalProps {
  amount: number;
  customerName: string;
  customerEmail: string;
  paymentDescription: string;
  onSuccess: (response: any) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function MonnifyPaymentModal({
  amount,
  customerName,
  customerEmail,
  paymentDescription,
  onSuccess,
  onClose,
  isOpen
}: MonnifyPaymentModalProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    loadMonnifyScript().then(() => {
      setIsScriptLoaded(true);
    }).catch((err) => {
      console.error("Failed to load Monnify SDK", err);
    });
  }, []);

  useEffect(() => {
    if (isOpen && isScriptLoaded) {
      // Provide fallback values if env vars are missing
      const apiKey = import.meta.env.VITE_API_Key || 'MK_TEST_XXXXXXXX';
      const contractCode = import.meta.env.VITE_Contract_Code || '1234567890';

      window.MonnifySDK.initialize({
        amount: amount,
        currency: "NGN",
        reference: String(new Date().getTime()), // Must be a primitive string
        customerFullName: customerName,
        customerEmail: customerEmail,
        apiKey: apiKey,
        contractCode: contractCode,
        paymentDescription: paymentDescription,
        metadata: {
            "name": customerName
        },
        onLoadStart: () => {
            console.log("loading has started");
        },
        onLoadComplete: () => {
            console.log("SDK is UP");
        },
        onComplete: (response: any) => {
            // Implement what happens when the transaction is completed.
            console.log("Payment Complete:", response);
            onSuccess(response);
            onClose();
        },
        onClose: (data: any) => {
            // Implement what should happen when the modal is closed here
            console.log("Modal Closed:", data);
            onClose();
        }
      });
    }
  }, [isOpen, isScriptLoaded, amount, customerEmail, customerName, paymentDescription, onClose, onSuccess]);

  return null; // The SDK injects its own modal into the DOM
}
