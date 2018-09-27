module aoi {
    export class NullBounds extends BoundingVolumeBase {
        private _alwaysIn:boolean;

        constructor(alwaysIn:boolean) {
            super();
            this._alwaysIn = alwaysIn;
            this._max.x = this._max.y = this._max.z = Number.POSITIVE_INFINITY;
            this._min.x = this._min.y = this._min.z = this._alwaysIn ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
        }

        public isInFrustum(camera:ICamera, checkObj:IBoundsOwner):boolean {
            return this._alwaysIn;
        }
    }
}