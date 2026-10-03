import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ModalStore from "./modalStore";
import ProfileStore from "./profileStore";
import CommentStore from "./commentStore";
import PrivateChatStore from "./privateChatStore";
import MessageStore from "./messageStore";

interface Store {
    activityStore: ActivityStore
    commonStore: CommonStore;
    userStore: UserStore;
    modalStore: ModalStore;
    profileStore: ProfileStore;
    commentStore: CommentStore;
    privateChatStore: PrivateChatStore;
    messageStore: MessageStore;
}

//object storing multiple stores
export const store: Store = {
    activityStore: new ActivityStore(),
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    modalStore: new ModalStore(),
    profileStore: new ProfileStore(),
    commentStore: new CommentStore(),
    privateChatStore: new PrivateChatStore(),
    messageStore: new MessageStore(),
}

//context for passing store across components
export const StoreContext = createContext(store);

//custom hook to use storeContext within the context provider
export function useStore() {
    return useContext(StoreContext);
}