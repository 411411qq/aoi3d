module aoi {
    import Matrix4 = math.Matrix4;
    export class SkeletonJoint
    {
        public parentIndex:number;
        public name:string;
        public inverseBindPose:Matrix4;
        public bindPose:Matrix4;
        constructor()
        {
            this.parentIndex = -1;
            this.name = null;
            this.inverseBindPose = null;
            this.bindPose = null;
        }
    }
    export class Skeleton implements IDispose {
        public maxJointCount:number;
        public joints:Array<SkeletonJoint>;

        constructor() {
            this.joints = new Array<SkeletonJoint>();
        }
        public readFromWorkerData(data):void
        {
            var len = data.joints.length, i = 0;
            for(i = 0; i<len; i++)
            {
                var joint = new SkeletonJoint();
                joint.parentIndex = data.joints[i].parentIndex;
                joint.name = data.joints[i].name;
                joint.inverseBindPose = new Matrix4();
                joint.inverseBindPose.elements = data.joints[i].inverseBindPose;
                joint.bindPose = new Matrix4();
                joint.bindPose.elements = data.joints[i].bindPose;
                this.joints.push(joint);
            }
        }
        public get numJoints():number {
            return this.joints.length;
        }

        public jointFromName(jointName:string):SkeletonJoint {
            var jointIndex:number = this.jointIndexFromName(jointName);
            if (jointIndex != -1) {
                return this.joints[jointIndex];
            }
            else {
                return null;
            }
        }

        public jointIndexFromName(jointName:string):number {
            var len:number = this.joints.length;
            for (var i:number = 0; i < len; i++) {
                if (this.joints[i].name == jointName) {
                    return i;
                }
            }
            return -1;
        }

        public dispose():void {
            this.joints.length = 0;
        }
    }

}