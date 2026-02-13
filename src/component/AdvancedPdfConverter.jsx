import {
  Upload,
  Button,
  Card,
  Table,
  message,
  Spin
} from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  FileExcelOutlined
} from "@ant-design/icons";
import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import Tesseract from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function AdvancedPdfConverter() {
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Extract selectable text from PDF
  const extractText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str).join(" ") + "\n";
    }

    return text;
  };

  // 🔥 OCR for scanned PDFs
  const runOCR = async (file) => {
    const { data } = await Tesseract.recognize(file, "eng");
    return data.text;
  };

  // 🔥 Smart Table Detection
  const parseTable = (text) => {
    const lines = text
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const structured = lines.map(line =>
      line.split(/\s{2,}|\t|,/)
    );

    if (!structured.length) {
      message.warning("No table data detected");
      return;
    }

    const headers = structured[0];

    const cols = headers.map((header, index) => ({
      title: header || `Column ${index + 1}`,
      dataIndex: `col${index}`,
      key: `col${index}`
    }));

    const rows = structured.slice(1).map((row, rowIndex) => {
      const obj = { key: rowIndex };
      row.forEach((cell, cellIndex) => {
        obj[`col${cellIndex}`] = cell;
      });
      return obj;
    });

    setColumns(cols);
    setTableData(rows);
  };

  // 🔥 Handle Upload
  const handleUpload = async (info) => {
    try {
      setLoading(true);

      const file = info.file.originFileObj;

      let text = await extractText(file);

      // If no text detected → try OCR
      if (!text.trim()) {
        message.info("No selectable text found. Running OCR...");
        text = await runOCR(file);
      }

      parseTable(text);
      message.success("PDF Processed Successfully 🚀");

    } catch (err) {
      message.error("Error processing PDF");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 CSV Download (Safe)
  const exportCSV = () => {
    if (!tableData.length) {
      message.warning("No data available to export");
      return;
    }

    const formattedData = tableData.map(row =>
      columns.map(col => row[col.dataIndex] || "")
    );

    const csv = Papa.unparse(formattedData);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "converted-data.csv";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    message.success("CSV Downloaded 🚀");
  };

  // 🔥 Excel Download (Safe)
  const exportExcel = () => {
    if (!tableData.length) {
      message.warning("No data available to export");
      return;
    }

    const formattedData = tableData.map(row =>
      columns.map(col => row[col.dataIndex] || "")
    );

    const worksheet = XLSX.utils.aoa_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, "converted-data.xlsx");

    message.success("Excel Downloaded 🚀");
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

      {tableData.length > 0 && (
        <>
          <div className="flex gap-3 mt-4">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={exportCSV}
            >
              Download CSV
            </Button>

            <Button
              icon={<FileExcelOutlined />}
              onClick={exportExcel}
            >
              Download Excel
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={tableData}
            className="mt-4"
            scroll={{ x: true }}
            pagination={{ pageSize: 10 }}
          />
        </>
      )}
    </Card>
  );
}

export default AdvancedPdfConverter;
