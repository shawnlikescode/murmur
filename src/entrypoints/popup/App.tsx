import { Button } from "@/components/ui/button";
import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center size-40">
      <Button onClick={() => setCount(prev => prev + 1)}>Click me</Button>
      <p className="text-2xl font-bold p-3">Count: {count}</p>
    </div>
  );
}

export default App;
