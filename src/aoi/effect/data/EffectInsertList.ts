module aoi
{
    import ByteArray = base.ByteArray;
    export class EffectInsertList
    {
        public circle:number;
        private _totalTime:number = -1;
        public insertList:Array<EffectBehaviorInsertData>;

        public startX:number = 0;
        public startY:number = 0;
        public startZ:number = 0;
        public startW:number = 0;

        constructor()
        {
            this.insertList = [];
        }
        public get totalTime():number
        {
            if(this._totalTime == -1)
            {
                this._totalTime = 0;
                for(var i:number = 0; i<this.insertList.length; i++)
                {
                    this._totalTime += this.insertList[i].lastTime;
                }
            }
            return this._totalTime;
        }
        protected getCurTime(time:number):number
        {
            if(this.circle == 1)
            {
                time = time % this.totalTime;
            }
            return time;
        }
        public getCurState(pt:number):Object
        {
            var dpt = this.getCurTime(pt);
            var rs:Object = {};
            if(dpt >= this.totalTime)
            {
                var l:number = this.insertList.length - 1;
                rs["x"] = this.insertList[l].valueX;
                rs["y"] = this.insertList[l].valueY;
                rs["z"] = this.insertList[l].valueZ;
                rs["w"] = this.insertList[l].valueW;
            }
            else
            {
                var c:number = 0,lx = this.startX, ly = this.startY, lz = this.startZ, lw = this.startW;
                for(var i:number = 0; i<this.insertList.length; i++)
                {
                    if(dpt < c + this.insertList[i].lastTime)
                    {
                        var p:number = (dpt - c) / this.insertList[i].lastTime;
                        rs["x"] = lx + (this.insertList[i].valueX - lx) * p;
                        rs["y"] = ly + (this.insertList[i].valueY - ly) * p;
                        rs["z"] = lz + (this.insertList[i].valueZ - lz) * p;
                        rs["w"] = lw + (this.insertList[i].valueW - lw) * p;
                        break;
                    }
                    else
                    {
                        lx = this.insertList[i].valueX;
                        ly = this.insertList[i].valueY;
                        lz = this.insertList[i].valueZ;
                        lw = this.insertList[i].valueW;
						c += this.insertList[i].lastTime;
                    }
                }
            }
            return rs;
        }
        public writeToBiteArray(by:ByteArray):void
        {

        }
        public readFromBiteArray(by:ByteArray, version:number = 1):void
        {

        }
    }
    export class EffectBehaviorInsertData
    {
        public lastTime:number = 0;

        public valueX:number = 0;
        public valueY:number = 0;
        public valueZ:number = 0;
        public valueW:number = 0;
        public writeToBiteArray(by:ByteArray):void
        {
            by.writeInt(this.lastTime);
            by.writeFloat32(this.valueX);
            by.writeFloat32(this.valueY);
            by.writeFloat32(this.valueZ);
            by.writeFloat32(this.valueW);
        }
        public readFromBiteArray(by:ByteArray, version:number = 1):void
        {
            this.lastTime = by.readInt();
            this.valueX = by.readFloat32();
            this.valueY = by.readFloat32();
            this.valueZ = by.readFloat32();
            this.valueW = by.readFloat32();
        }
    }
}