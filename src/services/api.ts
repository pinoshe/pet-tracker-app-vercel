import { locationSourceType } from "../types";

const BACKEND_URL = 'https://rokak-development-task-backend.onrender.com';
const CORS_PROXY = 'https://corsproxy.io/?';
const API_BASE = CORS_PROXY + encodeURIComponent(BACKEND_URL);
const API_KEY = '6YjnvjAkNS';

export function createSSEConnection(
    onCoordinate: (data: { id: string; type: locationSourceType; lng: number; lat: number }) => void,
    onError?: (error: Event) => void
): EventSource {
    console.debug(`createSSEConnection!!!`)
    const es = new EventSource(`${API_BASE}/connect-sse?key=${API_KEY}`);
    es.addEventListener('coordinate', (sseEv) => {
        console.debug(`coordinate event data: ${sseEv.data}`)
        onCoordinate(JSON.parse(sseEv.data));
    });
    if (onError) es.onerror = (error) => onError(error);
    return es;
}

export async function postManualDetection(lng: string, lat: string): Promise<void> {
    console.debug(`postManualDetection: ${lng}, ${lat}`)

    const body = JSON.stringify({ lng, lat });
    const res = await fetch(`${API_BASE}/manual-detection?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    });

    if (!res.ok) throw new Error('Failed to post location');
}
