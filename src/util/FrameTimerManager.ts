module base {
    import MsgUtil = base.MsgUtil;
    export class FrameTimerManager {
        static instance = new FrameTimerManager();
        private lastTime:number;
        private itemVec:Array<FrameTimeItem>;
        private newVec:Array<FrameTimeItem>;
        private reOrder:boolean;

        constructor() 
        {
            this.lastTime = Util.getTimer();
            this.itemVec = [];
            this.newVec = [];
            this.reOrder = true;
            var s = this;
            var tick = function () {
                s.enterFrameHandler();
                requestAnimationFrame(tick);
            };
            tick();
        }

        public add(name:string, delay:number, repeat:number, callback:Function, hasParam:boolean = false, priority:number = 10):void
        {
            var item = this.getFunctionSet(callback);
            if (item == null)
            {
                item = ObjectPoolManager.instance.create(FrameTimeItem, null);
                item.initObject(name, delay, repeat, callback, hasParam, priority);
                this.newVec.push(item);
                this.reOrder = true;
                item.canDispose = false;
            }
            else
            {
                item.name = name;
                item.repeat = repeat;
                item.hasParam = hasParam;
                item.canDispose = false;
                if (item.priority != priority)
                {
                    this.reOrder = true;
                }
                item.priority = priority;
            }
        }

        public hasFunction(callback:Function):boolean
        {
            var index:number = this.getFunctionIndex(callback);
            if (index == -1)
            {
                return false;
            }
            var item:FrameTimeItem = this.itemVec[index];
            if (item.canDispose == true)
            {
                return false;
            }
            return true;
        }

        public remove(callBack:Function):void
        {
            var i = 0, len = this.newVec.length;
            for (i = 0; i < this.newVec.length; i++)
            {
                if (this.newVec[i].callback == callBack)
                {
                    this.newVec[i].canDispose = true;
                    return;
                }
            }
            var index = this.getFunctionIndex(callBack);
            if (index == -1)
            {
                return;
            }
            var item = this.itemVec[index];
            item.canDispose = true;
        }

        public getFunctionSet(callback:Function):FrameTimeItem
        {
            var index = this.getFunctionIndex(callback);
            if (index != -1)
            {
                return this.itemVec[index];
            }
            var i = 0, len = this.newVec.length;
            for (i = 0; i < len; i++)
            {
                if (this.newVec[i].callback == callback)
                {
                    return this.newVec[i];
                }
            }
            return null;
        }

        public getFunctionIndex(callback:Function):number
        {
            var len = this.itemVec.length, i;
            for (i = 0; i < len; i++)
            {
                if (this.itemVec[i].callback == callback)
                {
                    return i;
                }
            }
            return -1;
        }

        public enterFrameHandler():void
        {
            aoi.GlobelConst.frameNum ++;
            var tnow = Util.getTimer();
            aoi.GlobelConst.nowTime = tnow;
            var td_t = tnow - this.lastTime;
            this.lastTime = tnow;
            var i = 0, e, len = this.itemVec.length;
            for (i = 0; i < len; i++)
            {
                e = this.itemVec[i];
                if (e.canDispose == true)
                {
                    continue;
                }
                if (e.exec(tnow, td_t))
                {
                    if (e.repeat > 0)
                    {
                        e.repeat--;
                        if (e.repeat < 1)
                        {
                            e.canDispose = true;
                        }
                    }
                }
            }
            for (i = 0; i < len; i++)
            {
                e = this.itemVec[i];
                if (e.canDispose == true)
                {
                    this.itemVec.splice(i, 1);
                    e.dispose();
                    ObjectPoolManager.instance.returnToPool(e);
                    i--;
                    len = this.itemVec.length;
                }
            }
            while (this.newVec.length > 0)
            {
                this.itemVec.push(this.newVec.shift());
            }
            if (this.reOrder == true)
            {
                this.reOrder = false;
                this.itemVec = this.itemVec.sort(this.onCompare);
            }
            if(this.aa < 100)
            {
                this.aa ++;
            }
            else
            {
                MsgUtil.callFunc("ON_ENTERFRAME");
            }
            
        }
        private aa:number = 0;
        private onCompare(a:FrameTimeItem, b:FrameTimeItem):number
        {
            return a.priority - b.priority;
        }
    }
    export class FrameTimeItem {
        public delay:number;
        public repeat:number;
        public callback:Function;
        public hasParam:boolean;
        public lastTime:number;
        public name:string;
        public priority:number;
        public canDispose:boolean;

        constructor() {
            this.delay = 0;
            this.repeat = 0;
            this.callback = null;
            this.hasParam = false;
            this.lastTime = null;
            this.name = null;
            this.priority = null;
            this.canDispose = false;
        }

        public initObject(name:string, delay:number, repeat:number, callback:Function, hasParam:boolean = false, priority:number = 10):void {
            this.delay = delay;
            this.repeat = repeat;
            this.callback = callback;
            this.hasParam = hasParam;
            this.lastTime = Util.getTimer();
            this.name = name;
            this.priority = priority;
        }

        public dispose():void {
            this.delay = 0;
            this.repeat = 0;
            this.callback = null;
            this.hasParam = false;
            this.lastTime = 0;
            this.name = null;
            this.priority = 10;
            this.canDispose = false;
        }

        public exec(time:number, d_t:number):boolean {
            var td_t = time - this.lastTime;
            if (td_t >= this.delay) {
                this.lastTime = time;
                if (this.hasParam) {
                    this.callback(time, td_t);
                }
                else {
                    this.callback();
                }
                return true;
            }
            return false;
        }
    }
}