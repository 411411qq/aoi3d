module aoi {
    export class Md5MeshByAsset extends AbstractAsset {
        private _geo:Geometry;

        constructor() {
            super();
            this.needParser = 1;
            this._geo = null;
        }
        public get geo():Geometry
        {
            return this._geo;
        }
        public getWorkerData():Object {
            return {type: 2, buffer: this._loaderData.data};
        }

        public initWorkerData = function (data) {
            this._geo = new Geometry();
            
            var skeleton = new Skeleton();
            skeleton.maxJointCount = data.maxJointCount;
            skeleton.readFromWorkerData(data.skeleton);
            this._geo.animator = new aoi.SkeletonAnimator(skeleton);
            this._geo.skeleton = skeleton;
            var meshs = data.meshs;
            var len = meshs.length, i = 0;
            for (i = 0; i < len; i++) {
                var mesh = meshs[i];
                var sub = new SkinedSubGeometry();
                sub.maxJointCount = data.maxJointCount;
                sub.name = mesh.name;
                sub.indexRawData = (mesh.indexRawData);
                sub.vertexRawData = (mesh.rawPositionsData);
                this._geo.addSubGeometry(sub);
            }
            var bound = new AxisAlignedBoundingBox();
            bound.buildFromObj(data.bound);
            this._geo.bound = bound;
            this._loaderData.data = null;
        }
    }
}