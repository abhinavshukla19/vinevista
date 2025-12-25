import { useState , useEffect } from "react";

export const usedebounce=(usersearch , delay=1000 )=>{
    const [debouncesearch , setdebouncesearch ]=useState(usersearch);

    useEffect(()=>{
        const timmer= setTimeout(() => {
         setdebouncesearch(usersearch)   
        }, delay);

        return ()=>clearTimeout(timmer);

    },[usersearch , delay ]);

    return debouncesearch;
}