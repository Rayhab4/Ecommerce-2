import {Document,Schema,model} from "mongoose";
export interface IContact extends Document{
    name:String;
    email:String;
    phone:String;
    message:String;
}
const contactSchema=new Schema<IContact>({
    name: {type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String,required:true},
    message:{type:String,required:true},
},
{
    timestamps: true,
}
);
export  default model<IContact>('Contact', contactSchema);