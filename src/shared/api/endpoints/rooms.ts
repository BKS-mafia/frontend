import { axiosInstance } from '../axiosInstance';
import { CreateRoomRequest, CreateRoomResponse, RoleSettings } from '../types/room';

// Вспомогательная функция для преобразования массива ролей в объект
const rolesArrayToObject = (roles: RoleSettings[]): Record<string, RoleSettings> => {
    const obj: Record<string, RoleSettings> = {};
    roles.forEach((role, index) => {
        obj[index.toString()] = role;
    });
    return obj;
};

export const createRoom = async (
    host_token: string,
    totalPlayers: number,
    peopleCount: number,
    aiCount: number,
    rolesArray: RoleSettings[]
): Promise<CreateRoomResponse> => {
    const requestData: CreateRoomRequest = {
        host_token,
        totalPlayers,
        peopleCount,
        aiCount,
        roles: rolesArrayToObject(rolesArray),
        settings: {}, // пустой объект, если нужно
    };
    const response = await axiosInstance.post<CreateRoomResponse>('/api/rooms/', requestData);
    return response.data;
};