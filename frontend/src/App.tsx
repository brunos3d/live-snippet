import React, { useEffect, useState } from "react";
import { ControlledEditor } from "@monaco-editor/react";
import AwesomeDebouncePromise from "awesome-debounce-promise";

import socket from "./services/socket";

async function emitEditCode(code: string) {
    console.log("Atualizando sharedCode");
    await socket.emit("edit-code", code);
}

const emitEditCodeDebounced = AwesomeDebouncePromise(emitEditCode, 750);

function App() {
    const [code, setCode] = useState("");

    useEffect(() => {
        function login(loginData: { userId: string; sharedCode: string }) {
            const { userId, sharedCode } = loginData;
            setCode(sharedCode);
        }

        function newUser(userId: string) {
            console.log("new-user", userId);
        }

        function editCode(code: string) {
            setCode(code);
            console.log("edit-code", code);
        }

        socket.on("login", login);
        socket.on("new-user", newUser);
        socket.on("edit-code", editCode);

        return () => {
            socket.off("login", login);
            socket.off("new-user", newUser);
            socket.off("edit-code", editCode);
        };
    }, []);

    async function onChangeCode(event: any, value: any) {
        setCode(value as string);
        socket.emit("edit-code", code);
        // await emitEditCodeDebounced(value as string);
    }

    return (
        <div className="App">
            <ControlledEditor
                width="calc(100% - 8px)"
                height="calc(100% - 8px)"
                language="javascript"
                theme="dark"
                value={code}
                onChange={(event, value) => {
                    onChangeCode(event, value);
                }}
            />
        </div>
    );
}

export default App;
