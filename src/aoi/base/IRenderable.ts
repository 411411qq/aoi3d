module aoi {
     import Matrix4 = math.Matrix4;
     export interface IRenderable extends IBoundsOwner {
          addPlugin(vo:IPlunginVo):void;
          removePlugin(type:number):void;
          pluginCollector:PlunginCollecter;

          material:IMaterial;
          geometry:Geometry;
          animatorData:AnimatorPlayData;

          render(context:WebGLRenderingContext, camera:ICamera, renderType:number):void;
          visible:boolean;
          caculateRenderDepth(camera:ICamera):void;
          renderDepth:number;
          alpha:Number;
          hasAlpha:boolean;

          getCullState(context:WebGLRenderingContext):number;
          setCullState(val:number):void;
          getFinalMatrix():Matrix4;
     }
}