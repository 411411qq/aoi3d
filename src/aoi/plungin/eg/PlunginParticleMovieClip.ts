module aoi {
    /** 粒子序列帧 */
    export class PlunginParticleMovieClip extends PlunginVoBase {
        private m_data:math.Vector3D;
        constructor() {
            super();
            this._key = "p_mc";
            this.limitNum = 1;
            this.type = PlunginDefine.P_MOVIECLICP;
            this.m_data = new math.Vector3D();
        }
        public setData(rowCount:number, colCount:number, totalFrames:number, interval:number):void
        {
            this.m_data.x = rowCount;
            this.m_data.y = colCount;
            this.m_data.z = totalFrames;
            this.m_data.w = interval;
        }
        public updateCode() {
            this._vertexCode.push(new OpenGlCodeVo(35000, this, this.genVertexCode1));
        }
        public getAttArr():Array<any> {
            var arr = [];
            arr.push({type: 2, name: "u_par_mc"});
            return arr;
        }
        public genVertexCode1():string {
            var str:string = "";
            str += "n_Position.xyz = n_Position.xyz + a_parMove.xyz * time.yyy;\n";
            return str;
        }
    }
}