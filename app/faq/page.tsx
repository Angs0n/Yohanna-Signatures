'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const faqs = [
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept Visa, Mastercard, Verve cards, and bank transfers through our secure payment gateway.'
  },
  {
    question: 'How long does shipping take?',
    answer: 'Orders within Lagos typically arrive within 1-2 business days. Other Nigerian states: 3-5 business days.'
  },
  {
    question: 'Can I return or exchange an item?',
    answer: 'Yes, we accept returns within 14 days of delivery. Items must be unworn with tags attached.'
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship to select countries. International shipping takes 7-14 business days.'
  },
  {
    question: 'How do I track my order?',
    answer: 'Once your order ships, you\'ll receive an email with tracking information.'
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="font-serif text-4xl text-center mb-4">FAQ</h1>
        <p className="text-gray-600 text-center mb-12">Frequently asked questions</p>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50"
              >
                <span className="font-medium">{faq.question}</span>
                {openIndex === index ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}