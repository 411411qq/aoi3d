module aoi
{
    export class EffectRotationBehavior extends EffectBehaviorData
    {
        public list:EffectInsertList;
        constructor()
        {
            super();
            this.list = new aoi.EffectInsertList();
            this.list.circle = 1;
            var a:EffectBehaviorInsertData = new EffectBehaviorInsertData();
            a.lastTime = 500;
            a.valueX = 360;
            a.valueY = 360;
            a.valueZ = 360;
            this.list.insertList.push(a);

            var b:EffectBehaviorInsertData = new EffectBehaviorInsertData();
            b.lastTime = 500;
            b.valueX = 0;
            b.valueY = 0;
            b.valueZ = 0;
            this.list.insertList.push(b);
        }
        protected _update(item:EffectItem, pt:number):void
        {
            this.list.startX = item.data.rotX;
            this.list.startY = item.data.rotY;
            this.list.startZ = item.data.rotZ;
            var obj:Object = this.list.getCurState(pt);
            item.rotationX = obj["x"];
            item.rotationY = obj["y"];
            item.rotationZ = obj["z"];
        }
    }
}