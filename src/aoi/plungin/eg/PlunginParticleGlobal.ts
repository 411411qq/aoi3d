module aoi 
{
    export class PlunginParticleGlobal extends PlunginVoBase {
        constructor() {
            super();
            this.key = "p_g";
            this.limitNum = 1;
            this.type = PlunginDefine.P_MOVE_OR_ROT;
        }
    }
}