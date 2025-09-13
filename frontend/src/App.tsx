import PromptGenerator from "./components/features/PromptGenerator";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <PromptGenerator />
      <Toaster closeButton position="top-center" />
    </div>
  );
}

export default App;
