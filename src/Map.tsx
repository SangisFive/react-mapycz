import React, { createContext, useEffect, useRef, useState } from 'react';
import BaseLayers from './BaseLayers';
import SMapProvider from './SMapProvider';

export const MapContext = createContext(null);

interface MapProps {
    center: { lat: number; lng: number };
    onClick?: (lat: number, lng: number) => void;
    width?: string;
    height?: string;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    baseLayers?: number[];
    children?: React.ReactNode;
}

const Map = (props: MapProps) => {
    const mapNode = useRef(null);
    const [map, setMap] = useState(null);
    const { width, height, children } = props;

    useEffect(() => {
        if (!map && mapNode) {
            const { zoom, center } = props;
            const centerCoords = window.SMap.Coords.fromWGS84(
                center.lng,
                center.lat
            );
            const sMap = new window.SMap(mapNode.current, centerCoords, zoom);

            sMap.getSignals().addListener(window, 'map-click', (e: any) => {
                onMapClickListener(e, sMap);
            });

            const l = sMap.addDefaultLayer(BaseLayers.TURIST_NEW);
            l.enable();
            setMap(sMap);
        }
    }, []);

    const onMapClickListener = (e: any, map: any) => {
        const coords: {
            x: number;
            y: number;
        } = window.SMap.Coords.fromEvent(e.data.event, map);
        if (props.onClick != null) {
            props.onClick(coords.x, coords.y);
        }
    };

    return (
        <MapContext.Provider value={map}>
            <div style={{ width, height }} ref={mapNode}>
                {map && children}
            </div>
        </MapContext.Provider>
    );
};

Map.defaultProps = {
    width: '100%',
    height: '300px',
    zoom: 13,
    minZoom: 1,
    maxZoom: 21,
    baseLayers: [BaseLayers.TURIST_NEW],
};

export default SMapProvider(Map);
