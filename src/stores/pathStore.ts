import { create } from 'zustand';
import { PathFeature, PathState, PointProperties } from '../types';

const isFromLast5Min = (timestamp: number) => Date.now() - timestamp < 1 * 60 * 1000;
const extractCoords = (features: GeoJSON.Feature<GeoJSON.Point>[]) =>
    features.map(f => f.geometry.coordinates);
const createEmptyLine = (): GeoJSON.Feature<GeoJSON.LineString> => ({
    type: 'Feature',
    geometry: {
        type: 'LineString',
        coordinates: [],
    },
    properties: {},
});
const createEmptyPoints = (): GeoJSON.FeatureCollection<GeoJSON.Point, PointProperties> => ({
    type: 'FeatureCollection',
    features: [],
});

export const usePathState = create<PathState>((set, get) => ({
    points: createEmptyPoints(),
    line: createEmptyLine(),
    lastpoint: undefined,

    addPoint: (feature: PathFeature) => {
        console.debug(`pathStore -> addPoint`)
        const { points, line } = get();
        const coords = feature.geometry.coordinates;
        const updatedPointsFeature = points.features.filter(f => isFromLast5Min(f.properties.time));

        set({
            lastpoint: feature,

            points: {
                ...points,
                features: [...updatedPointsFeature, feature],
            },

            line: {
                ...line,
                geometry: {
                    ...line.geometry,
                    coordinates: [...extractCoords(updatedPointsFeature), coords],
                },
            },
        });
    },

    reset: () => {
        set({
            points: createEmptyPoints(),
            line: createEmptyLine(),
            lastpoint: undefined,
        });
    },
}));
