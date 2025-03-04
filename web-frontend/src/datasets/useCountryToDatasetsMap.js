import { useEffect, useState } from "react";
import { getCountryToDatasetsMap } from "./getEntityDatasets";

export const useCountryToDatasetsMap = () => {
    const [map, setMap] = useState(null);
    useEffect(() => {
        (async () => {
            const countryToDatasetsMap = await getCountryToDatasetsMap();
            setMap(countryToDatasetsMap);
        })();
    }, []);
    return map;
};
