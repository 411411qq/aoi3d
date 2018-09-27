module aoi {
    import IDispose = aoi.IDispose;
    import IClipNode = aoi.IClipNode;
    import AnimatorPlayData = aoi.AnimatorPlayData;
    import Util = base.Util;
    export class AnimatorGather implements IDispose, IAnimatorGather {
        private _clipDic:Object;

        constructor() {
            this._clipDic = {};
        }

        public isActionReady(action:number):boolean
        {
            if(this._clipDic[action] == null)
            {
                return false;
            }
            return true;
        }

        public addAction(action:number, clip:Object) {
            var oClip = this.getAction(action);
            if (oClip != null) {
                oClip.dispose();
            }
            this._clipDic[action] = clip;
        }

        public getAction(action:number) {
            return this._clipDic[action];
        }

        public delAction(action:number) {
            var oClip = this.getAction(action);
            if (oClip != null) {
                oClip.dispose();
            }
            delete this._clipDic[action];
        }

        public dispose():void {
            var key;
            for (key in this._clipDic) {
                var clip = this._clipDic[key];
                clip.dispose();
                delete this._clipDic[key];
            }
        }
    }
}