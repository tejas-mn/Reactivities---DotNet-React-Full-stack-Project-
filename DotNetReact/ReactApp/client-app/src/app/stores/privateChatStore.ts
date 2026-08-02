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
    hubConnection: HubConnection | null = null;
    private connectionPromise: Promise<void> | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (otherUserName: string) => {
        if (!store.userStore.user?.token) {
            return;
        }

        if (this.hubConnection?.state === HubConnectionState.Connected) {
            this.hubConnection?.invoke('LoadConversation', otherUserName).catch(console.error);
            return;
        }

        this.stopHubConnection();

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
            });
        });

        this.hubConnection.on('ReceivePrivateMessage', (message: PrivateChatMessage) => {
            runInAction(() => {
                this.messages = [...this.messages, message];
            });
        });

        this.connectionPromise = this.hubConnection.start()
            .then(() => {
                this.hubConnection?.invoke('LoadConversation', otherUserName).catch(console.error);
            })
            .catch((error: any) => {
                console.log('Error establishing the connection: ', error);
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
        this.stopHubConnection();
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
