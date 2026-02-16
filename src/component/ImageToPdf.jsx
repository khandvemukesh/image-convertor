import {
    Button,
    Form,
    Input,
    Upload,
    Card,
    Switch,
    message,
    Modal,
    Slider
} from "antd";
import {
    UploadOutlined,
    FilePdfOutlined
} from "@ant-design/icons";
import { useState } from "react";
import { jsPDF } from "jspdf";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function ImageToPdf() {
    const [files, setFiles] = useState([]);
    const [pdfName, setPdfName] = useState("combined-images");
    const [watermark, setWatermark] = useState("Mukesh PDF Tool");
    //   const [darkMode, setDarkMode] = useState(false);
    const [compression, setCompression] = useState(0.7);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);

    // Drag reorder
    const handleDrag = (result) => {
        if (!result.destination) return;
        const items = Array.from(files);
        const [reordered] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reordered);
        setFiles(items);
    };

    // Load image
    const loadImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;
                img.onload = () =>
                    resolve({ img, width: img.width, height: img.height });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Generate PDF (Preview or Download)
    const generatePDF = async (preview = false) => {
        try {
            if (!files.length) return message.warning("Upload images first");

            const pdf = new jsPDF({ compress: true });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            for (let i = 0; i < files.length; i++) {
                const { img, width, height } = await loadImage(files[i]);

                const ratio = Math.min(
                    (pageWidth - 20) / width,
                    (pageHeight - 20) / height
                );

                const w = width * ratio;
                const h = height * ratio;
                const x = (pageWidth - w) / 2;
                const y = (pageHeight - h) / 2;

                if (i !== 0) pdf.addPage();

                pdf.addImage(
                    img,
                    "JPEG",
                    x,
                    y,
                    w,
                    h,
                    undefined,
                    "FAST"
                );

                // Watermark
                pdf.setFontSize(20);
                pdf.setTextColor(150);
                pdf.text(watermark, pageWidth / 2, pageHeight / 2, {
                    align: "center",
                    angle: 45
                });

                // Page number
                pdf.setFontSize(10);
                pdf.text(
                    `Page ${i + 1} of ${files.length}`,
                    pageWidth - 20,
                    pageHeight - 10
                );
            }

            if (preview) {
                const blob = pdf.output("bloburl");
                setPreviewUrl(blob);
                setPreviewVisible(true);
            } else {
                pdf.save(`${pdfName}.pdf`);
                message.success("PDF Downloaded 🚀");
            }

        } catch (err) {
            message.error("Error generating PDF");
        }
    };

    return (
        <div className={"text-white p-6 rounded-2xl"}>
              
            <Card className="rounded-2xl">
                <h2 className="text-2xl font-bold text-center !mb-4">
                    Image to PDF Converter
                </h2>
                <Form layout="vertical">
                    <Form.Item label="Upload Images">
                        <Upload
                            multiple
                            beforeUpload={() => false}
                            accept="image/*"
                            showUploadList={false}
                            onChange={(info) =>
                                setFiles(info.fileList.map(f => f.originFileObj))
                            }
                        >
                            <Button icon={<UploadOutlined />}>
                                Select Images
                            </Button>
                        </Upload>
                    </Form.Item>

                    {/*  Drag reorder preview */}
                    <DragDropContext onDragEnd={handleDrag}>
                        <Droppable droppableId="images">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="space-y-2"
                                >
                                    {files.map((file, index) => (
                                        <Draggable
                                            key={index.toString()}
                                            draggableId={index.toString()}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="p-2 bg-gray-100 rounded-lg"
                                                >
                                                    {file.name}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                    <Form.Item label="PDF Name">
                        <Input
                            value={pdfName}
                            onChange={(e) => setPdfName(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item label="Watermark Text">
                        <Input
                            value={watermark}
                            onChange={(e) => setWatermark(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item label="Compression Level">
                        <Slider
                            min={0.1}
                            max={1}
                            step={0.1}
                            value={compression}
                            onChange={setCompression}
                        />
                    </Form.Item>

                    {/* <Form.Item label="Dark Mode">
            <Switch checked={darkMode} onChange={setDarkMode} />
          </Form.Item> */}

                    <div className="flex gap-3">
                        <Button
                            type="primary"
                            icon={<FilePdfOutlined />}
                            onClick={() => generatePDF(false)}
                        >
                            Download PDF
                        </Button>

                        <Button
                            onClick={() => generatePDF(true)}
                        >
                            Preview PDF
                        </Button>
                    </div>
                </Form>
            </Card>

            {/* Preview Modal */}
            <Modal
                open={previewVisible}
                onCancel={() => setPreviewVisible(false)}
                footer={null}
                width={800}
            >
                <iframe
                    src={previewUrl}
                    width="100%"
                    height="600px"
                    title="PDF Preview"
                />
            </Modal>
        </div>
    );
}

export default ImageToPdf;
