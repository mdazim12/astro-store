// src/components/react/Counter.jsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="my-4">
      <p>Count: {count}</p>
      {/* You can use Tailwind/DaisyUI classes directly! */}
      <button 
        className="btn btn-primary" 
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </div>
  );
}