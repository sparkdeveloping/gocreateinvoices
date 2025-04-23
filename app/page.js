"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const categories = {
  "Water Jet": [{ name: "1 Min Water Jet", price: 2.5 }],
  Welding: [
    { name: "Lincoln 1/8 Stick Rod", price: 1.0 },
    { name: "3/32 4043 Aluminum Tig Rod", price: 1.0 },
    { name: "3/32 Mild Steel TIG", price: 1.0 },
    { name: "3/32 Stainless TIG", price: 1.15 },
    { name: "0.045 Spool Gun", price: 1.1 },
    { name: "0.035 Spool Gun", price: 1.1 },
    { name: "1/8 Tungsten Electrode", price: 7.0 },
  ],
  Merchandise: [
    { name: "Flash Drives", price: 15.0 },
    { name: "Expo Markers", price: 2.0 },
    { name: "Nametags", price: 5.0 },
    { name: "Badges", price: 2.0 },
    { name: "Custom T-Shirts", price: 25.0 },
    { name: "Corporate XL T-Shirts", price: 10.0 },
  ],
  Membership: [
    { name: "Single Membership", price: 125.0 },
    { name: "Teachers/WSU Employees", price: 83.0 },
    { name: "Veterans & Seniors", price: 99.0 },
    { name: "Household Membership", price: 150.0 },
  ],
  Textile: [
    { name: "Embroidery", price: 10.0 },
    { name: "Replacement Needle", price: 3.0 },
    { name: "Bobbin", price: 1.0 },
    { name: "Thread", price: 1.0 },
  ],
};

