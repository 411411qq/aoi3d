module aoi {
    /** 粒子旋转 */
    export class PlunginParticleRotation extends PlunginVoBase {
        constructor() {
            super();
            this.key = "p_r";
            this.limitNum = 1;
            this.type = PlunginDefine.P_ROT;
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginParticleRotFun());
            arr.push(new aoi.PlunginParticleRotOrMove());
            return arr;
        }
        public updateCode(renderType:number):void {
            this._vertexCode.push(new OpenGlCodeVo(21000, this, this.genVertexCode1));
        }
        private genVertexCode1():string
        {
            var str = "";
            str += "n_Position = rotVexter(n_Position, a_parMove.w * time.y);\n";
            return str;
        }
    }
}