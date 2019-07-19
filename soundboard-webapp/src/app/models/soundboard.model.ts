import { Sound } from "./sound.model";

export class Soundboard
{
    constructor 
    (
        public name :       String,
        public image :      File,
        public soundFiles : Sound[],
        public id :         String,
        public creatorId :  String,
        public creatorUsername : String, 
        public createdAt :  String
    ){}
}