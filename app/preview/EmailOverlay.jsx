import { motion } from "framer-motion";
import React from "react";

const EmailOverlay = ({ invoice, onClose, onSend }) => {
  const [email, setEmail] = React.useState("denzelnyatsanza@gmail.com");
  const [subject, setSubject] = React.useState(
    `Invoice for ${invoice.client} - ${invoice.date}`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50"
    >
      <div className="bg-white rounded-lg p-8 shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Email Invoice</h2>
        <label className="block mb-2 font-medium">Recipient Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 font-medium">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={() => onSend(email, subject)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmailOverlay;
