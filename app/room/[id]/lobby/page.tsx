"use client";

import React, { useState, useEffect } from 'react';

import './Lobby.css'; // добавим стили для анимации
import Lobby from "@/src/widget/Lobby"

interface Player {
    id: string;
    name: string;
    avatar?: string | null;
}

// Типы (можно вынести в отдельный файл)
interface Player {
    id: string;
    name: string;
    avatar?: string | null;
}



//====== замокано =======
const mockInitialPlayers: Player[] = [
    { id: '1', name: 'Алексей', avatar: null },
    { id: '2', name: 'Мария', avatar: null },
];

const MAX_PLAYERS = 111;
//===========================


export default function LobbyPage() {
    
    const [players, setPlayers] = useState<Player[]>(mockInitialPlayers);

    // Имитация постепенного подключения игроков
    useEffect(() => {
        const interval = setInterval(() => {
            setPlayers((prev) => {
                if (prev.length < MAX_PLAYERS) {
                    const newId = `player-${Date.now()}`;
                    const newPlayer: Player = {
                        id: newId,
                        name: `Игрок ${prev.length + 1}`,
                        avatar: null,
                    };
                    return [...prev, newPlayer];
                }
                clearInterval(interval);
                return prev;
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return <Lobby maxPlayers={MAX_PLAYERS} players={players} />;
}