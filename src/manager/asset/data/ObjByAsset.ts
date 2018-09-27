module aoi {
    export class ObjByAsset extends AbstractAsset {
        private _geo:PrimitiveBase;

        constructor() {
            super();
            this.needParser = 1;
        }

        public getWorkerData():Object {
            return {type: 1, buffer: this._loaderData.data};
        }

        public get geo():Geometry {
            return this._geo;
        }

        public initWorkerData(data:Object):void {
            this._geo = new PrimitiveBase();
            this._geo.subGeometry.vertexRawData = data["rawPositionsData"];
            this._geo.subGeometry.indexRawData = data["rawIndexData"];
            var bound = new AxisAlignedBoundingBox();
            bound.buildFromObj(data["bound"]);
            this._geo.bound = bound;
        }

        public dispose():void {
            super.dispose();
            if (this._geo != null) {
                this._geo.dispose();
                this._geo = null;
            }
        }
    }
}