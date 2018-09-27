module aoi {
    export class SkeletonAnimator extends AnimatorGather {
        private skeleton:Skeleton;
        constructor(skeleton:Skeleton) {
            super();
            this.skeleton = skeleton;
        }
        public getSkeletonPos(value:AnimatorPlayData):SkeletonPose
        {
            if(GlobelConst.nowTime != value.curSkeletonTime)
            {
                var curClip,rsSkeletonPos;
                value.lastAction = -1;
                curClip = this.getAction(value.action);
                value.checkPlayTime(curClip.getTotalTime(value.action, this), curClip.frameInterval);
                rsSkeletonPos = curClip.getFrameByPastTime(value.pastTime, value.playSpeed, this, value.action);
                value.curSkeletonTime = GlobelConst.nowTime;
                value.curSkeletonPos = rsSkeletonPos;
            }
            return value.curSkeletonPos;
        }
    }
}