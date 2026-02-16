import {
    Button,
    Form,
    Select,
    Upload,
    message,
    Slider,
    InputNumber,
    Card,
    Row,
    Col,
    Divider,
    Table,
    Progress,
} from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";
import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"

function ImageConverter() {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [quality, setQuality] = useState(0.9);
    const [width, setWidth] = useState(null);
    const [height, setHeight] = useState(null);
    const [progress, setProgress] = useState(0);
    const [tableData, setTableData] = useState([]);

    // Drag reorder handler
    const onDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(fileList);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setFileList(items);
    };

    // const handleUploadChange = ({ fileList: newFileList }) => {
    //     setFileList(newFileList);
    // };

    const convertImage = async (values) => {
        if (!fileList.length) {
            message.error("Upload at least one image.");
            return;
        }

        //  NEW CONDITION: Check if all files already in same format
        const selectedFormat = values.format.split("/").pop(); // jpeg, png, etc.

        const sameFormatFiles = fileList.filter((fileItem) => {
            const fileExtension = fileItem.originFileObj.name
                .split(".")
                .pop()
                .toLowerCase();

            return fileExtension === selectedFormat;
        });

        if (sameFormatFiles.length === fileList.length) {
            message.error(
                `All uploaded images are already in ${selectedFormat.toUpperCase()} format.`
            );
            return;
        }

        setLoading(true);
        setProgress(0);

        const zip = new JSZip();
        let results = [];

        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i].originFileObj;
            const fileExtension = file.name.split(".").pop().toLowerCase();

            if (fileExtension === selectedFormat) {
                message.warning(`${file.name} is already ${selectedFormat}`);
                continue;
            }

            const image = new Image();
            image.src = URL.createObjectURL(file);

            await new Promise((resolve) => {
                image.onload = async () => {
                    const canvas = document.createElement("canvas");
                    const newWidth = width || image.width;
                    const newHeight = height || image.height;

                    canvas.width = newWidth;
                    canvas.height = newHeight;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(image, 0, 0, newWidth, newHeight);

                    const base64 =
                        values.format === "image/jpeg" ||
                            values.format === "image/webp" ||
                            values.format === "image/avif"
                            ? canvas.toDataURL(values.format, quality)
                            : canvas.toDataURL(values.format);

                    const blob = await (await fetch(base64)).blob();

                    zip.file(
                        `${file.name.split(".")[0]}.${selectedFormat}`,
                        blob
                    );

                    results.push({
                        key: i,
                        name: file.name,
                        original: (file.size / 1024).toFixed(2),
                        converted: (blob.size / 1024).toFixed(2),
                    });

                    setProgress(Math.round(((i + 1) / fileList.length) * 100));
                    resolve();
                };
            });
        }

        if (!results.length) {
            setLoading(false);
            return;
        }

        setTableData(results);

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, "converted-images.zip");

        setLoading(false);
        message.success("Converted & Downloaded as ZIP!");
    };



    const columns = [
        { title: "File Name", dataIndex: "name" },
        { title: "Original (KB)", dataIndex: "original" },
        { title: "Converted (KB)", dataIndex: "converted" },
    ];

    const options = [
        { label: "JPEG", value: "image/jpeg" },
        { label: "PNG", value: "image/png" },
        { label: "WEBP", value: "image/webp" },
        { label: "AVIF", value: "image/avif" },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <Card className="w-full max-w-4xl rounded-2xl">
                <h2 className="text-2xl font-bold text-center mb-6">
                    Multiple Images Converter
                </h2>

                <Form layout="vertical" onFinish={convertImage}>
                    {/* Thumbnail Grid + Drag Reorder */}
                    <Form.Item label="Upload Images">
                        <Upload
                            multiple
                            beforeUpload={() => false}
                            accept="image/*"
                            showUploadList={false} 
                            onChange={(info) => setFileList(info.fileList)}
                        >
                            <Button>Select Images</Button>
                        </Upload>
                        {/* <Upload
                            listType="picture-card"
                            multiple
                            beforeUpload={() => false}
                            fileList={fileList}
                            onChange={handleUploadChange}
                            showUploadList={{
                                showPreviewIcon: false,   // 👁 Hide eye icon
                            }}
                        >
                            {fileList.length < 20 && "+ Upload"}
                        </Upload> */}

                        {/* Drag reorder */}
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="files" direction="horizontal">
                                {(provided) => (
                                    <div
                                        className="flex flex-wrap gap-2 mt-4"
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {fileList.map((file, index) => (
                                            <Draggable
                                                key={file.uid}
                                                draggableId={file.uid}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="border rounded p-2 bg-gray-100 cursor-move"
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
                    </Form.Item>

                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label="Convert To"
                                name="format"
                                rules={[{ required: true }]}
                            >
                                <Select options={options} size="large" placeholder="Choose Your Image format" />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
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

                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                            <Form.Item label="Width">
                                <InputNumber
                                    min={1}
                                    onChange={setWidth}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item label="Height">
                                <InputNumber
                                    min={1}
                                    onChange={setHeight}
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Divider />

                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        loading={loading}
                        icon={<ThunderboltOutlined />}
                    >
                        Download ZIP
                    </Button>

                    {loading && <Progress percent={progress} className="mt-4" />}

                    {tableData.length > 0 && (
                        <Table
                            columns={columns}
                            dataSource={tableData}
                            pagination={false}
                            className="mt-6"
                        />
                    )}
                </Form>
            </Card>
        </div>
    );
}

export default ImageConverter;
