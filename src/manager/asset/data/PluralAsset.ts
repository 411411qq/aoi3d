module aoi 
{
    export class PluralAsset 
    {
        private _paths:Array<string>;
        private _type:number = 0;
        private _priority:number = 0;
        private _key:string;
        constructor(paths:Array<string>, type:number, priority:number) {
            this._paths = paths;
            this._type = type;
            this._priority = priority;
        }
        public static genKey(paths:Array<string>):string
        {
            let str:string = "";
            for(let i:number = 0; i < paths.length; i++)
            {
                str += paths[i];
            }
            return base.MD5.hex_md5(str);
        }
    }
}