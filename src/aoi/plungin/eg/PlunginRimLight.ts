module aoi {
    /** 内发光 */
    export class PlunginRimLight extends PlunginVoBase {
        private _color:Float32Array;
        constructor() {
            super();
            this.key = "RimLight";
            this.limitNum = 1;
            this.type = PlunginDefine.RIM_LIGHT;
            this.txtIndex = 0;
            this._color = new Float32Array(4);
        }
        public setColor(r:number, g:number, b:number, a:number)
        {
            this._color[0] = r;
            this._color[1] = g;
            this._color[2] = b;
            this._color[3] = a;
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginCaculateNormal());
            arr.push(new aoi.PlunginNormalAndTrangent());
            arr.push(new aoi.PlunginCaculateUV());
            arr.push(new aoi.PlunginEyePos());
            arr.push(new aoi.PlunginModelInverseMatrix());
            return arr;
        }
        public genTextureIndex():void {
            this.txtIndex = this.pColloct.getTextureObj();
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_RimColor"});
            return arr;
        }
        public updateCode(renderType:number):void {
            this._vertexCode.push(new OpenGlCodeVo(3, this, this.genVertexCode1));
            this._vertexCode.push(new OpenGlCodeVo(70002, this, this.genVertexCode2));

            this._fragmentCode.push(new OpenGlCodeVo(30100, this, this.genFramentCode2));
            this._fragmentCode.push(new OpenGlCodeVo(70500, this, this.genFramentCode4));
        }
        private genVertexCode1():string {
            var str:string = '';
            str += "varying vec3 v_endPos;\n";
            return str;
        }
        private genVertexCode2():string {
            var str:string = 'vec3 outEnd = (u_ModelInverseMatrix * n_Position).xyz;\n';
            str += "v_endPos = outEnd.xyz;\n";
            return str;
        }
        private genFramentCode2():string {
            var str:string = 'uniform vec4 u_RimColor;\n';
            str += "varying vec3 v_endPos;";
            return str;
        }
        private genFramentCode4():string {
            var str:string = "vec3 viewDirection = normalize(v_endPos - v_eye.xyz);\n";
            str += "float rim = 1.0 - dot(v_normal,viewDirection);\n";
            str += "rim = clamp(rim,0.0,1.0);\n";
            str += "rim = pow(rim, u_RimColor.w);\n";
            str += "vec3 addColor = u_RimColor.xyz * rim;\n";
            str += "outcolor.xyz = outcolor.xyz + addColor.xyz;\n";
            return str;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            gl.uniform4fv(program["u_RimColor"], this._color);
        }
    }
}