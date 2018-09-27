module aoi {
    import Vector3D = math.Vector3D;
    export class HoverController extends LookAtController {
        public _currentPanAngle:number = 0;
        public _currentTiltAngle:number = 90.0;

        private _panAngle:number = 0;
        private _tiltAngle:number = 90;
        private _distance:number = 1000;
        private _minPanAngle:number = -Infinity;
        private _maxPanAngle:number = Infinity;
        private _minTiltAngle:number = -90;
        private _maxTiltAngle:number = 90;
        private _steps:number = 8;
        private _yFactor:number = 1;
        private _wrapPanAngle:boolean = false;

        constructor(targetObject:IController = null, lookAtObject:Object3DContainer = null, lookAtPosition:Vector3D = null,
                    panAngle:number = 0, tiltAngle:number = 90, distance:number = 1000, minTiltAngle:number = -90,
                    maxTiltAngle:number = 90, minPanAngle:number = NaN, maxPanAngle:number = NaN, steps:number = 8,
                    yFactor:number = 1, wrapPanAngle:boolean = false) {
            super(targetObject, lookAtObject, lookAtPosition);
            this.distance = distance;
            this.panAngle = panAngle;
            this.tiltAngle = tiltAngle;
            this.minPanAngle = minPanAngle || -Infinity;
            this.maxPanAngle = maxPanAngle || Infinity;
            this.minTiltAngle = minTiltAngle;
            this.maxTiltAngle = maxTiltAngle;
            this.steps = steps;
            this.yFactor = yFactor;
            this.wrapPanAngle = wrapPanAngle;

            this._currentPanAngle = this._panAngle;
            this._currentTiltAngle = this._tiltAngle;
        }

        public get steps():number {
            return this._steps;
        }

        public set steps(value:number) {
            value = value < 1 ? 1 : value;
            if (this._steps == value) {
                return;
            }
            this._steps = value;
        }

        public get panAngle():number {
            return this._panAngle;
        }

        public set panAngle(val:number) {
            val = Math.max(this._minPanAngle, Math.min(this._maxPanAngle, val));

            if (this._panAngle == val) {
                return;
            }

            this._panAngle = val;
        }

        public get tiltAngle():number {
            return this._tiltAngle;
        }

        public set tiltAngle(val:number) {
            val = Math.max(this._minTiltAngle, Math.min(this._maxTiltAngle, val));

            if (this._tiltAngle == val) {
                return;
            }

            this._tiltAngle = val;
        }

        public get distance():number {
            return this._distance;
        }

        public set distance(val:number) {
            if (this._distance == val) {
                return;
            }

            this._distance = val;
        }

        public get minPanAngle():number {
            return this._minPanAngle;
        }

        public set minPanAngle(val:number) {
            if (this._minPanAngle == val) {
                return;
            }

            this._minPanAngle = val;

            this.panAngle = Math.max(this._minPanAngle, Math.min(this._maxPanAngle, this._panAngle));
        }

        public get maxPanAngle():number {
            return this._maxPanAngle;
        }

        public set maxPanAngle(val:number) {
            if (this._maxPanAngle == val)
                return;

            this._maxPanAngle = val;

            this.panAngle = Math.max(this._minPanAngle, Math.min(this._maxPanAngle, this._panAngle));
        }

        public get minTiltAngle():number {
            return this._minTiltAngle;
        }

        public set minTiltAngle(val:number) {
            if (this._minTiltAngle == val)
                return;

            this._minTiltAngle = val;

            this.tiltAngle = Math.max(this._minTiltAngle, Math.min(this._maxTiltAngle, this._tiltAngle));
        }

        public get maxTiltAngle():number {
            return this._maxTiltAngle;
        }

        public set maxTiltAngle(val:number) {
            if (this._maxTiltAngle == val)
                return;

            this._maxTiltAngle = val;

            this.tiltAngle = Math.max(this._minTiltAngle, Math.min(this._maxTiltAngle, this._tiltAngle));
        }

        public get yFactor():number {
            return this._yFactor;
        }

        public set yFactor(val:number) {
            if (this._yFactor == val)
                return;

            this._yFactor = val;
        }

        public get wrapPanAngle():boolean {
            return this._wrapPanAngle;
        }

        public set wrapPanAngle(val:boolean) {
            if (this._wrapPanAngle == val)
                return;

            this._wrapPanAngle = val;
        }

        public update():void {
            if (this._tiltAngle != this._currentTiltAngle || this._panAngle != this._currentPanAngle) {
                if (this._wrapPanAngle) {
                    if (this._panAngle < 0)
                        this._panAngle = (this._panAngle % 360) + 360;
                    else
                        this._panAngle = this._panAngle % 360;

                    if (this._panAngle - this._currentPanAngle < -180)
                        this._currentPanAngle -= 360;
                    else if (this._panAngle - this._currentPanAngle > 180)
                        this._currentPanAngle += 360;
                }

                this._currentTiltAngle += (this._tiltAngle - this._currentTiltAngle) / this.steps;
                this._currentPanAngle += (this._panAngle - this._currentPanAngle) / this.steps;


                //snap coords if angle differences are close
                if ((Math.abs(this.tiltAngle - this._currentTiltAngle) < 0.01) && (Math.abs(this._panAngle - this._currentPanAngle) < 0.01)) {
                    this._currentTiltAngle = this._tiltAngle;
                    this._currentPanAngle = this._panAngle;
                }
            }

            var pos:Vector3D = (this._lookAtObject) ? this.lookAtObject.position : (this.lookAtPosition) ? this.lookAtPosition : this._orgin;
            this._targetObject.x = pos.x + this.distance * Math.sin(this._currentPanAngle * Define.DEGREES_TO_RADIANS) * Math.cos(this._currentTiltAngle * Define.DEGREES_TO_RADIANS);
            this._targetObject.z = pos.z + this.distance * Math.cos(this._currentPanAngle * Define.DEGREES_TO_RADIANS) * Math.cos(this._currentTiltAngle * Define.DEGREES_TO_RADIANS);
            this._targetObject.y = pos.y + this.distance * Math.sin(this._currentTiltAngle * Define.DEGREES_TO_RADIANS) * this.yFactor;
            super.update();
        }
    }
}