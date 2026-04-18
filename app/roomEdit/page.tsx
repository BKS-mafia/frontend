"use client";

import LobbySettings from "@/src/widget/LobbySettings";

const Page = () => {
    return (
        <div>
            <LobbySettings onStart={(settings) => console.log(settings)}/>
        </div>
    );
};

export default Page;