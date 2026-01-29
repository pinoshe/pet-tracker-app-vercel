import { create } from 'zustand';
import { MapState } from '../types';

const useMapStore = create<MapState>((set) => ({
    setMap: (map: maplibregl.Map) => set(({ map: map })),
}));
export default useMapStore