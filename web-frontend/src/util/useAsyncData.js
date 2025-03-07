import { useEffect, useState } from "react";

export const useAsyncData = (getDataFn) => {
    const [data, setData] = useState(null);
    useEffect(() => {
        (async () => {
            const newData = await getDataFn();
            setData(newData);
        })();
    }, [getDataFn]);
    return data;
};
