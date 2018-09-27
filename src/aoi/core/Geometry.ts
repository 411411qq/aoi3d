module aoi {
    export class Geometry implements IDispose{
        /** 子网格*/
        protected _subGeometries:Array<ISubGeometry>;
        /** 动画数据*/
        protected _animator:IAnimatorGather;
        private _bound:BoundingVolumeBase;
        public skeleton:Skeleton;

        constructor() {
            this._subGeometries = [];
        }

        public get bound():BoundingVolumeBase {
            if (this._bound == null) {
                this._bound = new AxisAlignedBoundingBox();
                this._bound.fromGeometry(this);
            }
            return this._bound;
        }

        public set bound(value:BoundingVolumeBase) {
            this._bound = value;
        }

        public get animator():IAnimatorGather {
            return this._animator;
        }

        public set animator(value:IAnimatorGather) {
            this._animator = value;
        }

        public get subGeometries():Array<ISubGeometry> {
            return this._subGeometries;
        }

        public addSubGeometry(subGeometry:ISubGeometry):void {
            this._subGeometries.push(subGeometry);
            subGeometry.parentGeometry = this;
        }

        public removeSubGeometry(subGeometry:ISubGeometry):void {
            this._subGeometries.splice(this._subGeometries.indexOf(subGeometry), 1);
            subGeometry.parentGeometry = null;
        }

        public dispose():void {
            if (this._subGeometries != null) {
                while (this._subGeometries.length > 0) {
                    var subGeom:ISubGeometry = this._subGeometries.shift();
                    subGeom.parentGeometry = null;
                }
            }
            if (this._animator != null) {
                this._animator.dispose();
                this._animator = null;
            }

            if (this.skeleton != null) {
                this.skeleton.dispose();
                this.skeleton = null;
            }
        }

        public get numSubGeometry():number {
            return this._subGeometries.length;
        }
    }
}