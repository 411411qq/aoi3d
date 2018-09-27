module base
{
    export class ObjectPoolManager
    {
        static instance = new ObjectPoolManager();

        private objPoolDic:Object;
        private maxPoolLength:number;
        constructor()
        {
            this.objPoolDic = {};
            this.maxPoolLength = 100;
        }

        public returnToPool(value:any, id:string = "default"):void
        {
            var tconst = value["constructor"];
            if (this.objPoolDic[tconst] == null)
            {
                this.objPoolDic[tconst] = {};
            }
            if (this.objPoolDic[tconst][id] == null)
            {
                this.objPoolDic[tconst][id] = [];
            }
            if (this.objPoolDic[tconst][id].indexOf(value) != -1)
            {
                return;
            }
            if (this.objPoolDic[tconst][id].length < this.maxPoolLength)
            {
                this.objPoolDic[tconst][id].push(value);
            }
        }

        public create(constructor:any, id:string = "default"):any
        {
            var tlen:number = arguments.length;
            if(this.objPoolDic[constructor] != null)
            {
                var tarr:any = this.objPoolDic[constructor][id];
                if (tarr != null && tarr.length > 0)
                {
                    return tarr.pop();
                }
            }
            return this.createObject(arguments);
        }

        private createObject(args:IArguments):any
        {
            var tlen:number = (args == null) ? 0 : args.length;
            var constructor = args[0];
            switch(tlen){
                case 2:
                    return new constructor();

                case 3:
                    return new constructor(args[2]);

                case 4:
                    return new constructor(args[2], args[3]);

                case 5:
                    return new constructor(args[2], args[3], args[4]);

                case 6:
                    return new constructor(args[2], args[3], args[4], args[5]);

                case 7:
                    return new constructor(args[2], args[3], args[4], args[5], args[6]);

                case 8:
                    return new constructor(args[2], args[3], args[4], args[5], args[6], args[7]);

                case 9:
                    return new constructor(args[2], args[3], args[4], args[5], args[6], args[7], args[8]);

                case 10:
                    return new constructor(args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9]);

                case 11:
                    return new constructor(args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10]);

                case 12:
                    return new constructor(args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11]);
            }

            return null;
        }
    }
}