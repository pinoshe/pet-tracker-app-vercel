import { useEffect } from 'react';
import { usePathState } from '../stores/pathStore';
import { createSSEConnection } from '../services/api';
import { /*locationSourceType,*/ PathFeature } from '../types';

export function useSSE() {

    const addPoint = usePathState(s => s.addPoint);
    useEffect(() => {
        console.debug(`useEffect....`)
        const es = createSSEConnection(
            ({ id, type, lng, lat }) => {
                console.debug(`adding new point to store: id - ${id || 'NO ID'}, type: ${type}`);
                //if (type === locationSourceType.MANUAL) return // id?;
                addPoint({
                    id,
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [lng, lat] },
                    properties: {
                        time: new Date().getTime(),
                        type
                    }
                } as PathFeature);
            },
            (err) => console.error('SSE error:', err)
        );

        return () => es.close();
    }, [addPoint]);
}