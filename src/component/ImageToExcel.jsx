import { useState } from "react";
import Tesseract from "tesseract.js";

function PdfToDcoument() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setImage(URL.createObjectURL(file));
    extractText(file);
  };

  const extractText = async (file) => {
    setLoading(true);

    const result = await Tesseract.recognize(file, "eng", {
      logger: (m) => console.log(m),
    });

    setText(result.data.text);
    setLoading(false);
  };

  const downloadCSV = () => {
    if (!text) return;

    // Convert text into rows (split by line)
    const rows = text.split("\n").map((row) => row.split(" "));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "converted.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="bg-white rounded-xl w-full max-w-2xl p-8 border border-gray-300">
        <h2 className="text-2xl font-bold text-center mb-4">
          Image to Excel (CSV) Converter
        </h2>

        <input type="file" accept="image/*" onChange={handleImage} className="border !mb-4 border-gray-200 w-full p-2 rounded-lg" />

        {image && (
          <img
            src={image}
            alt="preview"
            className="!mt-4 max-h-60 rounded-lg border"
          />
        )}

        {loading && (
          <p className="mt-4 text-blue-600 font-medium">
            Extracting text... Please wait
          </p>
        )}

        <textarea
          value={text}
          readOnly
          rows={8}
          className="w-full mt-4 border border-gray-300 rounded-lg p-2"
        />

        {text && (
          <button
            onClick={downloadCSV}
            className="mt-4 w-full bg-green-600 !text-white py-2 rounded-lg hover:bg-green-700"
          >
            Download CSV
          </button>
        )}
      </div>
    </div>
  );
}

export default PdfToDcoument;
