import React, { useState } from 'react';
import { useSMap } from './hooks';

const SMapProvider = <T extends {}>(Component: React.ComponentType<T>) =>
    function (props: T) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [isLoading, setLoading] = useState(true);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useSMap(() => setLoading(false));

        if (isLoading) {
            return <div>loading...</div>;
        }

        return <Component {...props} />;
    };

export default SMapProvider;
