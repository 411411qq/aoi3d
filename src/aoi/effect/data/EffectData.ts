module aoi
{
    import ByteArray = base.ByteArray;
    export class EffectGroupDefine
    {
        static EFFECT_TYPE_GEO:number = 0;
        static EFFECT_TYPE_PAR:number = 1;
        static EFFECT_TYPE_MOV:number = 2;
        static EFFECT_TYPE_OBJ:number = 3;
        static EFFECT_TYPE_MD5:number = 4;
        static EFFECT_TYPE_GROUP:number = 5;

        static GEO_TYPE_CUBE:number = 1;
        static GEO_TYPE_SPHERE:number = 2;
        static GEO_TYPE_PLANE:number = 3;
    }
    export class EffectData implements IDispose
    {
        public eId:number;
        public name:string;
        /** 0几何体, 1粒子, 2序列帧*/
        public type:number;
        public num:number;

        public posX:number = 0;
        public posY:number = 0;
        public posZ:number = 0;

        public rotX:number = 0;
        public rotY:number = 0;
        public rotZ:number = 0;

        public scaX:number = 1;
        public scaY:number = 1;
        public scaZ:number = 1;

        public hasAlpha:number = 0;
        public showTime:number = -1;
        public liveTime:number = -1;

        public blendMode:number = PlunginDefine.NORMAL;
        public allFace:number = 0;

        public bothSide:number = 0;
        public addDepth:number = 0;

        public material:string;

        public behaviorVec:Array<EffectBehaviorData> = [];
        private behaviorDic:Object = {};

        public pData:EffectGroupData;

        public initData():void
        {

        }
        public get hideTime():number
        {
            if(this.liveTime == -1)
            {
                return Number.MAX_VALUE;
            }
            return this.showTime + this.liveTime;
        }
        public writeToBiteArray(by:ByteArray):void
        {
            by.writeShort(this.eId);
            by.writeString(this.name);
            by.writeShort(this.num);

            by.writeString(this.material);

            by.writeFloat32(this.posX);
            by.writeFloat32(this.posY);
            by.writeFloat32(this.posZ);

            by.writeFloat32(this.rotX);
            by.writeFloat32(this.rotY);
            by.writeFloat32(this.rotZ);

            by.writeFloat32(this.scaX);
            by.writeFloat32(this.scaY);
            by.writeFloat32(this.scaZ);

            by.writeByte(this.hasAlpha);
            by.writeInt(this.showTime);
            by.writeInt(this.liveTime);

            by.writeByte(this.blendMode);
            by.writeByte(this.allFace);
            by.writeByte(this.bothSide);
            by.writeShort(this.addDepth);
        }
        public readFromBiteArray(by:ByteArray, version:number = 1):void
        {

        }
        public get finalMat():IMaterial
        {
            return DefaultMaterialManager.instance.getDefaultTexture();
        }
        public get finalGeo():Geometry
        {
            return null;
        }
        public addBehavior(value:EffectBehaviorData):void
        {
            var index:number = this.hasBehavior(value.type);
            if(index == -1)
            {
                if(this.behaviorVec == null)
                {
                    this.behaviorVec = [];
                }
                this.behaviorVec.push(value);
                this.behaviorDic[value.type] = this.behaviorVec.length - 1;
            }
            else
            {
                this.behaviorVec[index] = value;
            }
        }

        public removeBehavior(value:number):void
        {
            var index:number = this.hasBehavior(value);
            if(index != -1)
            {
                this.behaviorVec.splice(index, 1);
                this.behaviorDic = {};
            }
        }

        public hasBehavior(type:number):number
        {
            if(this.behaviorDic[type] == null)
            {
                this.behaviorDic[type] = this._hasBehavior(type);
            }
            return this.behaviorDic[type];
        }

        private _hasBehavior(type:number):number
        {
            if(this.behaviorVec == null)
            {
                return -1;
            }
            for(var i:number = 0; i<this.behaviorVec.length; i++)
            {
                if(this.behaviorVec[i].type == type)
                {
                    return i;
                }
            }
            return -1;
        }
        public dispose():void
        {

        }
    }
    export class EffectGeoData extends EffectData
    {
        /** 1长方体， 2球，3平面*/
        public geoType:number;
        //平面
        public axis:string = "+xy";
        // 长方体
        public w:number=0;
        public h:number=0;
        public d:number=0;

        // 球体
        public r:number = 0;
        public slices:number;
        public stacks:number;

        private _fGeo:Geometry;
        public initData():void
        {
            if(this._fGeo == null)
            {
                if(this.geoType == EffectGroupDefine.GEO_TYPE_CUBE)
                {
                    this._fGeo = new CubeGeometry(this.w, this.h, this.d);
                }
                else if(this.geoType == EffectGroupDefine.GEO_TYPE_SPHERE)
                {
                    this._fGeo = new SphereGeometry(this.r, this.slices, this.stacks);
                }
                else if(this.geoType == EffectGroupDefine.GEO_TYPE_PLANE)
                {
                    this._fGeo = new PlaneGeometry(this.w, this.h,this.axis);
                }
            }
        }
        public get finalGeo():Geometry
        {
            return this._fGeo;
        }
        public writeToBiteArray(by:ByteArray):void
        {
            super.writeToBiteArray(by);
            by.writeByte(this.geoType);
            by.writeString(this.axis);

            by.writeFloat32(this.w);
            by.writeFloat32(this.h);
            by.writeFloat32(this.d);

            by.writeFloat32(this.r);
            by.writeFloat32(this.slices);
            by.writeFloat32(this.stacks);
        }
    }
}