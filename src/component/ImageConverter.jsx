import {
    Button,
    Form,
    Select,
    Upload,
    message,
    Slider,
    InputNumber,
    Switch,
    Card,
    Row,
    Col,
    Statistic,
    Divider,
} from "antd";
import { InboxOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Dragger } = Upload;

function ImageConverter() {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [quality, setQuality] = useState(0.9);
    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    //   const [darkMode, setDarkMode] = useState(false);
    const [sizeStats, setSizeStats] = useState(null);

    const handleFileChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const convertImage = async (values) => {
        if (fileList.length === 0) {
            message.error("Upload at least one image.");
            return;
        }

        setLoading(true);

        let totalOriginal = 0;
        let totalConverted = 0;

        for (let fileItem of fileList) {
            const file = fileItem.originFileObj;
            totalOriginal += file.size;

            const image = new Image();
            image.src = URL.createObjectURL(file);

            await new Promise((resolve) => {
                image.onload = () => {
                    const canvas = document.createElement("canvas");
                    const newWidth = width || image.width;
                    const newHeight = height || image.height;

                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, newWidth, newHeight);

                    const finalImage =
                        values.format === "image/jpeg" ||
                            values.format === "image/webp" ||
                            values.format === "image/avif"
                            ? canvas.toDataURL(values.format, quality)
                            : canvas.toDataURL(values.format);

                    const convertedSize = finalImage.length * 0.75;
                    totalConverted += convertedSize;

                    const link = document.createElement("a");
                    link.href = finalImage;
                    link.download = `${file.name.split(".")[0]}.${values.format
                        .split("/")
                        .pop()}`;
                    link.click();

                    resolve();
                };
            });
        }

        setSizeStats({
            original: (totalOriginal / 1024).toFixed(2),
            converted: (totalConverted / 1024).toFixed(2),
        });

        setLoading(false);
        message.success("✨ All images converted successfully!");
    };

    const options = [
        { label: "JPEG", value: "image/jpeg" },
        { label: "PNG", value: "image/png" },
        { label: "WEBP", value: "image/webp" },
        { label: "AVIF", value: "image/avif" },
        { label: "BMP", value: "image/bmp" },
    ];

    return (
        <div
            className={`min-h-screen flex items-center justify-center p-6 transition-all duration-500 }`}
        >
            <Card
                className={`w-full max-w-3xl backdrop-blur-xl bg-white/70 rounded-2xl border-0 transition-all }`}
                title={
                    <div className="flex justify-between items-center">
                        <h1 className="lg:text-3xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                            Multiple Images Converter
                        </h1>

                    </div>
                }
            >
                <Form layout="vertical" onFinish={convertImage}>
                    {/* Upload Section */}
                    <Form.Item label="Upload Images">
                        <Dragger
                            multiple
                            beforeUpload={() => false}
                            fileList={fileList}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="rounded-xl border-dashed border-2 hover:border-indigo-500 transition-all"
                        >
                            <p className="text-4xl text-indigo-500">
                                <InboxOutlined />
                            </p>
                            <p className="font-medium text-base sm:text-sm">
                                Drag & Drop or Click to Upload
                            </p>
                            <p className="text-sm opacity-70">
                                Supports multiple images upload
                            </p>
                        </Dragger>
                    </Form.Item>

                    {/* Format + Quality */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item
                                label="Convert To"
                                name="format"
                                rules={[{ required: true, message: "Select format" }]}
                            >
                                <Select
                                    options={options}
                                    size="large"
                                    placeholder="Choose your format"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            <Form.Item label="Quality">
                                <Slider
                                    min={0.1}
                                    max={1}
                                    step={0.1}
                                    value={quality}
                                    onChange={setQuality}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {/* Resize Fields */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={12}>
                            <Form.Item label="Width">
                                <InputNumber
                                    min={1}
                                    placeholder="Width"
                                    onChange={setWidth}
                                    style={{ width: "100%" }}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} sm={24} md={12}>
                            <Form.Item label="Height">
                                <InputNumber
                                    min={1}
                                    placeholder="Height"
                                    onChange={setHeight}
                                    style={{ width: "100%" }}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    {/* Convert Button */}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            block
                            size="large"
                            loading={loading}
                            disabled={fileList.length === 0}
                            icon={<ThunderboltOutlined />}
                            className="rounded-xl h-12 text-lg bg-gradient-to-r from-indigo-500 to-purple-600 border-0 hover:scale-105 transition-transform"
                        >
                            Convert All Images
                        </Button>
                    </Form.Item>

                    {/* Size Stats */}
                    {sizeStats && (
                        <Row gutter={[16, 16]} className="mt-6 text-center">
                            <Col xs={24} sm={12}>
                                <Statistic
                                    title="Original Size (KB)"
                                    value={sizeStats.original}
                                />
                            </Col>
                            <Col xs={24} sm={12}>
                                <Statistic
                                    title="Converted Size (KB)"
                                    value={sizeStats.converted}
                                />
                            </Col>
                        </Row>
                    )}
                </Form>

            </Card>
        </div>
    );
}

export default ImageConverter;
