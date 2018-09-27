module aoi {
    import IDispose = aoi.IDispose;
    import IClipNode = aoi.IClipNode;
    import IAnimatorGather = aoi.IAnimatorGather;
    export class AnimatorNode implements IDispose, IClipNode {
        protected _frameInterval:number;
        protected _clipName:string;
        protected _adjustRate:number;

        constructor() {

        }

        public dispose():void {
            throw new Error("need");
        }

        public addFrame(skeletonPose:Object):void {
            throw new Error("need");
        }

        public getFrame(value:number):Object {
            throw new Error("need");
        }

        public get numFrames():number {
            throw new Error("need");
        }

        public get clipName():string {
            return this._clipName;
        }

        public set clipName(value:string) {
            this._clipName = value;
        }

        public get frameInterval():number {
            return this._frameInterval;
        }

        public set frameInterval(value:number) {
            this._frameInterval = value;
        }

        public getTotalTime(action:number, owner:IAnimatorGather):number {
            throw new Error("need");
        }

        public set adjustRate(value:number) {
            this._adjustRate = value;
        }
    }
    export class MovieClipNode extends AnimatorNode {
        private _frames:Array<Object>;

        constructor() {
            super();
            this._frames = [];
        }

        public dispose():void {
            while (this._frames.length > 0) {
                this._frames.shift();
            }
        }

        public addFrame(pose:Object):void {
            this._frames.push(pose);
        }

        public getFrame(value:number):Object {
            return this._frames[value];
        }

        public get numFrames():number {
            return this._frames.length;
        }

        public getTotalTime(action:number, owner:IAnimatorGather = null):number {
            return this._frames.length * this.frameInterval;
        }
    }
    export class SkeletonClipNode extends AnimatorNode {
        private _frames:Array<SkeletonPose>;

        constructor() {
            super();
            this._frames = [];
        }
        public get frames():Array<SkeletonPose>
        {
            return this._frames;
        }
        public set frames(val:Array<SkeletonPose>)
        {
            this._frames = val;
        }

        public dispose():void {
            while (this._frames.length > 0) {
                var s:SkeletonPose = this._frames.shift();
                s.dispose();
            }
        }

        public addFrame(skeletonPose:Object):void {
            this._frames.push(skeletonPose as SkeletonPose);
        }

        public  getFrameByPastTime(pastTime:number, playSpeed:number, owner:IAnimatorGather, action:number):Object {
            var pt:number = pastTime;
            var perFrameTime:number = this.frameInterval * 100 / playSpeed;
            var frameNum:number = (pt / perFrameTime) % this.numFrames;
            return this.getFrame(frameNum);
        }

        public  getFrame(value:number):Object {
            while (value < 0) {
                value += this.numFrames;
            }
            while (value >= this.numFrames) {
                value -= this.numFrames;
            }
            return this._frames[Math.floor(value)];
        }

        public  get numFrames():number {
            return this._frames.length;
        }

        public  getTotalTime(action:number, owner:IAnimatorGather = null):number {
            return this._frames.length * this.frameInterval;
        }
    }
}