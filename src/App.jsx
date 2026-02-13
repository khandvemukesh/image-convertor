import "animate.css";
import { Card, Tabs } from "antd";
import ImageConverter from "./component/ImageConverter";

function App() {
 

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-100 px-4 py-10">

      {/* 🔥 Background Blur Effects */}
     

      <div className="relative w-full max-w-3xl">
        
        {/* 🧊 Glass Card */}
        <Card
          
          className="backdrop-blur-xl bg-white/20 border p-4 border-white/30 shadow-2xl rounded-3xl transition-all duration-500 hover:shadow-pink-300/40"
          
         
        >
          
          <ImageConverter />
        </Card>

        {/* Footer */}
        <div className="text-center text-white/70 mt-6 text-sm">
          2026 Develop By - Mukesh Khandve
        </div>

      </div>
    </div>
  );
}

export default App;
