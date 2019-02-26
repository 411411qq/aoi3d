module aoi {
    export class PlunginMainBase extends PlunginVoBase {
        protected m_precision:number;
        constructor(precision:number) {
            super();
            this.m_precision = precision;
        }
        public get key():string
        {
            return this._key + this.m_precision;
        }
        public genFramentCode1() {
            var str:string = "";
            str += "#ifdef GL_ES\n";
            if(this.m_precision == 1)
            {
                str += "precision lowp float;\n";
            }
            else if(this.m_precision == 3)
            {
                str += "precision highp float;\n";
            }
            else
            {
                str += "precision mediump float;\n";
            }
            str += "#endif\n";
            return str;
        }
    }
}