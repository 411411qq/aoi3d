module aoi
{
    export class EffectItem extends Mesh
    {
        protected _showTime:number;
        protected _playSpeed:number = 1;
        protected _data:EffectData;
        constructor()
        {
            super(null,null,false);
        }
        public get data():EffectData
        {
            return this._data;
        }
        public set data(value:EffectData)
        {
            this.initData(value);

            this.x = value.posX;
            this.y = value.posY;
            this.z = value.posZ;

            this.rotationX = value.rotX;
            this.rotationY = value.rotY;
            this.rotationZ = value.rotZ;

            this.scaleX = value.scaX;
            this.scaleY = value.scaY;
            this.scaleZ = value.scaZ;
        }
        protected initData(value:EffectData)
        {
            this._data = value;
        }
        public play(resetTime:boolean = false):void
        {
            if(resetTime)this.animatorData.setAction(this.animatorData.action, true);
            this.animatorData.play();
        }
        public checkBehavior():void
        {
            var pt:number = GlobelConst.nowTime - this._showTime;
            for(var i:number = 0; i<this._data.behaviorVec.length; i++)
            {
                this._data.behaviorVec[i].update(this, pt);
            }
        }
        public stop():void
        {
            this.animatorData.stop();
        }

        public set playSpeed(value:number)
        {
            this._playSpeed = value;
        }

        public set showTime(value:number)
        {
            this._showTime = value;
        }
    }
    export class EffectGeoItem extends EffectItem
    {
        constructor()
        {
            super();
            this.addPlugin(new PlunginSimple());
        }
        public initData(value:EffectData):void
        {
            super.initData(value);
            this.geometry = value.finalGeo;
            this.material = value.finalMat;
            this.setPositionValues(value.posX, value.posY, value.posZ);
            this.setScale(value.scaX, value.scaY, value.scaZ);
            this.rotationX = value.rotX;
            this.rotationY = value.rotY;
            this.rotationZ = value.rotZ;
        }
    }
}