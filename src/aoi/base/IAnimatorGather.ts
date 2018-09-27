module aoi {
    export interface IAnimatorGather extends IDispose {
        getAction(action:number):IClipNode;
        addAction(action:number, clip:IClipNode):void;
        delAction(action:number):void;
        isActionReady(action:number):boolean;
    }
}