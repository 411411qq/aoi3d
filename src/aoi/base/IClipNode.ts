module aoi {
    import IAnimatorGather = aoi.IAnimatorGather;
    export interface IClipNode {
        addFrame(obj:Object):void;
        numFrames:number;
        clipName:string;
        getFrame(index:number):Object;
        frameInterval:number;
        adjustRate:number;
        getTotalTime(action:number, owner:IAnimatorGather):number;
    }
}