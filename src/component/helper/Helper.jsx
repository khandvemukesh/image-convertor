// const covertToPdf = (values) => {
    //     try {

    //         const url = URL.createObjectURL(file)
    //         const image = new Image()
    //         image.src = url
    //         image.onload = () => {
    //             const newWidth = image.width
    //             const newHeight = image.height
    //             console.log(newWidth, newHeight)
    //             const pdf = new jsPDF({
    //                 orientation: newWidth > newHeight ? "landscape" : "portrait",
    //                 unit: 'px',
    //                 format: [newWidth, newHeight]
    //             })
    //             pdf.addImage(image, 'PNG', 0, 0)
    //             pdf.save('sample.pdf')
    //         }
    //     } catch (err) {
    //         message.error(err.message)
    //     }



    // }

    // import { Button, Form, Input, message } from 'antd'
    // import { useState } from 'react'
    // import { jsPDF } from 'jspdf'
    
    // function ImageToPdf() {
    //     const [files, setFiles] = useState(null)
    //     const convertMultiple = () => {
    //         try {
    //             const pdf = new jsPDF()
    //             const pageWidth = pdf.internal.pageSize.getWidth()
    //             const pageHeight = pdf.internal.pageSize.getHeight()
    //             Array.from(files).forEach((file, index) => {
    //                 const url = URL.createObjectURL(file)
    //                 const image = new Image()
    //                 image.src = url
    //                 image.onload = () => {
    //                     const newWidth = image.width
    //                     const newHeight = image.height
    //                     const ratio = Math.min(pageWidth / newWidth, pageHeight / newHeight)
    //                     const scaledWidth = newWidth * ratio
    //                     const scaledHeight = newHeight * ratio
    //                     const x = (pageWidth - scaledWidth) / 2
    //                     const y = (pageHeight - scaledHeight) / 2
    //                     if (index !== 0) {
    //                         pdf.addPage()
    //                     }
    //                     pdf.addImage(image, 'PNG', x, y, scaledWidth, scaledHeight)
    //                     if (index === files.length - 1) {
    //                         pdf.save(`combined-images.pdf`)
    //                     }
    //                 }
    //             })
    //         } catch (err) {
    //             message.error(err.message)
    //         }
    //     }
        
    //     return (
    //         <Form onFinish={convertMultiple}>
    //             <Form.Item >
    //                 <Input type="file"
    //                     size="large"
    //                     accept="image/*"
    //                     rules={[{ required: true }]}
    //                     name="image"
    //                     onChange={(e) => setFiles(e.target.files)}
    //                     multiple
    
    //                 />
    //             </Form.Item>
    //             <Form.Item>
    //                 <Button type="primary" danger htmlType='submit' size="large">Image to Pdf</Button>
    //             </Form.Item>
    //         </Form>
    //     )
    // }
    
    // export default ImageToPdf
    