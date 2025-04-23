"use client";

import React, { useEffect, useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import emailjs from "emailjs-com";
import html2pdf from "html2pdf.js";

const PreviewPage = () => {
  const [invoice, setInvoice] = useState(null);
  const invoiceRef = useRef(null);
  const [showEmailOverlay, setShowEmailOverlay] = useState(false);

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    if (storedInvoices.length > 0) {
      setInvoice(storedInvoices[0]); // Latest invoice
    }
  }, []);
  const handleSendEmail = async (email, subject) => {
    if (!invoiceRef.current) return;

    // Generate PDF blob
    const pdfBlob = await html2pdf()
      .set({
        margin: 0.5,
        filename: "invoice.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter" },
      })
      .from(invoiceRef.current)
      .outputPdf("blob");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64PDF = reader.result.split(",")[1];

      const templateParams = {
        user_email: email,
        subject: subject,
        message: "Attached is your invoice.",
        attachment: base64PDF, // base64 encoded PDF
      };

      try {
        await emailjs.send(
          "service_gqo6dyv", // Replace with your actual service ID
          "service_gqo6dyv", // Replace with your actual template ID
          templateParams,
          "So2z81MwjEKyB04nE" // Replace with your public key from EmailJS
        );
        setShowEmailOverlay(false);
        setShowSuccess(true); // Show success animation
      } catch (error) {
        console.error("EmailJS send error:", error);
        alert("Failed to send email.");
      }
    };

    reader.readAsDataURL(pdfBlob);
  };

  const handleDownloadPDF = () => {
    if (invoiceRef.current) {
      const element = invoiceRef.current;
      const opt = {
        margin: 0.5,
        filename: `${invoice.name.replaceAll(" ", "_")}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };
      html2pdf().set(opt).from(element).save();
    }
  };

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <h2 className="text-2xl font-bold">No Invoice Found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      {/* Invoice Content */}
      <div
        ref={invoiceRef}
        className="bg-white rounded-lg shadow-xl p-10 w-full max-w-3xl"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-blue-600">INVOICE</h2>
            <p className="text-gray-600 mt-2">Date: {invoice.date}</p>
            <p className="text-gray-600">For: {invoice.client}</p>
            <p className="text-gray-600">
              Status: {invoice.emailed ? "Emailed" : "Pending"}
            </p>
          </div>
          <img
            src="/V_GoCreate_Blue_Black_Yellow.svg"
            alt="GoCreate Logo"
            className="h-16"
          />
        </div>

        <table className="w-full text-left border-collapse mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">Item</th>
              <th className="p-3 border">Quantity</th>
              <th className="p-3 border">Price</th>
              <th className="p-3 border">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-3 border">{item.name}</td>
                <td className="p-3 border">{item.quantity}</td>
                <td className="p-3 border">${item.price.toFixed(2)}</td>
                <td className="p-3 border">
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td colSpan="3" className="p-3 border text-right">
                Total
              </td>
              <td className="p-3 border">${invoice.total}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <AnimatePresence>
        {showEmailOverlay && (
          <EmailOverlay
            invoice={invoice}
            onClose={() => setShowEmailOverlay(false)}
            onSend={handleSendEmail}
          />
        )}
      </AnimatePresence>
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-xl shadow-xl p-10 text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              ✅ Email Sent!
            </h2>
            <p className="text-gray-700">
              Your invoice has been successfully emailed.
            </p>
            <button
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => setShowSuccess(false)}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => history.back()}
          className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          Back
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
        <button
          onClick={() => setShowEmailOverlay(true)}
          className="px-6 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Email PDF
        </button>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => history.back()}
          className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          Back
        </button>
        <button
          onClick={handleDownloadPDF}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PreviewPage;