const InvoiceGenerator = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [price, setPrice] = useState(0);
  const [clientName, setClientName] = useState("");

  const router = useRouter();

  const [items, setItems] = useState([]);

  const handleAddItem = () => {
    if (selectedItem) {
      const existing = items.find((i) => i.name === selectedItem);
      if (existing) {
        // Increment quantity if item already added
        const updated = items.map((i) =>
          i.name === selectedItem ? { ...i, quantity: i.quantity + 1 } : i
        );
        setItems(updated);
      } else {
        setItems([...items, { name: selectedItem, price, quantity: 1 }]);
      }
    }
  };

  const handleSaveInvoice = () => {
    const newInvoice = {
      id: Date.now(),
      name: `Invoice for ${clientName} - ${Date.now()}`,
      client: clientName,
      items: items,
      total: items.reduce((acc, item) => acc + item.price, 0).toFixed(2),
      date: new Date().toLocaleDateString(),
      emailed: false,
    };
    const storedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    const updatedInvoices = [newInvoice, ...storedInvoices];
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    alert("Invoice saved successfully!");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-md flex justify-center items-center"
    >
      <div className="bg-white p-8 rounded shadow-xl w-96">
        <h1 className="text-3xl font-bold mb-6">Invoice Generator</h1>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Client Name</label>
          <input
            type="text"
            placeholder="Enter Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-semibold mb-2">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Category</option>
            {Object.keys(categories).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Item</label>
            <select
              value={selectedItem}
              onChange={(e) => {
                const item = categories[selectedCategory].find(
                  (i) => i.name === e.target.value
                );
                setSelectedItem(item.name);
                setPrice(item.price);
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Item</option>
              {categories[selectedCategory].map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleAddItem}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Add Item
        </button>

        <div className="mt-4">
          <h2 className="text-xl font-semibold">Items</h2>
          <ul className="list-disc pl-6">
            {items.map((item, index) => (
              <li key={index}>
                {item.name} — {item.quantity} x ${item.price.toFixed(2)} = $
                {(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold mt-2">
            Total: $
            {items
              .reduce((acc, item) => acc + item.price * item.quantity, 0)
              .toFixed(2)}
          </h3>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={handleSaveInvoice}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
          >
            Save Invoice
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white font-semibold rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const HomePage = () => {
  const [showInvoice, setShowInvoice] = useState(false);
  const users = [
    "Denzel Nyatsanza",
    "Ryan Holle",
    "Brian Furusa",
    "Ratidzai Mabvanya",
    "Ken Wiseman",
  ];
  const [user, setUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleOpenInvoice = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseInvoice = () => {
    setSelectedInvoice(null);
  };

  const handleDeleteInvoice = (id) => {
    const updatedInvoices = invoices.filter((invoice) => invoice.id !== id);
    setInvoices(updatedInvoices);
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    setSelectedInvoice(null);
  };

  const handleEmailInvoice = (id) => {
    const updatedInvoices = invoices.map((invoice) =>
      invoice.id === id ? { ...invoice, emailed: true } : invoice
    );
    setInvoices(updatedInvoices);
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
    setSelectedInvoice(null);
  };

  const handleLogin = () => {
    if (user) setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser("");
    setIsLoggedIn(false);
  };

  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const storedInvoices = JSON.parse(localStorage.getItem("invoices")) || [];
    setInvoices(storedInvoices);
  }, [showInvoice]);

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      {!isLoggedIn ? (
        <div className="flex flex-col items-center justify-center">
          <img
            src="/V_GoCreate_Blue_Black_Yellow.svg"
            alt="GoCreate Logo"
            className="h-16 mb-4"
          />
          <h1 className="text-3xl font-bold mb-4">Select Your Name to Login</h1>
          <select
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="p-2 mb-4 border rounded"
          >
            <option value="">Select User</option>
            {users.map((name, index) => (
              <option key={index} value={name}>
                {name}
              </option>
            ))}
          </select>
          <button
            onClick={handleLogin}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">GoCreate Invoice Generator</h1>
            <div>
              <span className="text-lg font-semibold mr-4">
                Logged in as: {user}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>

          <button
            onClick={() => setShowInvoice(true)}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
          >
            Generate Invoice
          </button>
        </div>
      )}

      {isLoggedIn && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Invoices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => handleOpenInvoice(invoice)}
                  className="bg-white border rounded-lg shadow-md p-4 hover:shadow-lg transition-all cursor-pointer"
                >
                  <p className="text-lg font-semibold">{invoice.name}</p>
                  <p className="text-gray-700">Total: ${invoice.total}</p>
                  <p className="mt-1">
                    Status:{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        invoice.emailed
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {invoice.emailed ? "Emailed" : "Waiting to be Emailed"}
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No invoices created yet.</p>
            )}
          </div>
        </div>
      )}
      {isLoggedIn && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Invoices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invoices.length > 0 ? (
              invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  onClick={() => handleOpenInvoice(invoice)}
                  className="bg-white border rounded-lg shadow-md p-4 hover:shadow-lg transition-all cursor-pointer"
                >
                  <p className="text-lg font-semibold">{invoice.name}</p>
                  <p className="text-gray-700">Total: ${invoice.total}</p>
                  <p className="mt-1">
                    Status:{" "}
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        invoice.emailed
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {invoice.emailed ? "Emailed" : "Waiting to be Emailed"}
                    </span>
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No invoices created yet.</p>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selectedInvoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex justify-center items-center bg-blue-900 bg-opacity-70 backdrop-blur-md"
          >
            <div className="bg-white bg-opacity-80 rounded-2xl shadow-2xl p-10 max-w-[800px] w-full">
              <div className="flex justify-between items-center mb-6">
                <img
                  src="/V_GoCreate_Blue_Black_Yellow.svg"
                  alt="GoCreate Logo"
                  className="h-16"
                />
                <h2 className="text-4xl font-bold text-blue-600">INVOICE</h2>
              </div>

              <div className="flex justify-between mb-8">
                <div>
                  <p className="text-lg font-semibold">
                    Wichita State University
                  </p>
                  <p>GoCreate</p>
                  <p>Attn: Angie Myrtle</p>
                  <p>316-978-6358 / angela.myrtle@wichita.edu</p>
                  <p>Campus Box 118, 1845 Fairmount</p>
                  <p>Wichita, KS 67260-0118</p>
                </div>
                <div className="text-right">
                  <p>
                    <strong>Date:</strong> {selectedInvoice.date}
                  </p>
                  <p>
                    <strong>For:</strong> {selectedInvoice.client}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    {selectedInvoice.emailed
                      ? "Emailed"
                      : "Waiting to be Emailed"}
                  </p>
                </div>
              </div>

              <table className="w-full text-left border-collapse rounded-md overflow-hidden shadow-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border">Item</th>
                    <th className="p-3 border"># of item</th>
                    <th className="p-3 border">$/item</th>
                    <th className="p-3 border">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, index) => (
                    <tr key={index} className="border bg-white">
                      <td className="p-3">{item.name}</td>
                      <td className="p-3">{item.quantity}</td>
                      <td className="p-3">${item.price.toFixed(2)}</td>
                      <td className="p-3">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="border-t">
                    <td colSpan="3" className="p-3 font-semibold">
                      TOTAL
                    </td>
                    <td className="p-3 font-semibold">
                      ${selectedInvoice.total}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className="mt-6 flex justify-end space-x-4">
                {user === "Ken Wiseman" && (
                  <>
                    <button
                      onClick={() => handleEmailInvoice(selectedInvoice.id)}
                      className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                    >
                      Mark as Emailed
                    </button>
                    <button
                      onClick={() => handleDeleteInvoice(selectedInvoice.id)}
                      className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
                <button
                  onClick={handleCloseInvoice}
                  className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInvoice && (
          <InvoiceGenerator onClose={() => setShowInvoice(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
