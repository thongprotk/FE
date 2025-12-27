import { useEffect } from 'react';
import { io } from 'socket.io-client';

type ResourceAiPayload = {
    resourceId: string;
    aiSummary?: string | null;
    aiStatus?: string | null;
    isProcessing?: boolean;
};

export default function useResourceSocket(onMessage: (payload: ResourceAiPayload) => void) {
    useEffect(() => {
        const origin = window.location.origin;
        const socket = io(origin, { path: '/ws' });

        socket.on('connect', () => {
            // console.log('socket connected', socket.id);
        });
        socket.on('resource.ai.updated', onMessage);

        return () => {
            socket.off('resource.ai.updated', onMessage);
            socket.disconnect();
        };
    }, [onMessage]);
}
