module aoi {
    /** 粒子的Billboard */
    export class PlunginBillboard extends PlunginVoBase {
        private tempM:math.Matrix4;

        constructor() {
            super();
            this._key = "bill";
            this.type = PlunginDefine.P_BILL;
            this.limitNum = 1;
            this.tempM = math.MathUtil.TEMP_MATRIX;
        }

        public active(gl:WebGLRenderingContext, subGeo:ISubGeometry, target:IRenderable, camera:ICamera, program:WebGLProgram, renderType:number):void {
            var comps;
            this.tempM = math.MathUtil.TEMP_MATRIX;
            this.tempM.identity();
            this.tempM.append(camera.transform);
            this.tempM.append(target.sceneTransform);
            comps = this.tempM.decompose(math.Orientation3D.AXIS_ANGLE);
            this.tempM.identity();
            this.tempM.setRotate(comps[1].w * Define.RADIANS_TO_DEGREES, comps[1].x, comps[1].y, comps[1].z);

            gl.uniformMatrix4fv(program["u_BillMatrix"], false, this.tempM.elements);
        }

        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_BillMatrix"});
            return arr;
        }

        public updateCode():void {
            this._vertexCode.push(new OpenGlCodeVo(100, this, this.genVertexCode0));
            this._vertexCode.push(new OpenGlCodeVo(25000, this, this.genVertexCode1));
        }

        public genVertexCode0():string {
            var str:string = 'uniform mat4 u_BillMatrix;\n';
            return str;
        }

        public genVertexCode1():string {
            var str:string = 'n_Position = u_BillMatrix * n_Position;\n';
            return str;
        }
    }
}