"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const InvoiceGenerator = () => {
  const [clientName, setClientName] = useState("NIAR ROBOTICS");
  const [items, setItems] = useState([{ name: "", quantity: 1, price: 0 }]);
  const ratePerMin = 3.5;
  const router = useRouter();

  const handleAddItem = () => {
    setItems([...items, { name: "", minutes: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] =
      field === "quantity" || field === "price"
        ? parseFloat(value) || 0
        : value;
    setItems(newItems);
  };

  const calculateAmount = (item) => {
    return (item.quantity * item.price).toFixed(2);
  };

  const calculateTotal = () => {
    return items
      .reduce((total, item) => total + item.quantity * item.price, 0)
      .toFixed(2);
  };

  const handleSaveInvoice = () => {
    const newInvoice = {
      id: Date.now(),
      name: `Invoice ${Date.now()}`,
      client: clientName,
      items: items,
      total: calculateTotal(),
      date: new Date().toLocaleDateString(),
      emailed: false,
    };
    const storedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const updatedInvoices = [newInvoice, ...storedInvoices];
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    alert("Invoice saved successfully!");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">Invoice Generator</h1>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Client Name</label>
        <input
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold mb-2">Invoice Items</label>
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 mb-2">
            <input
              type="text"
              placeholder="Item Name"
              value={item.name}
              onChange={(e) => handleItemChange(index, "name", e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={item.quantity}
              min="1"
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
              className="p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Price per Item"
              value={item.price}
              min="0"
              step="0.01"
              onChange={(e) => handleItemChange(index, "price", e.target.value)}
              className="p-2 border rounded"
            />
            <span className="flex items-center font-semibold">
              ${calculateAmount(item)}
            </span>
          </div>
        ))}

        <button
          onClick={handleAddItem}
          className="mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Add Item
        </button>
      </div>

      <div className="mt-4 mb-6">
        <h2 className="text-xl font-semibold">Total: ${calculateTotal()}</h2>
      </div>

      <div className="space-x-4">
        <button
          onClick={handleSaveInvoice}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
        >
          Save Invoice
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
