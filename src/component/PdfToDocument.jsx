import {
  Upload,
  Button,
  Card,
  message,
  Spin
} from "antd";
import { UploadOutlined, DownloadOutlined } from "@ant-design/icons";
import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function PdfToDocument() {
  const [loading, setLoading] = useState(false);
  const [docBlob, setDocBlob] = useState(null);

  // Extract text from PDF
  const extractText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      fullText += content.items.map(item => item.str).join(" ") + "\n\n";
    }

    return fullText;
  };

  // OCR fallback
  const runOCR = async (file) => {
    const { data } = await Tesseract.recognize(file, "eng");
    return data.text;
  };

  const handleUpload = async (info) => {
    try {
      setLoading(true);
      const file = info.file.originFileObj;

      let text = await extractText(file);

      // If no selectable text → run OCR
      if (!text.trim()) {
        message.info("No selectable text found. Running OCR...");
        text = await runOCR(file);
      }

      //  Create Word Document
      const doc = new Document({
        sections: [
          {
            children: text
              .split("\n")
              .map(line => new Paragraph(line))
          }
        ]
      });

      const blob = await Packer.toBlob(doc);
      setDocBlob(blob);

      message.success("Document Ready for Download 🚀");

    } catch (err) {
      message.error("Error converting PDF");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadDoc = () => {
    if (!docBlob) {
      message.warning("No document available");
      return;
    }

    saveAs(docBlob, "converted-document.docx");
  };

  return (
    <Card className="rounded-2xl shadow-xl">
      <Upload.Dragger
        accept="application/pdf"
        beforeUpload={() => false}
        showUploadList={false}
        onChange={handleUpload}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p>Drag & Drop PDF here or Click to Upload</p>
      </Upload.Dragger>

      {loading && (
        <div className="text-center mt-4">
          <Spin size="large" />
        </div>
      )}

      {docBlob && (
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          className="mt-4"
          onClick={downloadDoc}
        >
          Download Word Document
        </Button>
      )}
    </Card>
  );
}

export default PdfToDocument;
