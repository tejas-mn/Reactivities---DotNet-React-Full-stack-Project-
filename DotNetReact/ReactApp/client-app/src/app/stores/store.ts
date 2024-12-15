import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ModalStore from "./modalStore";

interface Store {
    activityStore : ActivityStore
    commonStore: CommonStore;
    userStore:UserStore;
    modalStore: ModalStore;
}

//object storing multiple stores
export const store : Store = {
    activityStore : new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
}

//context for passing store across components
export const StoreContext = createContext(store);

//custom hook to use storeContext within the context provider
export function useStore(){
    return useContext(StoreContext);
}