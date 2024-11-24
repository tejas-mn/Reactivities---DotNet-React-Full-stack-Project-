import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

interface Store {
    activityStore : ActivityStore
}

//object storing multiple stores
export const store : Store = {
    activityStore : new ActivityStore()
}

//context for passing store across components
export const StoreContext = createContext(store);

//custom hook to use storeContext within the context provider
export function useStore(){
    return useContext(StoreContext);
}