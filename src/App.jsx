import "animate.css";
import "antd/dist/reset.css"; 
import { Card, Tabs } from "antd";
import ImageConverter from "./component/ImageConverter";
import ImageToPDF from "./component/ImageToPdf";
import TextToPdf from "./component/TextToPdf";
import ImageToExcel from "./component/ImageToExcel";


function App() {

  const items = [
    {
      key: "1", 
      label: "Image Converter",
      children: <ImageConverter />,
    },
    {
      key: "2", 
      label: "Image to PDF",
      children: <ImageToPDF />,
    },
     {
      key: "3", // 
      label: "Text to PDF",
      children: <TextToPdf />,
    },
     {
      key: "4", // 
      label: "Image to Excel",
      children: <ImageToExcel />,
    }
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-100 px-4 py-10"> 
      <div className="relative w-full max-w-3xl"> 
        <Card
          className="backdrop-blur-xl bg-white/20 border p-4 border-white/30 shadow-2xl rounded-3xl transition-all duration-500 hover:shadow-pink-300/40"
          title={<h1 className="animate__animated animate__fadeInDown text-2xl">Image Tools</h1>}
        >
          <Tabs 
            items={items} 
            defaultActiveKey="1" 
          />
        </Card>
        <div className="text-center text-gray-600 mt-6 text-sm">
          © 2026 Developed By - Mukesh Khandve
        </div>

      </div>
    </div>
  );
}

export default App;
