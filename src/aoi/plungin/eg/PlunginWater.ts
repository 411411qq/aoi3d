module aoi {
    /** 水面简易 */
    export class PlunginWater extends PlunginVoBase{
        private _norTexture:IMaterial;
        private data:math.Vector3D;
        constructor()
        {
            super();
            this._key = "water";
            this.limitNum = 1;
            this.type = PlunginDefine.WATER;
            this.txtIndex = 0;
            this.data = new math.Vector3D(0.2,0.5,0.1, 0);
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginCaculateNormal());
            arr.push(new aoi.PlunginConst());
            return arr;
        }
        public setData(refractionFactor:number, offsetFactor:number, timeFactorX:number, timeFactorY:number):void
        {
            this.data.x = refractionFactor;
            this.data.y = offsetFactor;
            this.data.z = timeFactorX;
            this.data.w = timeFactorY;
        }
        public setTexture(val:IMaterial):void
        {
            this._norTexture = val;
        }
        public genTextureIndex():void {
            this.txtIndex = this.pColloct.getTextureObj();
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_WaterNorTxt"});
            arr.push({type: 2, name: "u_Water"});
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            var buffer:WebGLBuffer = subGeo.getVertexBuffer(gl), FSIZE = subGeo.bytesPerEle, perLen = subGeo.vertexStride;
            
            gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
            gl.bindTexture(gl.TEXTURE_2D, this._norTexture.getTextures(gl));
            gl.uniform1i(program["u_WaterNorTxt"], this.txtIndex);

            gl.uniform4fv(program["u_Water"], this.data.elements);
        }
        public updateCode():void {
            this._fragmentCode.push(new OpenGlCodeVo(10000, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(50100, this, this.genFramentCode2));
        }
        private genFramentCode1():string {
            var str:string = 'uniform vec4 u_Water;\n';
            str += "uniform sampler2D u_WaterNorTxt;\n";
            return str;
        }
        private genFramentCode2():string {
            var str:string = '';
            str += "vec3 normal = calNormal(texCoord + vec2(v_const.x * u_Water.z, v_const.x * u_Water.w), u_WaterNorTxt);\n";
            str += "vec2 p = -1.0 + 2.0 * texCoord;\n";
            str += "vec3 inVec = normalize(vec3(p, 0.0));\n";
            str += "vec3 refractVec = refract(inVec, normal, u_Water.x);\n";
            str += "texCoord = texCoord + refractVec.xy * u_Water.y;\n";
            return str;
        }
    }
}