module aoi {
    export class PlungingZoomBlur extends PlunginVoBase
    {
        private _zoomData:Float32Array;
        constructor(centerx:number, centery:number, strength:number)
        {
            super();
            this.key = "ZoomBlur";
            this.limitNum = 1;
            this.type = PlunginDefine.ZOOM_BLUR;
            this._zoomData = new Float32Array(2);
            this.setData(centerx, centery, strength);
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginTextureSize());
            return arr;
        }
        public setData(centerx:number, centery:number, strength:number):void
        {
            this._zoomData[0] = centerx;
            this._zoomData[1] = centery;
            this._zoomData[2] = strength;
        }
        public getAttArr() {
            var arr = [];
            arr.push({type: 2, name: "u_zoomData"});
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            gl.uniform3fv(program["u_zoomData"], this._zoomData);
        }
        public updateCode(renderType:number):void {
        	this._fragmentCode.push(new OpenGlCodeVo(50, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(75004, this, this.genFramentCode2));
        }
        private genFramentCode1():string
        {
        	var str = 'uniform vec3 u_zoomData;\n';
            return str;
        }
        private genFramentCode2():string
        {
        	var str = "";
            str += "";
            return str;
        }
    }
}