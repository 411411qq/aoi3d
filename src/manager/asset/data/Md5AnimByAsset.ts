module aoi {
    export class Md5AnimByAsset extends AbstractAsset {
        private _clip:SkeletonClipNode;

        constructor() {
            super();
            this.needParser = 1;
            this._clip = null;
        }

        public get clip():SkeletonClipNode {
            return this._clip;
        }

        public getWorkerData():Object {
            return {type: 3, buffer: this._loaderData.data};
        }

        public initWorkerData(data:Object):void {
            this._clip = new SkeletonClipNode();
            this._clip.frameInterval = data["frameInterval"];
            var i = 0, j = 0;
            var translate:math.Vector3D;
            var orientation;
            for (i = 0; i < data["numFrames"]; i++) {
                var skelPose = new SkeletonPose();
                var jointPoses = skelPose.jointPoses;
                for (j = 0; j < data["numBone"]; j++) {
                    var pose:JointPose = new JointPose();
                    translate = new math.Vector3D();
                    orientation = new math.Quaternion();
                    translate.setTo(data["frames"][i][j][0], data["frames"][i][j][1], data["frames"][i][j][2]);
                    orientation.x = data["frames"][i][j][3];
                    orientation.y = data["frames"][i][j][4];
                    orientation.z = data["frames"][i][j][5];
                    var w = 1 - orientation.x * orientation.x - orientation.y * orientation.y - orientation.z * orientation.z;
                    orientation.w = w < 0 ? 0 : -Math.sqrt(w);
                    var matrix3d = orientation.toMatrix();
                    matrix3d.appendTranslation(translate.x, translate.y, translate.z);
                    pose.orientation = orientation;
                    pose.translation = translate;
                    pose.matrix3d = matrix3d;
                    pose.index = i * 4;
                    pose.name = "dd" + j + " " + j;
                    jointPoses[j] = pose;
                }
                this._clip.addFrame(skelPose);
            }
            this.insertClip(this.clip);
            this._loaderData.data = null;
        }

        private insertClip(c:SkeletonClipNode):void
        {
            if (c.frameInterval > 16)
            {
                var old = c.frameInterval, lastTime = c.frameInterval * c.numFrames, j, cf, nf, bw, frames = c.frames, cp, np, _node = [];
                c.frameInterval = 16;
                for (j = 0; j <= lastTime; j += 16)
                {
                    cf = Math.floor(j / old);
                    bw = (j % old) / old;
                    cp = frames[cf];
                    nf = cf + 1;
                    if (nf >= frames.length)
                    {
                        np = frames[0];
                    }
                    else
                    {
                        np = frames[nf];
                    }
                    var rsSkePose = SkeletonPose.insertSkeletonPose(cp, np, bw);
                    _node.push(rsSkePose);
                }
                c.frames = _node;
            }
         }
    }
}