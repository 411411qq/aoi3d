module aoi {
    /** 渲染基础 */
    export class PlunginSimple extends PlunginVoBase {
        private shadowVar:math.Vector3D;
        constructor() {
            super();
            this._key = "simple";
            this.limitNum = 1;
            this.type = PlunginDefine.SIMPLE;
            this.txtIndex = 0;
            this.shadowVar = new math.Vector3D();
        }
        
        public updateCode(renderType:number):void {
            this._vertexCode.push(new OpenGlCodeVo(0, this, this.genVertexCode1));
            this._vertexCode.push(new OpenGlCodeVo(30000, this, this.genVertexCode2));
            this._vertexCode.push(new OpenGlCodeVo(50000, this, this.genVertexCode3));
            this._vertexCode.push(new OpenGlCodeVo(70000, this, this.genVertexCode4));
            this._vertexCode.push(new OpenGlCodeVo(90000, this, this.genVertexCode5));

            this._fragmentCode.push(new OpenGlCodeVo(0, this, this.genFramentCode1));
            this._fragmentCode.push(new OpenGlCodeVo(30000, this, this.genFramentCode2));
            if(renderType == Define.CAM_SHADOW)
            {
                this._fragmentCode.push(new OpenGlCodeVo(30001, this, this.genFramentCode2_shadow));
            }
            this._fragmentCode.push(new OpenGlCodeVo(50000, this, this.genFramentCode3));
            
            if(renderType == Define.CAM_SHADOW)
            {
                this._fragmentCode.push(new OpenGlCodeVo(90000, this, this.genFramentCode_shadow));
            }
            else
            {
                this._fragmentCode.push(new OpenGlCodeVo(90000, this, this.genFramentCode_normal));
            }
        }

        private genVertexCode1():string {
            var str:string = 'attribute vec4 a_Position;\n' +
                'attribute vec2 a_TexCoord;\n' +
                'uniform mat4 u_MvpMatrix;\n' +
                'uniform vec4 u_Sampler_uv;\n' +
                'varying vec2 v_TexCoord;\n';
            return str;
        }

        private genVertexCode2():string {
            var str:string = 'void main() {\n' +
                'vec2 n_TexCoord = calUvOffset(a_TexCoord, u_Sampler_uv);\n' + 
                'vec4 n_Position = a_Position;\n';
            return str;
        }

        private genVertexCode3():string {
            var str:string = "";
            str += "vec4 endPos = u_MvpMatrix * n_Position;\n";
            str += "gl_Position = endPos;\n";
            return str;
        }

        public genVertexCode4() {
            var str = 'v_TexCoord = n_TexCoord;\n';
            return str;
        }

        private genVertexCode5():string {
            var str:string = '}\n';
            return str;
        }

        private genFramentCode1():string {
            var str:string = '#ifdef GL_ES\nprecision mediump float;\n#endif\n';
            return str;
        }

        private genFramentCode2():string {
            var str:string = 'varying vec2 v_TexCoord;\n' +
                'uniform sampler2D u_Sampler;\n';
            return str;
        }
        private genFramentCode2_shadow():string {
            var str:string = 'uniform vec4 u_shadowVar;\n';
            return str;
        }

        private genFramentCode3():string {
            var str:string = 'void main() {\n';
            str += "vec2 texCoord = v_TexCoord;\n";
            return str;
        }

        private genFramentCode_shadow():string
        {
            var str:string = "float mv = max(outcolor.x, outcolor.y);\n";
            str += "mv = max(mv, outcolor.z);\n";
            str += "if(mv > 1.0){\n";
            str += "outcolor.xyz = outcolor.xyz / mv;\n";
            str += "}\n";
            str += 'gl_FragColor = vec4(v_wpos.z / u_shadowVar.x, outcolor.w, v_wpos.z / u_shadowVar.x, 1.0);\n';
            str += '}\n';
            return str;
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

        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginCaculateUV());
            arr.push(new aoi.PlunginDefaultTextureColor());
            return arr;
        }

        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 1, name: "a_Position"});
            arr.push({type: 1, name: "a_TexCoord"});
            arr.push({type: 2, name: "u_MvpMatrix"});
            arr.push({type: 2, name: "u_Sampler"});
            arr.push({type: 2, name: "u_Sampler_uv"});
            arr.push({type: 2, name: "u_shadowVar"});
            return arr;
        }

        public genTextureIndex():void {
            this.txtIndex = this.pColloct.getTextureObj();
        }

        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            var buffer:WebGLBuffer = subGeo.getVertexBuffer(gl), FSIZE = subGeo.bytesPerEle, perLen = subGeo.vertexStride;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            this.initAttributeVariable(gl, program["a_Position"], buffer, 3, FSIZE * perLen, 0);
            this.initAttributeVariable(gl, program["a_TexCoord"], buffer, 2, FSIZE * perLen, FSIZE * 3);

            gl.uniformMatrix4fv(program["u_MvpMatrix"], false, target.getFinalMatrix().elements);

            if(target.pluginCollector.hasPlugin(PlunginDefine.PERTURBATION) == false)
            {
                gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
                gl.bindTexture(gl.TEXTURE_2D, target.material.getTextures(gl));
                gl.uniform1i(program["u_Sampler"], this.txtIndex);
                gl.uniform4fv(program["u_Sampler_uv"], target.material.getOffsetData().elements);
            }
            else
            {
                let fbo:FrameBufferObject = FrameBufferManager.instance.getFrameBufferObject(Define.FBO_PERTURBATION);
                gl.activeTexture(gl["TEXTURE" + this.txtIndex]);
                gl.bindTexture(gl.TEXTURE_2D, fbo.texture);
                gl.uniform1i(program["u_Sampler"], this.txtIndex);
                gl.uniform4fv(program["u_Sampler_uv"], target.material.getOffsetData().elements);
            }

            if(renderType == Define.CAM_SHADOW)
            {
                if(camera.projection.type == 1)
                {
                    this.shadowVar.x = 1;
                }
                else
                {
                    this.shadowVar.x = camera.projection.far;
                }
                gl.uniform4fv(program["u_shadowVar"], this.shadowVar.elements);
            }
        }

        public disactive(gl:WebGLRenderingContext, program:WebGLProgram):void {
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.disableVertexAttribArray(program["a_Position"]);
            gl.disableVertexAttribArray(program["a_TexCoord"]);
        }
    }
}