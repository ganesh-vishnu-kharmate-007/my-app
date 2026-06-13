import { useState , useEffect} from "react";

//useLocalStorage Think of this like an automated storage locker for your application.
//  Use: It allows us to bundle React's built-in hooks (useState, useEffect) into a single, 
// reusable tool that any page can look at to save data.
//but TypeScript generic <T> provide a flexibility to store it change shape according to data like setting , sesson , object
//Key: name of the specific storage locker you want to open.
//The current saved data (T) :A function to change that data ((value: T) => void). hook return the output with 2 aaray


export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]{
    const [storedValue , setstoredValue] = useState<T>(() =>{
        //try: The try block attempts to read the data safely.
        try{ 
            const item = window.localStorage.getItem(key);//browser storage : getItem(key);This is a built-in browser command that means: "Go to the storage locker named key and bring back whatever text is inside it."
            return item ? JSON.parse(item) : initialValue;
        } catch(error) {// catch If it encounters a fault, the catch block immediately intercepts the error, prints a friendly warning to the developer console, and safely drops back to the default fallback values without freezing the user interface.
             console.warn(`Error reading localStorage key "${key}":`, error);
             return initialValue;
        }
    });

    useEffect(() =>{
        try{
            window.localStorage.setItem(key, JSON.stringify(storedValue));//setItem(key,:- to the storage locker named key, wipe out whatever old stuff was inside it, and put this new stuff in.
        }catch(error){                                                    //JSON.stringify : modifed version that store obj and aary old have not
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    },[key , storedValue]);

    return [storedValue,setstoredValue]

};

