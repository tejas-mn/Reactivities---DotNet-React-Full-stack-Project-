import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { MessageConversation } from '../models/message';

export default class MessageStore {
    conversations: MessageConversation[] = [];
    loading = false;

    constructor() {
        makeAutoObservable(this);
    }

    loadConversations = async () => {
        this.loading = true;
        try {
            const conversations = await agent.Messages.list();
            runInAction(() => {
                this.conversations = conversations;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
            console.error(error);
        }
    };

    updateConversation = (userName: string, lastMessage: string, lastUpdated: string) => {
        const existing = this.conversations.find(c => c.partnerUserName === userName);
        if (existing) {
            existing.lastMessage = lastMessage;
            existing.lastUpdated = lastUpdated;
        } else {
            this.conversations.unshift({
                partnerUserName: userName,
                lastMessage,
                lastUpdated
            });
        }
    };
}
