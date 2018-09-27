module aoi {
    export class Altas {
        private _mat:Material;
        public width:number;
        public height:number;
        private _dic:Object = {};

        public set material(value:Material) {
            this._mat = value;
        }

        public get material():Material {
            return this._mat;
        }

        public set sltasDatas(value:AltasData) {
            this._dic = value;
        }

        public getAltasData(value:string):AltasData {
            return this._dic[value];
        }

        public setAltasData(value:AltasData):void {
            this._dic[value.name] = value;
        }
    }
    export class AltasData {
        public isNine:number;
        public name:string;
        public uvOffsetX:number;
        public uvOffsetY:number;
        public uvScaleX:number;
        public uvScaleY:number;

        public x:number;
        public y:number;
        public width:number;
        public height:number;

        public top:number;
        public bottom:number;
        public left:number;
        public right:number;

        public setUvData(w:number, h:number):void
        {
            this.uvOffsetX = (this.x + this.width) / w;
            this.uvOffsetY = this.y / h;
            this.uvScaleX = - this.width / w;
            this.uvScaleY = this.height / h;
        }
    }
}