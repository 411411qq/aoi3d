module aoi
{
    import ByteArray = base.ByteArray;
    export class EffectGroupData
    {
        static EFFECT_VERSION:number = 1;
        public cycleTime:number = 10000;
        public boundRadius:number = 100;
        public datas:Array<EffectData>;
        constructor()
        {
            this.datas = [];
        }
        public addEffect(value:EffectData):void
        {
            value.pData = this;
            this.datas.push(value);
        }

        public delEffect(eId:number):void
        {
            for(var i:number = 0; i<this.datas.length; i++)
            {
                if(this.datas[i].eId == eId)
                {
                    this.datas.splice(i, 1);
                    return;
                }
            }
        }

        public dispose():void
        {
            while(this.datas.length != 0)
            {
                var eData:EffectData = this.datas.shift() as EffectData;
                eData.dispose();
            }
        }
        public writeToBiteArray(by:ByteArray):void
        {
            by.writeByte(EffectGroupData.EFFECT_VERSION);
            by.writeInt(this.cycleTime);
            by.writeInt(this.boundRadius);
            var len:number = this.datas.length, i:number;
            by.writeByte(len);
            if(len > 0)
            {
                for(i = 0; i<len; i++)
                {
                    var eData:EffectData = this.datas[i];
                    by.writeByte(eData.type);
                    eData.writeToBiteArray(by);
                }
            }
        }
    }
}