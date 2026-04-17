"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { ConfigProvider, theme, App } from 'antd';
import type { ThemeConfig } from 'antd';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    mode: ThemeMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [mode, setMode] = useState<ThemeMode>('light');

    // При монтировании компонента читаем тему из localStorage или системных настроек
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
        if (savedTheme) {
            setMode(savedTheme);
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setMode('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        localStorage.setItem('theme', newMode);
    };

    // Конфигурация темы Ant Design
    const antdTheme: ThemeConfig = {
        algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
            colorPrimary: '#1677ff', // Ваш основной цвет (можно изменить)
            borderRadius: 6,
        },
        components: {
            Button: {
                controlHeight: 38,
            },
        },
    };

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <ConfigProvider theme={antdTheme}>
                <App>{children}</App>
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};