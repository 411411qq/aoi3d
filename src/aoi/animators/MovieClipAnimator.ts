module aoi {
    export class MovieClipAnimator extends AnimatorGather {
        constructor() {
            super();
        }

        public isActionReady(action:number):boolean {
            return true;
        }

        public getCurClip(value:AnimatorPlayData):Object {
            var curClip:IClipNode = this.getAction(value.action);
            if (curClip == null)return null;
            var perFrameTime:number = curClip.frameInterval * 100 / value.playSpeed;
            var frameNum:number = (value.pastTime / perFrameTime) % curClip.numFrames;
            return curClip.getFrame(frameNum);
        }
    }
}