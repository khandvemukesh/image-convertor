import jsPDF from "jspdf";
import { useState } from "react";

function PdfToDocument() {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("document");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const readFile = (e) => {
    const fileObj = e.target.files[0];

    if (!fileObj) return;

    // ✅ File type validation
    if (fileObj.type !== "text/plain") {
      setError("Only .txt files are allowed.");
      return;
    }

    // ✅ File size limit (2MB)
    if (fileObj.size > 2 * 1024 * 1024) {
      setError("File must be less than 2MB.");
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onload = (event) => {
      setContent(event.target.result);
      setFileName(fileObj.name.replace(".txt", ""));
    };

    reader.onerror = () => {
      setError("Failed to read file.");
    };

    reader.readAsText(fileObj);
  };

  const generatePdf = () => {
    if (!content.trim()) {
      setError("Text area is empty.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const margin = 15;
      const lineHeight = 7;
      const maxWidth = pageWidth - margin * 2;

      const lines = doc.splitTextToSize(content, maxWidth);

      let y = 20;

      lines.forEach((line) => {
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });

      doc.save(`${fileName}.pdf`);
    } catch (err) {
      setError("Error generating PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center p-6">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 w-full max-w-2xl">

        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Text to PDF Converter
        </h1>

        {/* File Upload */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Upload .txt File
          </label>
          <input
            type="file"
            accept=".txt"
            onChange={readFile}
            className="w-full border border-gray-300 rounded-lg p-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Text Area */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Edit Content
          </label>
          <textarea
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="File content will appear here..."
            className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-500 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Button */}
        <button
          onClick={generatePdf}
          disabled={loading}
          className={`w-full py-3 rounded-lg !text-white font-semibold transition-all duration-300 ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {loading ? "Generating PDF..." : "Generate PDF"}
        </button>
      </div>
    </div>
  );
}

export default PdfToDocument;
