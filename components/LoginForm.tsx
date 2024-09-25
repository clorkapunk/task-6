import React, {useState} from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Liveblocks} from "@liveblocks/node";
import {useUserStore} from "@/stores/user-store";
import {toast} from "react-hot-toast";

const LoginForm = () => {
    const [name, setName] = useState('')
    const login = useUserStore((store) => store.login)
    const setUsername = useUserStore((store) => store.setUsername)





    return (
        <div className={'h-screen flex items-center justify-center flex-col'}>
            <div className={'flex flex-col max-w-[300px] w-full justify-center items-center gap-3'}>
                <h3 className={'text-2xl text-primary-grey-300'}>Write your username</h3>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button
                    className={'text-primary-green border-2 border-primary-green hover:bg-primary-green hover:text-primary-black w-full'}
                    onClick={() => {
                        setUsername(name)
                    }}
                >
                    Continue
                </Button>
            </div>

        </div>
    );
};

export default LoginForm;
