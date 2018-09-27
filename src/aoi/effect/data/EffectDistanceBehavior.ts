module aoi
{
    export class EffectDistanceBehavior extends EffectBehaviorData
    {
        public list:EffectInsertList;
        constructor()
        {
            super();
            this.list = new aoi.EffectInsertList();
            this.list.circle = 1;
            var a:EffectBehaviorInsertData = new EffectBehaviorInsertData();
            a.lastTime = 500;
            a.valueX = 100;
            a.valueY = 100;
            a.valueZ = 100;
            this.list.insertList.push(a);

            var b:EffectBehaviorInsertData = new EffectBehaviorInsertData();
            b.lastTime = 500;
            b.valueX = -20;
            b.valueY = 250;
            b.valueZ = 150;
            this.list.insertList.push(b);

            var c:EffectBehaviorInsertData = new EffectBehaviorInsertData();
            c.lastTime = 500;
            c.valueX = 100;
            c.valueY = 0;
            c.valueZ = 0;
            this.list.insertList.push(c);
        }
        protected _update(item:EffectItem, pt:number):void
        {
            this.list.startX = item.data.posX;
            this.list.startY = item.data.posY;
            this.list.startZ = item.data.posZ;
            var obj:Object = this.list.getCurState(pt);
            item.x = obj["x"];
            item.y = obj["y"];
            item.z = obj["z"];
        }
    }
}