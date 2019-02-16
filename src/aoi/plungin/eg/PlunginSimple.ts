module aoi {
    /** 渲染基础 */
    export class PlunginSimple extends PlunginSimpleBase {
        constructor() {
            super();
            this._key = "simple";
            this.limitNum = 1;
            this.type = PlunginDefine.SIMPLE;
            this.txtIndex = 0;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            super.active(gl, subGeo, target, camera, program, renderType);
            gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
            gl.bindTexture(gl.TEXTURE_2D, target.material.getTextures(gl));
            gl.uniform1i(program["u_Sampler"], this.txtIndex);
            gl.uniform4fv(program["u_Sampler_uv"], target.material.getOffsetData().elements);
        }
        public updateCode():void {
            super.updateCode();
            this._fragmentCode.push(new OpenGlCodeVo(90000, this, this.genFramentCode_normal));
        }
        private genFramentCode_normal():string
        {
            var str:string = "float mv = max(outcolor.x, outcolor.y);\n";
            str += "mv = max(mv, outcolor.z);\n";
            str += "if(mv > 1.0){\n";
            str += "outcolor.xyz = outcolor.xyz / mv;\n";
            str += "}\n";
            str += 'gl_FragColor = outcolor;\n';
            str += '}\n';
            return str;
        }
    }
}