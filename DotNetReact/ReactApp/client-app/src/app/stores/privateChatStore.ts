import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { makeAutoObservable, runInAction } from 'mobx';
import { store } from './store';

export interface PrivateChatMessage {
    id: string;
    senderUserName: string;
    recipientUserName: string;
    content: string;
    createdAt: string;
}

export default class PrivateChatStore {
    messages: PrivateChatMessage[] = [];
    unreadCount = 0;
    unreadByUser = new Map<string, number>();
    loading = false;
    hubConnection: HubConnection | null = null;
    globalHubConnection: HubConnection | null = null;
    private connectionPromise: Promise<void> | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (otherUserName: string) => {
        if (!store.userStore.user?.token) {
            return;
        }

        if (this.hubConnection?.state === HubConnectionState.Connected) {
            runInAction(() => {
                this.loading = true;
            });
            this.hubConnection?.invoke('LoadConversation', otherUserName).catch(console.error);
            return;
        }

        this.stopHubConnection();
        runInAction(() => {
            this.loading = true;
            this.messages = [];
        });

        this.hubConnection = new HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_CHAT_URL || 'http://localhost:5000'}/chat`, {
                accessTokenFactory: () => store.userStore.user?.token!
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        this.hubConnection.on('LoadConversation', (messages: PrivateChatMessage[]) => {
            runInAction(() => {
                this.messages = messages;
                this.loading = false;
            });
        });

        this.hubConnection.on('ReceivePrivateMessage', (message: PrivateChatMessage) => {
            runInAction(() => {
                this.messages = [...this.messages, message];
                if (message.senderUserName !== store.userStore.user?.userName) {
                    this.unreadCount += 1;
                    const senderUserName = message.senderUserName;
                    this.unreadByUser.set(senderUserName, (this.unreadByUser.get(senderUserName) || 0) + 1);
                    store.messageStore.updateConversation(senderUserName, message.content, message.createdAt);
                }
            });
        });

        this.connectionPromise = this.hubConnection.start()
            .then(() => {
                console.log('Connection started successfully');
                this.hubConnection?.invoke('LoadConversation', otherUserName).catch(console.error);
            })
            .catch((error: any) => {
                console.log('Error establishing the connection: ', error);
                runInAction(() => {
                    this.loading = false;
                    this.messages = [];
                });
                this.connectionPromise = null;
            });
    };

    stopHubConnection = () => {
        this.hubConnection?.off('LoadConversation');
        this.hubConnection?.off('ReceivePrivateMessage');
        this.hubConnection?.stop().catch(error => console.log('Error stopping connection: ', error));
        this.hubConnection = null;
        this.connectionPromise = null;
    };

    clearMessages = () => {
        this.messages = [];
        this.unreadCount = 0;
        this.stopHubConnection();
    };

    markMessagesRead = () => {
        this.unreadCount = 0;
    };

    markUserMessagesRead = (userName: string) => {
        const unread = this.unreadByUser.get(userName) || 0;
        this.unreadCount = Math.max(0, this.unreadCount - unread);
        this.unreadByUser.delete(userName);
    };

    initializeGlobalNotificationListener = () => {
        if (this.globalHubConnection?.state === HubConnectionState.Connected) {
            return;
        }

        if (!store.userStore.user?.token) {
            return;
        }

        this.globalHubConnection = new HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_CHAT_URL || 'http://localhost:5000'}/chat`, {
                accessTokenFactory: () => store.userStore.user?.token!
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        this.globalHubConnection.on('ReceivePrivateMessage', (message: PrivateChatMessage) => {
            runInAction(() => {
                if (message.senderUserName !== store.userStore.user?.userName) {
                    this.unreadCount += 1;
                    const senderUserName = message.senderUserName;
                    this.unreadByUser.set(senderUserName, (this.unreadByUser.get(senderUserName) || 0) + 1);
                    store.messageStore.updateConversation(senderUserName, message.content, message.createdAt);
                }
            });
        });

        this.globalHubConnection.start().catch((error: any) => {
            console.log('Error establishing global notification connection: ', error);
        });
    };

    sendMessage = async (recipientUserName: string, content: string) => {
        if (!this.hubConnection) {
            return;
        }

        if (this.hubConnection.state !== HubConnectionState.Connected) {
            if (!this.connectionPromise) {
                this.createHubConnection(recipientUserName);
            }

            await this.connectionPromise;
        }

        await this.hubConnection.invoke('SendPrivateMessage', recipientUserName, content);
    };
}
