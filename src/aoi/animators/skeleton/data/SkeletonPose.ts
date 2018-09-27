module aoi
{
    import IDispose = aoi.IDispose;
    import VectorArray = base.VectorArray;
    import Skeleton = aoi.Skeleton;
    export class SkeletonPose implements IDispose
    {
        private _jointPoses:Array<JointPose>;
        private _globalPoses:Array<JointPose>;
        private _rsList:VectorArray;
        public isAllReady:boolean;
        public isTemp:boolean;
        constructor()
        {
            this._jointPoses = [];
            this._globalPoses = [];
            this.isAllReady = false;
            this.isTemp = false;
        }
        public get numJointPoses():number
        {
            return this._jointPoses.length;
        }
        public get jointPoses():Array<JointPose>
        {
            return this._jointPoses;
        }
        public get rsList():VectorArray
        {
            if (this._rsList == null)
            {
                var len = this._jointPoses.length;
                this._rsList = new VectorArray(1, 16 * len);
                var raw, i;
                for (i = 0; i < len; i++)
                {
                    raw = this._jointPoses[i].rowData;
                    this._rsList.push(raw[0], raw[1], raw[2], raw[3]);
                    this._rsList.push(raw[4], raw[5], raw[6], raw[7]);
                    this._rsList.push(raw[8], raw[9], raw[10], raw[11]);
                    this._rsList.push(raw[12], raw[13], raw[14], raw[15]);
                }
            }
            return this._rsList;
        }
        public buildGlobalPoses(skeleton:Skeleton):void
        {
            if (this._globalPoses == null)
            {
                var globalJointPose, len = this._jointPoses.length, joints = skeleton.joints;
                var joint, parentIndex, pose, t, q, or, tr, parentPose, i;

                var x1, y1, z1, w1;
                var x2, y2, z2, w2;
                var x3, y3, z3;

                this._globalPoses = [];
                for (i = 0; i < len; ++i)
                {
                    globalJointPose = this._globalPoses[i] = new JointPose();
                    joint = joints[i];
                    parentIndex = joint.parentIndex;
                    pose = this._jointPoses[i];
                    q = globalJointPose.orientation;
                    t = globalJointPose.translation;
                    if (parentIndex < 0)
                    {
                        tr = pose.translation;
                        or = pose.orientation;
                        q.x = or.x;
                        q.y = or.y;
                        q.z = or.z;
                        q.w = or.w;
                        t.x = tr.x;
                        t.y = tr.y;
                        t.z = tr.z;
                    }
                    else
                    {
                        parentPose = this._globalPoses[parentIndex];

                        or = parentPose.orientation;
                        tr = pose.translation;
                        x2 = or.x;
                        y2 = or.y;
                        z2 = or.z;
                        w2 = or.w;
                        x3 = tr.x;
                        y3 = tr.y;
                        z3 = tr.z;

                        w1 = -x2 * x3 - y2 * y3 - z2 * z3;
                        x1 = w2 * x3 + y2 * z3 - z2 * y3;
                        y1 = w2 * y3 - x2 * z3 + z2 * x3;
                        z1 = w2 * z3 + x2 * y3 - y2 * x3;

                        tr = parentPose.translation;
                        t.x = -w1 * x2 + x1 * w2 - y1 * z2 + z1 * y2 + tr.x;
                        t.y = -w1 * y2 + x1 * z2 + y1 * w2 - z1 * x2 + tr.y;
                        t.z = -w1 * z2 - x1 * y2 + y1 * x2 + z1 * w2 + tr.z;

                        x1 = or.x;
                        y1 = or.y;
                        z1 = or.z;
                        w1 = or.w;
                        or = pose.orientation;
                        x2 = or.x;
                        y2 = or.y;
                        z2 = or.z;
                        w2 = or.w;

                        q.w = w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2;
                        q.x = w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2;
                        q.y = w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2;
                        q.z = w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2;
                    }
                }
            }
        }
        public findGlobalPoseByIndex(value:number, skeleton:Skeleton):JointPose
        {
            this.buildGlobalPoses(skeleton);
            if (this._globalPoses.length > value)
            {
                return this._globalPoses[value];
            }
            return null;
        }
        public dispose():void
        {
            this._jointPoses = null;
            this._globalPoses = null;
        }
        static insertSkeletonPose(cp, np, bw)
        {
            var currentPoseList, nextPoseList, rsSkePose = new SkeletonPose(), endPoses = rsSkePose.jointPoses;
            currentPoseList = cp.jointPoses;
            nextPoseList = np.jointPoses;
            var pose1, pose2, k, endPose;
            for (k = 0; k < currentPoseList.length; ++k)
            {
                pose1 = currentPoseList[k];
                pose2 = nextPoseList[k];
                endPose = SkeletonPose.insertJointPose(pose1, pose2, bw);
                endPoses.push(endPose);
            }
            return rsSkePose;
        }
        static insertJointPose(pose1:JointPose, pose2:JointPose, bw:number):JointPose
        {
            var endPose = new JointPose();
            var p1 = pose1.translation;
            var p2 = pose2.translation;
            endPose.orientation.lerp(pose1.orientation, pose2.orientation, bw);
            var tr = endPose.translation;
            tr.x = p1.x + bw*(p2.x - p1.x);
            tr.y = p1.y + bw*(p2.y - p1.y);
            tr.z = p1.z + bw*(p2.z - p1.z);
            return endPose;
        }
    }
}