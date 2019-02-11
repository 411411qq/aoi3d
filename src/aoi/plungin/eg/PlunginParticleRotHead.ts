module aoi {
    /** 朝向根据移动速度 */
    export class PlunginParticleRotHead extends PlunginVoBase {
        constructor() {
            super();
            this._key = "p_rh";
            this.limitNum = 1;
            this.type = PlunginDefine.P_ROT_HEAD;
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_rotHead"});
            return arr;
        }
        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            var comps;
            var tempM:math.Matrix4 = math.MathUtil.TEMP_MATRIX;
            tempM.identity();
            
            tempM.append(target.sceneTransform);
            tempM.append(camera.invertTransform);
            tempM.elements[12] = 0;
            tempM.elements[13] = 0;
            tempM.elements[14] = 0;
            tempM.elements[15] = 1;
            //tempM.identity();
            gl.uniformMatrix4fv(program["u_rotHead"], false, tempM.elements);
        }
        public updateCode(renderType:number):void {
            this._vertexCode.push(new OpenGlCodeVo(102, this, this.genVertexCode1));
            this._vertexCode.push(new OpenGlCodeVo(200, this, this.genVertexCode2));
            this._vertexCode.push(new OpenGlCodeVo(23000, this, this.genVertexCode3));
        }
        private genVertexCode1() {
            var str = "";
            str += "mat3 faceToSpeed(vec3 speed, mat4 rotHeadMareix){\n";
            str += "vec3 transSpeed = (rotHeadMareix * vec4(speed.xyz, 0.0)).xyz;\n";
            str += "transSpeed.z = 0.0;\n";
            str += "transSpeed = normalize(transSpeed);\n";
            str += "vec3 v0 = vec3(transSpeed.x, transSpeed.y, 0.0);\n";
            str += "vec3 v1 = vec3(-1.0 * transSpeed.y, transSpeed.x, 0.0);\n";
            str += "vec3 v2 = vec3(0.0, 0.0, 1.0);\n";
            str += "return mat3(v0,v1,v2);\n";
            str += "}\n";
            return str;
        }
        private genVertexCode2() {
            var str:string = 'uniform mat4 u_rotHead;\n';
            return str;
        }
        private genVertexCode3() {
            var str:string = "";
            str += "mat3 rhmat3 = faceToSpeed(a_parMove, u_rotHead);\n";
            str += 'n_Position.xyz = rhmat3 * n_Position.xyz;\n';
            return str;
        }
    }
}