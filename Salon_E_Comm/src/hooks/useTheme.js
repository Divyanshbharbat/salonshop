import { useState, useEffect } from 'react';

const useTheme = () => {
    // Placeholder hook logic
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Logic to check system preference or local storage could go here
        console.log('useTheme hook initialized');
    }, []);

    return { isDark, setIsDark };
};

export default useTheme;
