module aoi
{
    import ByteArray = base.ByteArray;
    export class EffectBehaviorData
    {
        public type:number;
        public startTime:number = 0;
        constructor()
        {

        }
        public update(item:EffectItem, pt:number):void
        {
            if(pt >= this.startTime)
            {
                var dt:number = pt - this.startTime;
                this._update(item, pt);
            }
        }
        protected _update(item:EffectItem, pt:number):void
        {

        }
        public writeToBiteArray(by:ByteArray):void
        {
            by.writeByte(this.type);
            by.writeInt(this.startTime);
        }
        public readFromBiteArray(by:ByteArray, version:number = 1):void
        {

        }
    }
}