module math
{
    export class Matrix3 {
        public elements:Float32Array;
        constructor(n11:number = 1, n12:number = 0, n13:number = 0,
                    n21:number = 0, n22:number = 1, n23:number = 0,
                    n31:number = 0, n32:number = 0, n33:number = 1) {
            this.elements = new Float32Array(16);
            this.reset(n11, n12, n13, n21, n22, n23, n31, n32, n33);
        }
        private reset(n11:number, n12:number, n13:number,
              n21:number, n22:number, n23:number,
              n31:number, n32:number, n33:number):void 
        {
            var te = this.elements;
            te[0] = n11 || 1;
            te[1] = n12 || 0;
            te[2] = n13 || 0;
            te[3] = n21 || 0;
            te[4] = n22 || 1;
            te[5] = n23 || 0;
            te[6] = n31 || 0;
            te[7] = n32 || 0;
            te[8] = n33 || 1;
        }
        public transformVector(val:Vector3D):Vector3D
        {
            var v:Vector3D = new Vector3D();
            v.x = val.x * this.elements[0] + val.x * this.elements[1] + val.x * this.elements[2];
            v.y = val.y * this.elements[3] + val.y * this.elements[4] + val.y * this.elements[5];
            v.z = val.z * this.elements[6] + val.z * this.elements[7] + val.z * this.elements[8];
            return v;
        }
    }
}