import { useEffect } from 'react';
import { io } from 'socket.io-client';

type ResourceAiPayload = {
    resourceId: string;
    aiSummary?: string | null;
    aiStatus?: string | null;
    isProcessing?: boolean;
    error?: string;
};

export default function useResourceSocket(onMessage: (payload: ResourceAiPayload) => void) {
    useEffect(() => {
        const origin = window.location.origin;
        const socket = io(origin, {
            path: '/ws',
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: 5,
        });

        socket.on('connect', () => {
            console.log('[Socket] Connected:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('[Socket] Disconnected');
        });

        socket.on('resource.ai.updated', (payload: ResourceAiPayload) => {
            console.log('[Socket] Received resource.ai.updated:', payload);
            onMessage(payload);
        });

        socket.on('connect_error', (error: any) => {
            console.error('[Socket] Connection error:', error);
        });

        return () => {
            socket.off('resource.ai.updated', onMessage);
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
            socket.disconnect();
        };
    }, [onMessage]);
}
