module aoi
{
    import Mesh = aoi.Mesh;
    import IMaterial = aoi.IMaterial;
    export class QuadBatch extends Mesh
    {
        private _key:string;
        private _geo:BatchGeometry;
        private _first:IBase2D;
        private _mName:IMaterial;
        private _maskPlungin:PlunginMask;
        constructor()
        {
            super(null, null, false);
            this._geo = new BatchGeometry();
            this.geometry = this._geo;
        }
        public reset():void
        {
            this.material = null;
            this._geo.reset();
            this._first = null;
            this.getPluginCollector(Define.CAM_2D).removePlugin(PlunginDefine.MASK);
            this.getPluginCollector(Define.CAM_2D).removePlugin(PlunginDefine.MODEL_MATRIX);
        }
        public buildGeo():void
        {
            this._geo.buildGeometry();
        }
        public addMesh(mesh:IBase2D, cam:ICamera, renderType:number):void
        {
            this._geo.addMesh(mesh);
            if(this._first == null)
            {
                let collect:PlunginCollecter = mesh.getPluginCollector(renderType);
                this._first = mesh;
                this._key = collect.getShaderKey();
                this._mName = mesh.material;
                if(collect.hasPlugin(PlunginDefine.MASK))
                {
                    this._maskPlungin = (collect.getPlugin(PlunginDefine.MASK) as PlunginMask).clone();
                    var pmm:PlunginModelMatrix = new PlunginModelMatrix();
                    collect.addPlugin(this._maskPlungin);
                }
            }
        }
        public isSame(mesh:IBase2D, renderType:number):boolean
        {
            let collect:PlunginCollecter = mesh.getPluginCollector(renderType);
            if(this._key == collect.getShaderKey()
            && this._mName == mesh.material)
            {
                if(collect.hasPlugin(PlunginDefine.MASK))
                {
                    var p:PlunginMask = (collect.getPlugin(PlunginDefine.MASK) as PlunginMask);
                    if(this._maskPlungin.isSame(p))
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    return true;
                }
            }
            return false;
        }
    }
}