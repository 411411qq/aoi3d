module aoi
{
    import EventBase = base.EventBase;
    export class EffectGroup extends Object3DContainer
    {
    	private _effects:Array<EffectItem>;
        private _data:EffectGroupData;
        private _isPlaying:boolean;
        private _startTime:number;
        private _stopSetTime:number;
        private _stopLastTime:number;
        private _pastTime:number;
        private _playSpeed:number;
        constructor()
        {
            super(false);
            this._effects = [];
        }
        public set data(value:EffectGroupData)
        {
            this._data = value;
        	this.clearEffectList();
            var i:number = 0, item:EffectItem;
            for(i = 0; i<value.datas.length; i++)
            {
                if(value.datas[i].type == EffectGroupDefine.EFFECT_TYPE_GEO)
                {
                    item = new EffectGeoItem();
                    item.data = value.datas[i];
                }
                this._effects.push(item);
            }
        }
        public get data():EffectGroupData
        {
            return this._data;
        }
        private clearEffectList():void
        {
        	while(this._effects.length > 0)
        	{
        		this._effects[0].dispose();
        		this._effects.shift();
        	}
        }
        public createRenderList(context:WebGLRenderingContext, camera:ICamera, renderType:number, renderList:RenderList, checkInFrustum:boolean = true):void {
            this.checkEleShowState();
            super.createRenderList(context, camera, renderType, renderList, checkInFrustum);
        }
        public startPlay():void
        {
            this._isPlaying = true;
            this._startTime = GlobelConst.nowTime;
            this._stopSetTime = -1;
            this._stopLastTime = 0;
            for(var i:number = 0; i<this._effects.length; i ++)
            {
                if(this._effects[i].parent != null)
                {
                    this.removeChild(this._effects[i]);
                }
            }
            this.checkEleShowState();
            this.dispatchEvent(new EventBase(EventBase.ACTION_START));
        }
        private checkEleShowState():void
        {
            if(this._data == null)
            {
                return;
            }
            var pastTime:number, i:number;
            if(this._isPlaying == false)
            {
                this._pastTime =  this._stopSetTime - this._startTime - this._stopLastTime;
            }
            else
            {
                this._pastTime = GlobelConst.nowTime - this._startTime - this._stopLastTime;
            }
            this._pastTime = this._pastTime * this._playSpeed;
            for(i = 0; i<this._effects.length; i ++)
            {
                var child:EffectItem = this._effects[i];
                if(child != null)
                {
                    if((child.data.showTime == -1 || child.data.showTime <= this._pastTime)
                        && (child.data.liveTime == -1 || child.data.hideTime >= this._pastTime))
                    {
                        if(child.parent == null)
                        {
                            child.showTime = GlobelConst.nowTime;
                            this.addChild(child);
                        }
                        child.checkBehavior();
                    }
                    else
                    {
                        if(child.parent != null)
                        {
                            this.removeChild(child);
                        }
                    }
                }
            }
            if(this._data.cycleTime != -1 && pastTime > this._data.cycleTime)
            {
                this.dispatchEvent(new EventBase(EventBase.ACTION_END));
            }
        }
        public dispose():void
        {
        	this.clearEffectList();
        }
    }
}