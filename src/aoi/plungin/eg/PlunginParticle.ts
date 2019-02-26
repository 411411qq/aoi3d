module aoi {
    /** 粒子基础 */
    export class PlunginParticle extends PlunginParticleBase {
        constructor(precision:number = 2) {
            super(precision);
            this._key = "Par";
            this.limitNum = 1;
            this.type = PlunginDefine.PARTICLE;
            this.txtIndex = 0;
            this._replaceType = PlunginDefine.REPLACE_MAIN;
            this._replaceWeight = 10;
        }
        public updateCode():void 
        {
            super.updateCode();
            this._fragmentCode.push(new OpenGlCodeVo(90000, this, this.genFramentCode_normal));
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            super.active(gl, subGeo, target, camera, program, renderType);
            gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
            gl.bindTexture(gl.TEXTURE_2D, target.material.getTextures(gl));
            gl.uniform1i(program["u_Sampler"], this.txtIndex);
            gl.uniform4fv(program["u_Sampler_uv"], target.material.getOffsetData().elements);
        }
        private genFramentCode_normal():string
        {
            var str:string = "float mv = max(outcolor.x, outcolor.y);\n";
            str += "mv = max(mv, outcolor.z);\n";
            str += "if(mv > 1.0){\n";
            str += "outcolor.xyz = outcolor.xyz / mv;\n";
            str += "}\n";
            str += 'if(show == 1.0){\n';
            str += 'gl_FragColor = outcolor;\n';
            str += '}\n';
            str += '}\n';
            return str;
        }
    }
}