import { IMyRegister } from "@/api/types";

export interface MyRegisters{
    setMyRegisters: (value: Array<any>) => void;
    myRegisters?:IMyRegister[];
}

const myRegistersStore = (): MyRegisters => {
    return {
        myRegisters: [],
        setMyRegisters: function (value) {
            this.myRegisters = value;
        },
    };
};

export default myRegistersStore;