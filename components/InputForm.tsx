import React from 'react';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const InputForm = ({handleChange, value, onSubmit,label,buttonLabel}: {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    value: string,
    label: string,
    buttonLabel: string,
    onSubmit: () => void
}) => {
    return (
        <div className={'h-screen flex items-center justify-center flex-col'}>
            <div className={'flex flex-col max-w-[300px] w-full justify-center items-center gap-3'}>
                <h3 className={'text-2xl text-primary-grey-300'}>{label}</h3>
                <Input
                    value={value}
                    onChange={handleChange}
                />
                <Button
                    className={'text-primary-green border-2 border-primary-green hover:bg-primary-green hover:text-primary-black w-full'}
                    onClick={onSubmit}
                >
                    {buttonLabel}
                </Button>
            </div>

        </div>
    );
};

export default InputForm;
