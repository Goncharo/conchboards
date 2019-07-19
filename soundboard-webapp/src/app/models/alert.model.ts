export class Alert
{
    constructor(
        public type : String,
        public message : String,
        public duration : Number, //in ms
        public dismissable : Boolean
    ){}
}