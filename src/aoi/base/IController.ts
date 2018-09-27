module aoi {
    import Vector3D = math.Vector3D;
    export interface IController {
        lookAt(target:Vector3D, upAxis:Vector3D):void;
        x:number;
        y:number;
        z:number;
    }
}