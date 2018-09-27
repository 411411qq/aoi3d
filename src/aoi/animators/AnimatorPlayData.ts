module aoi {
    import EventBase = base.EventBase;
    import EventDispatcher = base.EventDispatcher;
    import GlobelConst = aoi.GlobelConst;
    import SkeletonPose = aoi.SkeletonPose;
    export class AnimatorPlayData extends EventDispatcher {
        public startTime:number;
        public action:number;
        public aniType:number;
        public setPlayTime:number;
        public isPlaying:boolean;
        public setFrame:number;
        public hasSetFrame:boolean;
        private _playSpeed:number;
        public doSmooth:boolean;
        public smoothTime:number;
        public lastAction:number;
        public lastActionOutTime:number;
        public stopSetTime:number;
        public stopLastTime:number;
        public curSkeletonPos:SkeletonPose;
        public curSkeletonTime:number;
        constructor() {
            super();
            this.startTime = 0;
            this.action = 0;
            this.aniType = 0;
            this.setPlayTime = 0;
            this.isPlaying = true;
            this.setFrame = 0;
            this.hasSetFrame = false;
            this._playSpeed = 100;
            this.doSmooth = false;
            this.smoothTime = 0;
            this.lastAction = 0;
            this.lastActionOutTime = 0;

            this.stopSetTime = 0;
            this.stopLastTime = 0;
        }

        get playSpeed():number {
            return this._playSpeed;
        }

        set playSpeed(val:number) {
            if (this._playSpeed == val) {
                return;
            }
            var pTime = this.pastTime * this._playSpeed / val;
            if (this.isPlaying == false) {
                this.startTime = this.stopSetTime - pTime - this.stopLastTime;
            }
            else {
                this.startTime = GlobelConst.nowTime - pTime - this.stopLastTime;
            }
            this._playSpeed = val;
        }

        get pastTime():number {
            if (this.isPlaying == false) {
                return this.stopSetTime - this.startTime - this.stopLastTime;
            }
            else {
                return GlobelConst.nowTime - this.startTime - this.stopLastTime;
            }
        }

        setAction(value:number, resetTime:boolean):void {
            if (this.action != value || resetTime == true) {
                if (this.doSmooth == true) {
                    if (this.pastTime > 0) {
                        this.lastAction = this.action;
                        this.lastActionOutTime = this.pastTime;
                    }
                    this.startTime = GlobelConst.nowTime + this.smoothTime;
                }
                else {
                    this.startTime = GlobelConst.nowTime;
                }
            }
            this.stopSetTime = -1;
            this.stopLastTime = 0;
            this.action = value;
            this.hasSetFrame = false;
        }

        dispose():void {
            this.isPlaying = false;
            this.stopSetTime = -1;
            this.stopLastTime = 0;
        }

        checkPlayTime(actionTime:number, frameTime:number):void {
            if (this.setPlayTime == -1) {
                return;
            }
            actionTime = actionTime * 100 / this.playSpeed;
            var playTimes = this.pastTime / actionTime;
            if (playTimes >= this.setPlayTime) {
                this.dispatchEvent(new EventBase(EventBase.ACTION_END));
            }
        }

        gotoAndStopTime(time:number):void {
            this.stop();
            this.stopSetTime = this.startTime + time;
        }

        stop():void {
            this.isPlaying = false;
            this.stopSetTime = GlobelConst.nowTime;
        }

        play():void {
            this.isPlaying = true;
            if (this.stopSetTime != -1) {
                this.stopLastTime += GlobelConst.nowTime - this.stopSetTime;
            }
        }
    }
}