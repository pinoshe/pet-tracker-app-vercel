export enum locationSourceType {
    SYSTEM = 'SYSTEM',
    MANUAL = "MANUAL"
};

export interface PointProperties {
    type: locationSourceType;
    time: number;  // timestamp
}

export type PathFeature = GeoJSON.Feature<GeoJSON.Point, PointProperties>;

export interface PathState {
    points: GeoJSON.FeatureCollection<GeoJSON.Point, PointProperties>;
    line: GeoJSON.Feature<GeoJSON.LineString>;
    lastpoint?: PathFeature;

    addPoint: (feature: PathFeature) => void;
    reset: () => void;
};

export interface MapState {
    map?: maplibregl.Map;
    setMap: (map: maplibregl.Map) => void;
};