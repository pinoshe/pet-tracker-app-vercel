import { locationSourceType } from "../types";

const BACKEND_URL = 'https://rokak-development-task-backend.onrender.com';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const API_KEY = '6YjnvjAkNS';

const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

function buildUrl(path: string): string {
    const fullUrl = `${BACKEND_URL}${path}?key=${API_KEY}`;
    return isLocalhost ? fullUrl : CORS_PROXY + encodeURIComponent(fullUrl);
}

export function createSSEConnection(
    onCoordinate: (data: { id: string; type: locationSourceType; lng: number; lat: number }) => void,
    onError?: (error: Event) => void
): EventSource {
    console.debug(`createSSEConnection!!!`)
    const es = new EventSource(buildUrl('/connect-sse'));
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
    const res = await fetch(buildUrl('/manual-detection'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    });

    if (!res.ok) throw new Error('Failed to post location');
}
