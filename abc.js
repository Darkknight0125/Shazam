import React, {useState} from 'react';

function counter(){
    const [count, setCount] = useState(0);

    return(
        <div>
            <p>Count: {count}</p>
            <button onclick={ ()=> (setCount, count+1) }>Click</button>
        </div>
    )
} 