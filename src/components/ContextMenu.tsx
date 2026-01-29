import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import useMapStore from '../stores/mapStore';
import { postManualDetection } from '../services/api';
import { usePathState } from '../stores/pathStore';
import { PathFeature, locationSourceType } from '../types';

export default function ContextMenu() {

    const map = useMapStore(s => s.map);
    const addPoint = usePathState(s => s.addPoint);

    const addManualPoint = (lng: number, lat: number) => {
        console.debug('addManualPoint')
        addPoint({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [lng, lat] },
            properties: {
                time: new Date().getTime(),
                type: locationSourceType.MANUAL
            }
        } as PathFeature);
        postManualDetection(lng.toFixed(3), lat.toFixed(3));
    }

    useEffect(() => {
        if (!map) return;

        const addPointPopup = new maplibregl.Popup({
            closeButton: true,
            closeOnClick: false,
            closeOnMove: true,
        });

        const handleContextMenu = (e: maplibregl.MapMouseEvent) => {
            console.debug('handleContextMenu: ', e.lngLat.toString())

            addPointPopup.setLngLat(e.lngLat)
                .setHTML(`<button id="add-manual-point-btn">Add point here</button>`)
                .addTo(map);

            setTimeout(() => {
                const btn = document.getElementById("add-manual-point-btn");
                if (btn) {
                    btn.onclick = () => {
                        const { lng, lat } = addPointPopup.getLngLat();
                        addManualPoint(lng, lat);
                        addPointPopup.remove();
                    };
                }
            }, 0);
        };
        map.on('contextmenu', handleContextMenu);

        return () => {
            map.off('contextmenu', handleContextMenu);
            addPointPopup.remove();
        };
    }, [map, addManualPoint]);

    return null;
}


