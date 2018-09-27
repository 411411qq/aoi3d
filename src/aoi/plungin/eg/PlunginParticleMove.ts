module aoi {
    /** 粒子移动 */
    export class PlunginParticleMove extends PlunginVoBase {
        constructor() {
            super();
            this.key = "p_move";
            this.limitNum = 1;
            this.type = PlunginDefine.P_MOVE;
        }
        public getPrePlungin():Array<IPlunginVo>
        {
            var arr = new Array<IPlunginVo>();
            arr.push(new aoi.PlunginParticleRotOrMove());
            return arr;
        }
        public updateCode(renderType:number) {
            this._vertexCode.push(new OpenGlCodeVo(35000, this, this.genVertexCode1));
        }
        
        public genVertexCode1():string {
            var str = "" +
                "n_Position.xyz = n_Position.xyz + a_parMove.xyz * time.yyy;\n";
            return str;
        }
    }
}