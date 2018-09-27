module aoi {
    import Vector3D = math.Vector3D;
    export class LookAtController {
        protected _targetObject:IController;
        protected _lookAtPosition:Vector3D;
        protected _lookAtObject:Object3DContainer;
        protected _orgin:Vector3D = new Vector3D();

        constructor(targetObject:IController, lookAtObject:Object3DContainer = null, lookAtPosition:Vector3D = null) {
            this._targetObject = targetObject;
            this._lookAtObject = lookAtObject;
            this._lookAtPosition = lookAtPosition;
            if (this._lookAtObject == null && this._lookAtPosition == null) {
                this._lookAtPosition = new Vector3D();
            }
        }

        public get lookAtPosition():Vector3D {
            return this._lookAtPosition;
        }

        public set lookAtPosition(value:Vector3D) {
            this._lookAtPosition = value;
        }

        public get lookAtObject():Object3DContainer {
            return this._lookAtObject;
        }

        public set lookAtObject(value:Object3DContainer) {
            this._lookAtObject = value;
        }

        public update():void {
            if (this._targetObject != null) {
                if (this._lookAtObject != null) {
                    this._targetObject.lookAt(this._lookAtObject.scenePosition, null);
                }
                else {
                    this._targetObject.lookAt(this._lookAtPosition, null);
                }
            }
        }
    }
}