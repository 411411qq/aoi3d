module editor
{
    import EventDispatcher = base.EventDispatcher;
    import EffectGroupData = aoi.EffectGroupData;
    import EffectGeoData = aoi.EffectGeoData;
    import EffectDistanceBehavior = aoi.EffectDistanceBehavior;
    import EffectRotationBehavior = aoi.EffectRotationBehavior;
    import EffectScaleBehavior = aoi.EffectScaleBehavior;
    import EffectColorBehavior = aoi.EffectColorBehavior;
    export class DataCenter extends EventDispatcher
    {
        private static _instance:DataCenter;
        public static get instance():DataCenter
        {
            if(DataCenter._instance == null)
            {
                DataCenter._instance = new DataCenter();
            }
            return DataCenter._instance;
        }
        private _mainData:EffectGroupData;
        public get mainData():EffectGroupData
        {
            if(this._mainData == null)
            {
                this._mainData = new EffectGroupData();
                var geoData:EffectGeoData = new EffectGeoData();
                geoData.type = 0;
                geoData.geoType = 1;
                geoData.w = 100;
                geoData.h = 100;
                geoData.d = 100;
                geoData.posX = 100;
                geoData.behaviorVec.push(new EffectDistanceBehavior());
                geoData.behaviorVec.push(new EffectRotationBehavior());
                geoData.behaviorVec.push(new EffectScaleBehavior());
                geoData.behaviorVec.push(new EffectColorBehavior());
                geoData.initData();
                this._mainData.addEffect(geoData);
            }
            return this._mainData;
        }
    }
    export class EventDefine
    {
        static TEXT_EVENT:string = "TEXT_EVENT";
        static CREATE_GEO:string = "CREATE_GEO";
    }
}