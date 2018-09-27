module aoi
{
    export class EffectScaleBehavior extends EffectBehaviorData
    {
        public list:EffectInsertList;
        constructor()
        {
            super();
            this.list = new aoi.EffectInsertList();
            this.list.circle = 1;
            var a:EffectBehaviorInsertData = new EffectBehaviorInsertData();
            a.lastTime = 500;
            a.valueX = 2;
            a.valueY = 2;
            a.valueZ = 2;
            this.list.insertList.push(a);

            var b:EffectBehaviorInsertData = new EffectBehaviorInsertData();
            b.lastTime = 500;
            b.valueX = 1;
            b.valueY = 1;
            b.valueZ = 1;
            this.list.insertList.push(b);
        }
        protected _update(item:EffectItem, pt:number):void
        {
            this.list.startX = item.data.scaX;
            this.list.startY = item.data.scaY;
            this.list.startZ = item.data.scaZ;
            var obj:Object = this.list.getCurState(pt);
            item.scaleX = obj["x"];
            item.scaleY = obj["y"];
            item.scaleZ = obj["z"];
        }
    }
}