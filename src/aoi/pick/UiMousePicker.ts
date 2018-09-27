module aoi
{
    import IBase2D = aoi.IBase2D;
    import Vector3D = math.Vector3D;
    export class UiMousePicker implements IPicker
    {
        constructor()
        {
        }
        public getViewCollision(x:number, y:number, view:View, renderList:RenderList):IMouseObj {
            var vec = renderList.mouseVec;
            var tempx:number = x - view.width / 2;
            var tempy:number = view.height / 2 - y;
            var i:number = vec.length - 1;
            var v:Vector3D = new Vector3D();
            for(;i>=0;i--)
            {
                var temp:IMouseObj = vec[i];
                if(temp["visible"] == false || temp["mouseEnable"] == false)
                {
                    continue;
                }
                v.setTo(tempx, tempy, 0);
                v = temp["inverseSceneTransform"].transformVector(v);
                if(temp["rect"].containPoint2(v.x, v.y) == true)
                {
                    return temp;
                }
            }
            return null;
        }
    }
}