module aoi {
    export class SceneAsset extends AbstractAsset {
        private _objList:Object;
        private _geoDic:Object;
        private _textureList:Array<string>;
        constructor() {
            super();
            this.needParser = 1;
        }
        public getWorkerData():Object {
            return {type: 6, buffer: this._loaderData.data};
        }
        public initWorkerData(data) 
        {
            this._objList = data.node;
            this._geoDic = {};
            var len:number = data.geoDic.length;
            for(var i:number = 0; i<len; i++)
            {
                var g:PrimitiveBase = new PrimitiveBase();
                g.subGeometry.vertexRawData = data.geoDic[i].geoObj["rawPositionsData"];
                g.subGeometry.indexRawData = data.geoDic[i].geoObj["rawIndexData"];

                var b1:base.ByteArray = new base.ByteArray(data.geoDic[i].geoObj["rawIndexData"], base.Endian.LITTLE_ENDIAN);

                g.setVertexStride(5);
                g.subGeometry.vertexStride = 5;
                this._geoDic[data.geoDic[i].geoName] = g;
            }
            this._textureList = data.textureList;
        }
        public getGeo(geoName:string)
        {
            return this._geoDic[geoName];
        }
        public getObjList()
        {
            return this._objList;
        }
        public getTextureList():Array<string>
        {
            return this._textureList;
        }
        public dispose():void {
            super.dispose();
            if (this._geoDic != null) {
                for(var variable  in this._geoDic)
                {
                    this._geoDic[variable].dispose();
                }
                this._geoDic = null;
            }
        }
    }
}