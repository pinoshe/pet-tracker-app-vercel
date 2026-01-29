
import { useEffect } from "react";
import { usePathState } from "../stores/pathStore";
import useMapStore from "../stores/mapStore"
import { GeoJSONSource } from "maplibre-gl";

function PathLayerComponent() {

    const line = usePathState(s => s.line);
    const points = usePathState(s => s.points);
    const lastpoint = usePathState(s => s.lastpoint);
    const map = useMapStore(s => s.map);

    useEffect(() => {
        if (!(map && map.getSource('path'))) return;

        console.debug(`set data into map`);
        (map.getSource('path') as GeoJSONSource).setData(line);
        (map.getSource('points') as GeoJSONSource).setData(points);
        if (lastpoint) {
            (map.getSource('lastpoint') as GeoJSONSource).setData(lastpoint);
        }
    }, [map, line, points, lastpoint]);

    return null;
}
export default PathLayerComponent

